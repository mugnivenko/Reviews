import type { Uuid } from './uuid.model';

export type User = {
  id: Uuid;
  userName: string;
  email: string;
};
