import { getUser } from '@/lib/documents';
import { getSessionUserId } from '@/lib/session';
import type { User } from '@/lib/types';

/** Resolves the logged-in user from the session cookie, or null if signed out. */
export async function getCurrentUser(): Promise<User | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return getUser(userId);
}
