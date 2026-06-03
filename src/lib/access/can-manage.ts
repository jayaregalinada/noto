import type { Role } from '@/lib/types';

/** Only the owner may share, unshare, or delete a document. */
export function canManage(role: Role | null): boolean {
  return role === 'owner';
}
