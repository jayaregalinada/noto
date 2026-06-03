import { cookies } from 'next/headers';
import { sessionCookieName } from './session-cookie-name';

/** Logs the current user out by deleting the session cookie. */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(sessionCookieName);
}
