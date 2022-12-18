import { Uuid } from 'src/app/shared/uuid.model';

export type User = {
  token: string;
  userName: string;
  email: string;
  id: Uuid;
};
