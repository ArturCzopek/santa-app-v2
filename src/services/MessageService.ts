import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { MessageData } from '../models/Message';

export class MessageService {
  private messagesCollection = collection(db, 'messages');

  // One document per user per UTC day. The rules only allow creating the
  // document for today and never overwriting it, which enforces the
  // one-message-per-day limit.
  private todayMessageRef(userUid: string) {
    const now = new Date();
    const day = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
    return doc(this.messagesCollection, `${userUid}_${day}`);
  }

  async sendMessage(messageData: Omit<MessageData, 'date'>): Promise<void> {
    try {
      await setDoc(this.todayMessageRef(messageData.userUid), {
        ...messageData,
        date: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async canUserSendMessageToday(userUid: string): Promise<boolean> {
    try {
      if (!userUid) return false;

      const todayMessage = await getDoc(this.todayMessageRef(userUid));
      return !todayMessage.exists();
    } catch (error) {
      console.error('Error checking if user can send message:', error);
      return false;
    }
  }
}

export const messageService = new MessageService();
