import type { DocumentRow } from './document-row';
import type { Role } from './role';
import type { User } from './user';

/** A document paired with the requesting user's effective role and its owner. */
export interface DocumentWithRole {
  document: DocumentRow;
  role: Role;
  owner: User;
}
