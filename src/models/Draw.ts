import { Timestamp } from '@firebase/firestore';

export type Participant = {
  userName: string;
  userUuid: string;
  userPhotoUrl: string;
  entryDate: Date;
  wish?: string;
};

export type Pair = {
  fromUuid: string;
  toUuid: string;
};

export type Draw = {
  id?: string; // nullable, only needed for read as a doc id
  createdDate: Date;
  ownerUuid: string;
  ownerName: string;
  budget: number;
  currency: string;
  drawName: string;
  description: string;
  participants: Participant[];
  participantUuids: string[];
  pairs: Pair[];
  status: 'WAITING_FOR_DRAW' | 'DRAWED';
  drawDate?: Date | Timestamp | null;
  password: string;
};

export type DrawPreview = Pick<
  Draw,
  'id' | 'drawName' | 'description' | 'status'
> & {
  participantsCount: number;
  userWishProvided: boolean;
};
