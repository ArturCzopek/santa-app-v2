import { Timestamp } from 'firebase/firestore';

export type MessageData = {
  userUid: string;
  userName: string;
  message: string;
  date: Timestamp;
};
