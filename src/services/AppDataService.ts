import {
  doc,
  getDoc,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { AppData } from '../models/AppData';

export class AppDataService {
  private appDataDocRef = doc(db, 'appData', 'stats');

  async getAppData(): Promise<AppData> {
    try {
      const docSnap = await getDoc(this.appDataDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as AppData;
        return data;
      }

      await setDoc(this.appDataDocRef, { drawsCount: 0, winnersCount: 0 });
      return { drawsCount: 0, winnersCount: 0 };
    } catch (error) {
      console.error('Error fetching winners count:', error);
      return { drawsCount: 0, winnersCount: 0 };

    }
  }

  async addDrawsCount(count: number): Promise<number> {
    try {
      const appData = await this.getAppData();
      const newCount = appData.drawsCount + count;
      await updateDoc(this.appDataDocRef, { ...appData, drawsCount: newCount });

      return newCount;
    } catch (error) {
      console.error('Error updating winners count:', error);
      return 0;
    }
  }

  async addWinnersCount(count: number): Promise<number> {
    try {
      const appData = await this.getAppData();
      const newCount = appData.winnersCount + count;
      await updateDoc(this.appDataDocRef, { ...appData, winnersCount: newCount });

      return newCount;
    } catch (error) {
      console.error('Error updating winners count:', error);
      return 0;
    }
  }
}

export const appDataService = new AppDataService();