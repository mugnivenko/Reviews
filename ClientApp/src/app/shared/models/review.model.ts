import type { TimeStamp } from './timestamp.model';
import type { Uuid } from './uuid.model';
import type { Group } from './group.model';
import type { Piece } from './piece.model';

export type Review = {
  commentaries: null;
  content: string;
  createdAt: TimeStamp;
  creator: null;
  creatorId: Uuid;
  grade: number;
  group: Group;
  groupId: Uuid;
  id: Uuid;
  images: null;
  likes: null;
  name: string;
  piece: Piece;
  pieceId: Uuid;
  raitings: null;
  tags: null;
};

export type NewReview = {
  name: string;
  piece: string;
  grade: number;
  tags: string[];
  content: string;
  creatorId: Uuid;
  groupId: Uuid;
  files: string[];
};
