import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { ChatMessage } from '../models/Draw';

// The chat of one recipient and their (unknown to them) Santa.
class ChatService {
  private messagesCollection(drawId: string, recipientUid: string) {
    return collection(db, 'draws', drawId, 'chats', recipientUid, 'messages');
  }

  // Live updates; the newest messages come last. A message just written by
  // this client has no server time yet, so it sorts last until it has one.
  subscribe(
    drawId: string,
    recipientUid: string,
    onMessages: (messages: ChatMessage[]) => void,
    onError: (error: Error) => void,
  ): Unsubscribe {
    const q = query(
      this.messagesCollection(drawId, recipientUid),
      orderBy('createdDate', 'asc'),
    );
    return onSnapshot(
      q,
      (snapshot) =>
        onMessages(
          snapshot.docs.map((d) => {
            const data = d.data({ serverTimestamps: 'estimate' });
            return {
              id: d.id,
              from: data.from,
              text: data.text,
              createdDate:
                data.createdDate instanceof Timestamp
                  ? data.createdDate.toDate()
                  : null,
            };
          }),
        ),
      onError,
    );
  }

  async send(
    drawId: string,
    recipientUid: string,
    from: ChatMessage['from'],
    text: string,
  ): Promise<void> {
    await addDoc(this.messagesCollection(drawId, recipientUid), {
      from,
      text,
      createdDate: serverTimestamp(),
    });
  }
}

export const chatService = new ChatService();
