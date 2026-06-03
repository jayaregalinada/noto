import crypto from 'node:crypto';
import { signSessionValue } from './sign-session-value';

/** Verifies the HMAC signature and returns the original value, or null if invalid. */
export function unsignSessionValue(signed: string): string | null {
  const index = signed.lastIndexOf('.');
  if (index <= 0) return null;

  const value = signed.slice(0, index);
  const expected = signSessionValue(value);
  const actualBytes = Buffer.from(signed);
  const expectedBytes = Buffer.from(expected);

  if (actualBytes.length !== expectedBytes.length) return null;
  if (!crypto.timingSafeEqual(actualBytes, expectedBytes)) return null;
  return value;
}
