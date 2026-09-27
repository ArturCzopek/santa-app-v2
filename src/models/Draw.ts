import { Timestamp } from 'firebase/firestore';

// Stored in draws/{drawId}/participants/{userUuid}, readable by participants
// of the draw. The letter itself is in draws/{drawId}/letters/{userUuid},
// readable only by its author and, after the draw, their Santa; hasWish
// says only whether it is written. giftBought is the giver's public status.
export type Participant = {
  userName: string;
  userUuid: string;
  userPhotoUrl: string;
  entryDate: Date | Timestamp;
  hasWish?: boolean;
  giftBought?: boolean;
};

// Same limit as in firestore.rules.
export const WISH_MAX_LENGTH = 2000;
export const WISH_ITEM_MAX_LENGTH = 100;
export const WISH_MAX_ITEMS = 10;
export const LETTER_COMMENT_MAX_LENGTH = 1000;
export const THANKS_MAX_LENGTH = 500;

export type Letter = {
  wish: string;
  comment: string;
};

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
  ownerPlays: boolean;
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
  // Missing on draws created before the organizer could opt out.
  ownerPlays?: boolean;
};

// The owner stays in participantUuids for management access, even when they
// choose not to play. Missing ownerPlays means older draws include the owner.
export const getDrawPlayers = (
  draw: Pick<Draw, 'participantUuids' | 'ownerUuid' | 'ownerPlays'>,
): string[] =>
  draw.ownerPlays === false
    ? draw.participantUuids.filter((uid) => uid !== draw.ownerUuid)
    : draw.participantUuids;

export type DrawPreview = Pick<
  Draw,
  'id' | 'drawName' | 'description' | 'status' | 'eventDate' | 'eventPlace'
> & {
  participantsCount: number;
  userWishProvided: boolean;
  isPlayer: boolean;
};
