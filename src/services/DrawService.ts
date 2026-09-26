import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  writeBatch,
  updateDoc,
  setDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  FirestoreError,
  WriteBatch,
} from 'firebase/firestore';
import { db } from './FirebaseConfig';
import {
  Draw,
  DrawDetails,
  DrawPreview,
  Participant,
} from '../models/Draw';
import { User } from 'firebase/auth';
import { PasswordUtils } from './PasswordUtils';
import { Exclusion } from './pairs';
import { appDataService } from './AppDataService';

class DrawService {
  private drawsCollection = collection(db, 'draws');

  private participantsCollection(drawId: string) {
    return collection(this.drawsCollection, drawId, 'participants');
  }

  // The password hash is only ever used as a document id in this collection.
  // Nobody can read or list it; the rules check it exists when someone joins.
  private joinKeyRef(drawId: string, joinKey: string) {
    return doc(this.drawsCollection, drawId, 'joinKeys', joinKey);
  }

  private letterRef(drawId: string, userId: string) {
    return doc(this.drawsCollection, drawId, 'letters', userId);
  }

  private exclusionsCollection(drawId: string) {
    return collection(this.drawsCollection, drawId, 'exclusions');
  }

  // One document per pair, with the two ids in a fixed order.
  private exclusionRef(drawId: string, [first, second]: Exclusion) {
    const [a, b] = [first, second].sort();
    return doc(this.exclusionsCollection(drawId), `${a}_${b}`);
  }

  private inviteRef(drawId: string) {
    return doc(this.drawsCollection, drawId, 'invite', 'link');
  }

  // Adds a fresh invite key (and its joinKeys document) to the batch.
  private async setNewInviteKey(
    batch: WriteBatch,
    drawId: string,
  ): Promise<string> {
    const key = PasswordUtils.newInviteKey();
    const joinKey = await PasswordUtils.joinKey(drawId, key);
    batch.set(this.joinKeyRef(drawId, joinKey), {
      createdDate: serverTimestamp(),
    });
    batch.set(this.inviteRef(drawId), {
      key,
      joinKey,
      createdDate: serverTimestamp(),
    });
    return key;
  }

  private newParticipant(user: User) {
    return {
      userName: user.displayName || 'Unknown User',
      userUuid: user.uid,
      userPhotoUrl: user.photoURL || '',
      entryDate: serverTimestamp(),
      hasWish: false,
    };
  }

  async createDraw(
    formData: DrawDetails & { password: string },
    currentUser: User,
  ): Promise<string> {
    if (!currentUser) {
      throw new Error('User must be authenticated to create a draw');
    }

    const drawRef = doc(this.drawsCollection);

    const newDraw = {
      createdDate: serverTimestamp(),
      ownerUuid: currentUser.uid,
      ownerName: currentUser.displayName || 'Unknown User',
      ownerPhotoUrl: currentUser.photoURL || '',
      budget: Number(formData.budget),
      currency: formData.currency,
      drawName: formData.drawName,
      description: formData.description,
      eventDate: formData.eventDate,
      eventPlace: formData.eventPlace,
      participantUuids: [currentUser.uid], // Owner is the first participant
      status: 'WAITING_FOR_DRAW',
      drawDate: null,
    };

    try {
      const batch = writeBatch(db);
      batch.set(drawRef, newDraw);
      batch.set(
        doc(this.participantsCollection(drawRef.id), currentUser.uid),
        this.newParticipant(currentUser),
      );
      batch.set(
        this.joinKeyRef(
          drawRef.id,
          await PasswordUtils.joinKey(drawRef.id, formData.password),
        ),
        { createdDate: serverTimestamp() },
      );
      await this.setNewInviteKey(batch, drawRef.id);
      appDataService.addDrawCreated(batch, drawRef.id);
      await batch.commit();

      return drawRef.id;
    } catch (error) {
      console.error('Error creating draw:', error);
      throw error;
    }
  }

  async getDrawPreviews(userId: string): Promise<DrawPreview[]> {
    try {
      const q = query(
        this.drawsCollection,
        where('participantUuids', 'array-contains', userId),
        orderBy('createdDate', 'desc'),
      );

      const querySnapshot = await getDocs(q);

      return Promise.all(
        querySnapshot.docs.map(async (drawDoc) => {
          const data = drawDoc.data();
          const ownParticipant = await getDoc(
            doc(this.participantsCollection(drawDoc.id), userId),
          );

          return {
            id: drawDoc.id,
            drawName: data.drawName,
            description: data.description,
            status: data.status,
            eventDate: data.eventDate ?? '',
            eventPlace: data.eventPlace ?? '',
            participantsCount: data.participantUuids?.length || 0,
            userWishProvided: !!ownParticipant.data()?.hasWish,
          } as DrawPreview;
        }),
      );
    } catch (error) {
      console.error('Error fetching user draws:', error);
      throw error;
    }
  }

  // Draw document only. Readable by any signed-in user who knows the id, so
  // it must never contain anything secret.
  async getDraw(drawId: string): Promise<Draw> {
    try {
      const drawSnapshot = await getDoc(doc(this.drawsCollection, drawId));

      if (!drawSnapshot.exists()) {
        throw new Error('Draw not found');
      }

      return {
        ...(drawSnapshot.data() as Omit<Draw, 'id' | 'participants'>),
        id: drawSnapshot.id,
        participants: [],
      };
    } catch (error) {
      console.error('Error fetching draw:', error);
      throw error;
    }
  }

  // Participants are readable only by participants of the draw. Letters are
  // not in there: see getLetter.
  async getParticipants(drawId: string): Promise<Participant[]> {
    const snapshot = await getDocs(this.participantsCollection(drawId));
    return snapshot.docs.map((participantDoc) => participantDoc.data() as Participant);
  }

  // The letter and the public "written" mark change together.
  async updateWish(drawId: string, userId: string, wish: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      batch.set(this.letterRef(drawId, userId), { wish });
      batch.update(doc(this.participantsCollection(drawId), userId), {
        hasWish: wish.length > 0,
      });
      await batch.commit();
    } catch (error) {
      console.error('Error updating wish:', error);
      throw error;
    }
  }

  // Owner only, before the draw (the rules refuse it afterwards).
  async updateDrawDetails(drawId: string, details: DrawDetails): Promise<void> {
    await updateDoc(doc(this.drawsCollection, drawId), details);
  }

  // A letter to Santa: the user's own, or after the draw the one of the
  // person they give a gift to. '' when not written yet.
  async getLetter(drawId: string, userId: string): Promise<string> {
    const letter = await getDoc(this.letterRef(drawId, userId));
    return letter.exists() ? (letter.data().wish as string) : '';
  }

  // Owner only, before the draw: the draw and everything under it go in one
  // batch, so nothing is left behind half-deleted.
  async deleteDraw(drawId: string): Promise<void> {
    const drawRef = doc(this.drawsCollection, drawId);
    const subcollections = await Promise.all([
      getDocs(this.participantsCollection(drawId)),
      getDocs(collection(drawRef, 'joinKeys')),
      getDocs(this.exclusionsCollection(drawId)),
    ]);
    const batch = writeBatch(db);
    subcollections.forEach((snapshot) =>
      snapshot.docs.forEach((d) => batch.delete(d.ref)),
    );
    // Nobody may list letters, but there is at most one per participant.
    const draw = await getDoc(drawRef);
    (draw.data()?.participantUuids ?? []).forEach((uid: string) =>
      batch.delete(this.letterRef(drawId, uid)),
    );
    batch.delete(this.inviteRef(drawId));
    batch.delete(drawRef);
    await batch.commit();
  }

  // A participant other than the owner, before the draw. Their letter goes
  // with them.
  async leaveDraw(drawId: string, userId: string): Promise<void> {
    const batch = writeBatch(db);
    batch.delete(doc(this.participantsCollection(drawId), userId));
    batch.delete(this.letterRef(drawId, userId));
    batch.update(doc(this.drawsCollection, drawId), {
      participantUuids: arrayRemove(userId),
    });
    await batch.commit();
  }

  // Owner only, before the draw: takes someone else out, with their letter
  // (unread) and the pairs they were in.
  async removeParticipant(drawId: string, userId: string): Promise<void> {
    const exclusions = await this.getExclusions(drawId);
    const batch = writeBatch(db);
    batch.delete(doc(this.participantsCollection(drawId), userId));
    batch.delete(this.letterRef(drawId, userId));
    exclusions
      .filter((pair) => pair.includes(userId))
      .forEach((pair) => batch.delete(this.exclusionRef(drawId, pair)));
    batch.update(doc(this.drawsCollection, drawId), {
      participantUuids: arrayRemove(userId),
    });
    await batch.commit();
  }

  // Owner only.
  async getExclusions(drawId: string): Promise<Exclusion[]> {
    const snapshot = await getDocs(this.exclusionsCollection(drawId));
    return snapshot.docs.map((d) => [d.data().a, d.data().b] as Exclusion);
  }

  // Owner only, before the draw.
  async addExclusion(drawId: string, exclusion: Exclusion): Promise<void> {
    const [a, b] = [...exclusion].sort();
    await setDoc(this.exclusionRef(drawId, exclusion), { a, b });
  }

  async removeExclusion(drawId: string, exclusion: Exclusion): Promise<void> {
    await deleteDoc(this.exclusionRef(drawId, exclusion));
  }

  // The key of the invite link, readable by participants. Draws created
  // before invite links have none until the owner makes one.
  async getInviteKey(drawId: string): Promise<string | null> {
    const invite = await getDoc(this.inviteRef(drawId));
    return invite.exists() ? (invite.data().key as string) : null;
  }

  // Owner only, before the draw. The previous link stops working.
  async renewInviteKey(drawId: string): Promise<string> {
    const current = await getDoc(this.inviteRef(drawId));
    const batch = writeBatch(db);
    const key = await this.setNewInviteKey(batch, drawId);
    if (current.exists()) {
      batch.delete(this.joinKeyRef(drawId, current.data().joinKey));
    }
    await batch.commit();
    return key;
  }

  // Only the owner may check the password (used to confirm starting the draw).
  // The invite link's key opens the same door, so it is ruled out here.
  async isDrawPasswordValid(drawId: string, password: string): Promise<boolean> {
    const joinKey = await PasswordUtils.joinKey(drawId, password);
    const [joinKeyDoc, invite] = await Promise.all([
      getDoc(this.joinKeyRef(drawId, joinKey)),
      getDoc(this.inviteRef(drawId)),
    ]);
    return joinKeyDoc.exists() && invite.data()?.joinKey !== joinKey;
  }

  // Owner only, before the draw. Replaces the password: every join key
  // except the current invite link's is removed and the new one added in
  // the same batch. People who already joined stay.
  async setDrawPassword(drawId: string, password: string): Promise<void> {
    const newKey = await PasswordUtils.joinKey(drawId, password);
    const [keys, invite] = await Promise.all([
      getDocs(collection(this.drawsCollection, drawId, 'joinKeys')),
      getDoc(this.inviteRef(drawId)),
    ]);
    const linkKey = invite.data()?.joinKey;

    const batch = writeBatch(db);
    keys.docs
      .filter((key) => key.id !== linkKey && key.id !== newKey)
      .forEach((key) => batch.delete(key.ref));
    if (!keys.docs.some((key) => key.id === newKey)) {
      batch.set(this.joinKeyRef(drawId, newKey), {
        createdDate: serverTimestamp(),
      });
    }
    await batch.commit();
  }

  // The secret is the draw password or the key from the invite link; both
  // are checked the same way.
  async joinToDraw(drawId: string, user: User, secret: string): Promise<void> {
    try {
      const draw = await this.getDraw(drawId);

      if (draw.status !== 'WAITING_FOR_DRAW') {
        throw new Error('Draw is not in waiting status');
      }

      if (draw.participantUuids.includes(user.uid)) {
        throw new Error('User is already a participant in this draw');
      }

      // Both writes land atomically, so concurrent joins cannot overwrite
      // each other. The rules accept them only if joinKey matches the draw's
      // password, so a rejected write here means a wrong password.
      const batch = writeBatch(db);
      batch.set(doc(this.participantsCollection(drawId), user.uid), {
        ...this.newParticipant(user),
        joinKey: await PasswordUtils.joinKey(drawId, secret),
      });
      batch.update(doc(this.drawsCollection, drawId), {
        participantUuids: arrayUnion(user.uid),
      });

      try {
        await batch.commit();
      } catch (error) {
        if ((error as FirestoreError).code === 'permission-denied') {
          throw new Error('Invalid password');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error joining draw:', error);
      throw error;
    }
  }
}

export const drawService = new DrawService();
