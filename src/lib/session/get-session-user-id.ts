import { cookies } from 'next/headers';
import { sessionCookieName } from './session-cookie-name';
import { unsignSessionValue } from './unsign-session-value';

/** Returns the logged-in user's id from the signed cookie, or null. */
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(sessionCookieName)?.value;
  if (!raw) return null;
  return unsignSessionValue(raw);
}
