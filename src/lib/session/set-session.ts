import { cookies } from 'next/headers';
import { sessionCookieName } from './session-cookie-name';
import { signSessionValue } from './sign-session-value';

const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 days

/** Logs a user in by writing a signed, httpOnly session cookie. */
export async function setSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(sessionCookieName, signSessionValue(userId), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: maxAgeSeconds,
  });
}
