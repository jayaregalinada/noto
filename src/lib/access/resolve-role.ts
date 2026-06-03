import type { Role } from '@/lib/types';
import type { AccessInput } from './access-input';

/**
 * The single source of truth for "who can do what". Pure (no DB, no request
 * context) so the permission matrix is trivial to unit test and every route can
 * resolve a role through here before acting.
 *
 * Returns the user's effective role, or null when they have no access at all.
 */
export function resolveRole(input: AccessInput): Role | null {
  const { ownerId, shares, userId } = input;
  if (!userId) return null;
  if (userId === ownerId) return 'owner';
  const share = shares.find((entry) => entry.userId === userId);
  return share ? share.role : null;
}
