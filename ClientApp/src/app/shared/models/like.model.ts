import { Uuid } from './uuid.model';

export type Like = {
  id: Uuid;
  userId: Uuid;
  reviewId: Uuid;
};
