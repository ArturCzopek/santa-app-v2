import { createHash } from 'crypto';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

const isLegacy = (data) =>
  Array.isArray(data.participants) ||
  Array.isArray(data.pairs) ||
  typeof data.password === 'string';

/**
 * Moves draws from the old single-document format to the current one:
 * - participants array -> draws/{id}/participants/{uid} (+ letters/{uid})
 * - pairs array        -> draws/{id}/assignments/{fromUuid}
 * - password (sha256)  -> draws/{id}/joinKeys/{sha256(id + ':' + password)}
 * and removes those fields from the draw document. Draws already in the new
 * format are skipped, so the migration can be re-run safely.
 *
 * @param {import('firebase-admin/firestore').Firestore} db
 * @param {{ apply: boolean, log?: (message: string) => void }} options
 */
export const migrateDraws = async (db, { apply, log = console.log }) => {
  const snapshot = await db.collection('draws').get();
  let migrated = 0;

  for (const drawDoc of snapshot.docs) {
    const data = drawDoc.data();
    if (!isLegacy(data)) continue;

    const drawRef = drawDoc.ref;
    const participants = data.participants ?? [];
    const pairs = data.pairs ?? [];
    const owner = participants.find((p) => p.userUuid === data.ownerUuid);

    const batch = db.batch();
    let writes = 0;

    for (const participant of participants) {
      const wish = participant.wish ?? '';
      batch.set(drawRef.collection('participants').doc(participant.userUuid), {
        userName: participant.userName ?? 'Unknown User',
        userUuid: participant.userUuid,
        userPhotoUrl: participant.userPhotoUrl ?? '',
        entryDate: participant.entryDate ?? data.createdDate ?? Timestamp.now(),
        hasWish: wish.length > 0,
      });
      writes++;
      if (wish) {
        batch.set(drawRef.collection('letters').doc(participant.userUuid), {
          wish,
        });
        writes++;
      }
    }

    for (const pair of pairs) {
      batch.set(drawRef.collection('assignments').doc(pair.fromUuid), {
        toUuid: pair.toUuid,
      });
      writes++;
    }

    if (typeof data.password === 'string') {
      batch.set(
        drawRef.collection('joinKeys').doc(sha256(`${drawDoc.id}:${data.password}`)),
        { createdDate: data.createdDate ?? Timestamp.now() },
      );
      writes++;
    }

    const drawUpdate = {
      participants: FieldValue.delete(),
      pairs: FieldValue.delete(),
      password: FieldValue.delete(),
      participantUuids:
        data.participantUuids ?? participants.map((p) => p.userUuid),
      ownerPhotoUrl: data.ownerPhotoUrl ?? owner?.userPhotoUrl ?? '',
    };
    if (typeof data.budget === 'string') {
      drawUpdate.budget = Number(data.budget);
    }
    batch.update(drawRef, drawUpdate);
    writes++;

    if (writes > 500) {
      throw new Error(`Draw ${drawDoc.id} needs ${writes} writes (max 500)`);
    }

    log(
      `${apply ? 'Migrating' : 'Would migrate'} ${drawDoc.id} "${data.drawName}": ` +
        `${participants.length} participants, ${pairs.length} pairs, ` +
        `${typeof data.password === 'string' ? 'password' : 'no password'}`,
    );

    if (apply) await batch.commit();
    migrated++;
  }

  log(
    `${migrated} of ${snapshot.size} draws ${apply ? 'migrated' : 'need migration'}.`,
  );
  return migrated;
};

/**
 * Moves letters to Santa out of participant documents (readable by every
 * participant) into draws/{id}/letters/{uid} (readable only by the author
 * and their Santa), leaving hasWish behind. Participants already without a
 * wish field are skipped, so the migration can be re-run safely.
 *
 * @param {import('firebase-admin/firestore').Firestore} db
 * @param {{ apply: boolean, log?: (message: string) => void }} options
 */
export const migrateLetters = async (db, { apply, log = console.log }) => {
  const snapshot = await db.collectionGroup('participants').get();
  const toMove = snapshot.docs.filter((d) => d.data().wish !== undefined);

  // Two writes per participant, well under the 500 per batch.
  for (let start = 0; start < toMove.length; start += 200) {
    const batch = db.batch();
    for (const participantDoc of toMove.slice(start, start + 200)) {
      const wish = String(participantDoc.data().wish ?? '');
      if (wish) {
        batch.set(
          participantDoc.ref.parent.parent.collection('letters').doc(participantDoc.id),
          { wish },
        );
      }
      batch.update(participantDoc.ref, {
        hasWish: wish.length > 0,
        wish: FieldValue.delete(),
      });
    }
    if (apply) await batch.commit();
  }

  log(
    `${toMove.length} of ${snapshot.size} participants' letters ${
      apply ? 'moved' : 'need moving'
    }.`,
  );
  return toMove.length;
};
