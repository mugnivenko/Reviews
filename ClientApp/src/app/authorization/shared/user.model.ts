import type { Uuid } from 'src/app/shared/models/uuid.model';

export type User = {
  token: string;
  userName: string;
  email: string;
  id: Uuid;
};
