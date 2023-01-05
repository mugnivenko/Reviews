import type { Uuid } from 'src/app/shared/models/uuid.model';
import type { Review } from 'src/app/shared/models/review.model';

export type ReviewDialogData = Partial<Review> & {
  creatorId: Uuid;
};
