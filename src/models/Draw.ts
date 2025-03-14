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
  createdDate: Date;
  ownerUuid: string;
  ownerName: string;
  budget: number;
  currency: string;
  drawName: string;
  description: string;
  participants: Participant[];
  pairs: Pair[];
  status: 'WAITING_FOR_DRAW' | 'DRAWED';
  drawDate?: Date | null;
};
