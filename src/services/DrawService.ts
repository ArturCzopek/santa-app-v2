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
  arrayUnion,
  serverTimestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { Draw, DrawPreview, Participant } from '../models/Draw';
import { User } from 'firebase/auth';
import { PasswordUtils } from './PasswordUtils';
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

  private newParticipant(user: User) {
    return {
      userName: user.displayName || 'Unknown User',
      userUuid: user.uid,
      userPhotoUrl: user.photoURL || '',
      entryDate: serverTimestamp(),
      wish: '',
    };
  }

  async createDraw(
    formData: {
      drawName: string;
      description: string;
      budget: number;
      currency: string;
      password: string;
    },
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
      appDataService.addDrawCreated(batch);
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
            participantsCount: data.participantUuids?.length || 0,
            userWishProvided: !!ownParticipant.data()?.wish,
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

  // Participants (with wishes) are readable only by participants of the draw.
  async getParticipants(drawId: string): Promise<Participant[]> {
    const snapshot = await getDocs(this.participantsCollection(drawId));
    return snapshot.docs.map((participantDoc) => participantDoc.data() as Participant);
  }

  async updateWish(drawId: string, userId: string, wish: string): Promise<void> {
    try {
      await updateDoc(doc(this.participantsCollection(drawId), userId), {
        wish,
      });
    } catch (error) {
      console.error('Error updating wish:', error);
      throw error;
    }
  }

  // Only the owner may check the password (used to confirm starting the draw).
  async isDrawPasswordValid(drawId: string, password: string): Promise<boolean> {
    const joinKey = await getDoc(
      this.joinKeyRef(drawId, await PasswordUtils.joinKey(drawId, password)),
    );
    return joinKey.exists();
  }

  async joinToDraw(drawId: string, user: User, password: string): Promise<void> {
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
        joinKey: await PasswordUtils.joinKey(drawId, password),
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
