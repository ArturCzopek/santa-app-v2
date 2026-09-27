import { Timestamp } from 'firebase/firestore';

export type MessageData = {
  userUid: string;
  userName: string;
  message: string;
  date: Timestamp;
};

export type MessageDocument = MessageData & { id: string };

// Same limit as in firestore.rules.
export const MESSAGE_MAX_LENGTH = 1000;
