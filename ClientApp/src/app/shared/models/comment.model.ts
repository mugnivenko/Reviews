import type { User } from './user.model';
import type { Uuid } from './uuid.model';
import type { TimeStamp } from './timestamp.model';

export type Commentary = {
  id: Uuid;
  content: string;
  reviewId: Uuid;
  creator: Pick<User, 'id' | 'userName'>;
  createdAt: TimeStamp;
};
