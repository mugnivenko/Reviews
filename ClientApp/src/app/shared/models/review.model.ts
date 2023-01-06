import type { TimeStamp } from './timestamp.model';
import type { Uuid } from './uuid.model';
import type { Group } from './group.model';
import type { Piece } from './piece.model';
import type { Tag } from './tag.model';
import type { Image } from './image.model';

export type Review = {
  commentaries: null;
  content: string;
  createdAt: TimeStamp;
  creator: { id: Uuid; userName: string };
  creatorId: Uuid;
  grade: number;
  group: Group;
  groupId: Uuid;
  id: Uuid;
  images: Image[];
  like: Nullable<{ id: Uuid }>;
  name: string;
  piece: Piece;
  pieceId: Uuid;
  raitings: null;
  tags: Tag[];
};

export type SavingReview = {
  name: string;
  piece: string;
  grade: number;
  tags: string[];
  content: string;
  creatorId: Uuid;
  groupId: Uuid;
  files: string[];
};
