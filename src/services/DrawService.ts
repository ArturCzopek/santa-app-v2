import { collection, addDoc, getDocs, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Draw, Participant } from '../models/Draw';
import { User } from 'firebase/auth';

class DrawService {
  async createDraw(
    formData: { drawName: string; description: string; budget: number; currency: string },
    currentUser: User
  ): Promise<string> {
    if (!currentUser) {
      throw new Error('User must be authenticated to create a draw');
    }

    const participant: Participant = {
      userName: currentUser.displayName || 'Unknown User',
      userUuid: currentUser.uid,
      userPhotoUrl: currentUser.photoURL || '',
      entryDate: new Date(),
      wish: ''
    };

    const newDraw: Draw = {
      createdDate: new Date(),
      ownerUuid: currentUser.uid,
      ownerName: currentUser.displayName || 'Unknown User',
      budget: formData.budget,
      currency: formData.currency,
      drawName: formData.drawName,
      description: formData.description,
      participants: [participant], // Owner is the first participant
      participantUuids: [participant.userUuid], // Owner is the first participant
      pairs: [], // Empty initially
      status: 'WAITING_FOR_DRAW',
      drawDate: null
    };

    try {
      const docRef = await addDoc(collection(db, 'draws'), newDraw);
      return docRef.id;
    } catch (error) {
      console.error('Error creating draw:', error);
      throw error;
    }
  }

  async getUserDraws(userId: string): Promise<Draw[]> {
    try {
      const drawsCollection = collection(db, 'draws');
      const q = query(
        drawsCollection,
        where('participantUuids', 'array-contains', userId)
      );

      const querySnapshot = await getDocs(q);
      const draws: Draw[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Draw;
        // Convert Firestore timestamps to JavaScript Date objects
        const draw: Draw = {
          ...data,
          id: doc.id, // Make sure to include the document ID
        };
        draws.push(draw);
      });

      return draws;
    } catch (error) {
      console.error('Error getting user draws:', error);
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
}

export const drawService = new DrawService();