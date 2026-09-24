import {
  collection,
  doc,
  FirestoreError,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { MessageData } from '../models/Message';

const DAY_MS = 24 * 60 * 60 * 1000;

export class MessageService {
  private messagesCollection = collection(db, 'messages');

  // One document per user per UTC day. The rules only allow creating the
  // document for today and never overwriting it, which enforces the
  // one-message-per-day limit.
  private messageRef(userUid: string, dayOffset = 0) {
    const day = new Date(Date.now() + dayOffset * DAY_MS);
    const id = `${day.getUTCFullYear()}-${day.getUTCMonth() + 1}-${day.getUTCDate()}`;
    return doc(this.messagesCollection, `${userUid}_${id}`);
  }

  async sendMessage(messageData: Omit<MessageData, 'date'>): Promise<void> {
    // "Today" is decided by the server clock. Around midnight UTC, or with
    // the device clock a bit off, the browser may be on the other side of
    // midnight, so try the neighbouring days too. The rules still accept
    // only one of them, and only once.
    let denied: unknown;
    for (const dayOffset of [0, 1, -1]) {
      try {
        await setDoc(this.messageRef(messageData.userUid, dayOffset), {
          ...messageData,
          date: serverTimestamp(),
        });
        return;
      } catch (error) {
        if ((error as FirestoreError).code !== 'permission-denied') {
          console.error('Error sending message:', error);
          throw error;
        }
        denied = error;
      }
    }
    // Most likely today's message was already sent.
    console.error('Error sending message:', denied);
    throw denied;
  }

  async canUserSendMessageToday(userUid: string): Promise<boolean> {
    try {
      if (!userUid) return false;

      const todayMessage = await getDoc(this.messageRef(userUid));
      return !todayMessage.exists();
    } catch (error) {
      console.error('Error checking if user can send message:', error);
      return false;
    }
  }
}

export const messageService = new MessageService();
