import { Timestamp } from 'firebase/firestore';

// Stored in draws/{drawId}/participants/{userUuid}, readable by participants
// of the draw. The letter itself is in draws/{drawId}/letters/{userUuid},
// readable only by its author and, after the draw, their Santa; hasWish
// says only whether it is written.
export type Participant = {
  userName: string;
  userUuid: string;
  userPhotoUrl: string;
  entryDate: Date | Timestamp;
  hasWish?: boolean;
};

// Same limit as in firestore.rules.
export const WISH_MAX_LENGTH = 2000;

export type Pair = {
  fromUuid: string;
  toUuid: string;
};

// Stored in draws/{drawId}/assignments/{giverUuid}, readable only by the giver.
export type Assignment = {
  toUuid: string;
};

// The fields the owner fills in when creating (and later editing) a draw.
export type DrawDetails = {
  drawName: string;
  description: string;
  budget: number;
  currency: string;
  eventDate: string; // 'YYYY-MM-DD' of the gift exchange, or ''
  eventPlace: string;
};

export type Draw = {
  id?: string; // nullable, only needed for read as a doc id
  createdDate: Date | Timestamp;
  ownerUuid: string;
  ownerName: string;
  ownerPhotoUrl?: string;
  budget: number;
  currency: string;
  drawName: string;
  description: string;
  participants: Participant[]; // loaded from the subcollection, not stored in the draw document
  participantUuids: string[];
  status: 'WAITING_FOR_DRAW' | 'DRAWED';
  drawDate?: Date | Timestamp | null;
  // Missing on draws created before these fields existed.
  eventDate?: string;
  eventPlace?: string;
};

export type DrawPreview = Pick<
  Draw,
  'id' | 'drawName' | 'description' | 'status' | 'eventDate' | 'eventPlace'
> & {
  participantsCount: number;
  userWishProvided: boolean;
};
