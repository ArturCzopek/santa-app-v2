import { doc, getDoc, increment, WriteBatch } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { AppData } from '../models/AppData';

export class AppDataService {
  private appDataDocRef = doc(db, 'appData', 'stats');

  async getAppData(): Promise<AppData> {
    try {
      const docSnap = await getDoc(this.appDataDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          drawsCount: data.drawsCount ?? 0,
          winnersCount: data.winnersCount ?? 0,
        };
      }

      return { drawsCount: 0, winnersCount: 0 };
    } catch (error) {
      console.error('Error fetching winners count:', error);
      return { drawsCount: 0, winnersCount: 0 };
    }
  }

  // Counters are updated atomically in the same batch as the draw change
  // they count, so concurrent draws cannot lose increments.
  addDrawCreated(batch: WriteBatch): void {
    batch.set(this.appDataDocRef, { drawsCount: increment(1) }, { merge: true });
  }

  addDrawStarted(batch: WriteBatch, winnersCount: number): void {
    batch.set(
      this.appDataDocRef,
      { winnersCount: increment(winnersCount) },
      { merge: true },
    );
  }
}

export const appDataService = new AppDataService();
