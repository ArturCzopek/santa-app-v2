import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  getCountFromServer, setDoc
} from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { Draw, DrawPreview, Participant } from '../models/Draw';
import { User } from 'firebase/auth';
import CryptoJS from 'crypto-js';

class DrawService {
  private drawsCollection = collection(db, 'draws');

  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
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

    const participant: Participant = {
      userName: currentUser.displayName || 'Unknown User',
      userUuid: currentUser.uid,
      userPhotoUrl: currentUser.photoURL || '',
      entryDate: new Date(),
      wish: '',
    };

    const newDraw: Draw = {
      createdDate: new Date(),
      ownerUuid: currentUser.uid,
      ownerName: currentUser.displayName || 'Unknown User',
      budget: formData.budget,
      currency: formData.currency,
      drawName: formData.drawName,
      description: formData.description,
      password: this.hashPassword(formData.password),
      participants: [participant], // Owner is the first participant
      participantUuids: [participant.userUuid], // Owner is the first participant
      pairs: [], // Empty initially
      status: 'WAITING_FOR_DRAW',
      drawDate: null,
    };

    try {
      const docRef = await addDoc(collection(db, 'draws'), newDraw);
      return docRef.id;
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
      );

      const querySnapshot = await getDocs(q);

      // Map the documents to DrawPreview type
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            drawName: doc.data().drawName,
            description: doc.data().description,
            status: doc.data().status,
            participantsCount: doc.data().participants?.length || 0,
            userWishProvided: doc
              .data()
              .participants?.find((p) => p.userUuid === userId).wish,
          }) as DrawPreview,
      );
    } catch (error) {
      console.error('Error fetching user draws:', error);
      throw error;
    }
  }

  async getDrawDetails(drawId: string): Promise<Draw> {
    try {
      const drawRef = doc(this.drawsCollection, drawId);
      const drawSnapshot = await getDoc(drawRef);

      if (!drawSnapshot.exists()) {
        throw new Error('Draw not found');
      }

      return {
        id: drawSnapshot.id,
        ...drawSnapshot.data(),
      } as Draw;
    } catch (error) {
      console.error('Error fetching draw details:', error);
      throw error;
    }
  }

  /**
   * Get the total count of draws in the app
   */
  async getTotalDrawsCount(): Promise<number> {
    try {
      const drawsCollection = collection(db, 'draws');
      const snapshot = await getCountFromServer(drawsCollection);
      return snapshot.data().count;
    } catch (error) {
      console.error('Error counting draws:', error);
      throw error;
    }
  }

  async updateDraw(draw: Draw): Promise<void> {
    if (!draw.id) {
      throw new Error('Draw ID is required for updating');
    }

    try {
      const drawRef = doc(this.drawsCollection, draw.id);
      await setDoc(drawRef, draw);
    } catch (error) {
      console.error('Error updating draw:', error);
      throw error;
    }
  }
}

export const drawService = new DrawService();
