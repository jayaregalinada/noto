import type { ShareRole } from './share-role';
import type { User } from './user';

export interface Collaborator {
  user: User;
  role: ShareRole;
}
