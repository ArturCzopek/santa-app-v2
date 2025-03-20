import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { MessageData } from '../models/Message';

export class MessageService {
  private messagesCollection = collection(db, 'messages');

  async sendMessage(messageData: MessageData): Promise<void> {
    try {
      const firestoreData = {
        ...messageData,
        date: Timestamp.fromDate(messageData.date),
      };

      await addDoc(this.messagesCollection, firestoreData);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async canUserSendMessageToday(userUid: string): Promise<boolean> {
    try {
      if (!userUid) return false;

      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );

      const q = query(
        this.messagesCollection,
        where('userUid', '==', userUid),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay)),
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error('Error checking if user can send message:', error);
      return false;
    }
  }
}

export const messageService = new MessageService();
