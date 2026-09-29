import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { Exclusion, generatePairs } from './pairs';

initializeApp();

const db = getFirestore();

export const startDraw = onCall(
  { region: 'europe-central2', maxInstances: 5 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign-in is required.');
    }

    const { drawId } = request.data ?? {};
    if (
      typeof drawId !== 'string' ||
      drawId.length === 0 ||
      drawId.includes('/')
    ) {
      throw new HttpsError('invalid-argument', 'drawId must be a string.');
    }

    const drawRef = db.collection('draws').doc(drawId);
    return db.runTransaction(async (transaction) => {
      const drawSnapshot = await transaction.get(drawRef);
      if (!drawSnapshot.exists) {
        throw new HttpsError('not-found', 'Draw not found.');
      }

      const draw = drawSnapshot.data()!;
      if (draw.ownerUuid !== request.auth!.uid) {
        throw new HttpsError(
          'permission-denied',
          'Only the owner can start the draw.',
        );
      }
      if (draw.status !== 'WAITING_FOR_DRAW') {
        throw new HttpsError(
          'failed-precondition',
          'The draw has already started.',
        );
      }

      const participantUuids = draw.participantUuids as string[];
      const players =
        draw.ownerPlays === false
          ? participantUuids.filter((uid) => uid !== draw.ownerUuid)
          : participantUuids;
      if (players.length < 2) {
        throw new HttpsError(
          'failed-precondition',
          'The draw needs at least two players.',
        );
      }

      const exclusionSnapshot = await transaction.get(
        drawRef.collection('exclusions'),
      );
      const exclusions = exclusionSnapshot.docs.map(
        (document) => [document.data().a, document.data().b] as Exclusion,
      );

      let pairs;
      try {
        pairs = generatePairs(players, exclusions);
      } catch (error) {
        throw new HttpsError(
          'failed-precondition',
          error instanceof Error
            ? error.message
            : 'The draw cannot be completed.',
        );
      }

      const drawDate = new Date().toISOString();
      transaction.update(drawRef, {
        status: 'DRAWED',
        drawDate: FieldValue.serverTimestamp(),
      });
      pairs.forEach(({ fromUuid, toUuid }) => {
        transaction.set(drawRef.collection('assignments').doc(fromUuid), {
          toUuid,
        });
      });
      transaction.set(
        db.collection('appData').doc('stats'),
        { winnersCount: FieldValue.increment(pairs.length) },
        { merge: true },
      );

      return { drawDate };
    });
  },
);
