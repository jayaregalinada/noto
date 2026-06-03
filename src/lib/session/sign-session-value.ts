import crypto from 'node:crypto';
import { getSessionSecret } from './get-session-secret';

/** Appends an HMAC-SHA256 signature so the cookie value cannot be forged. */
export function signSessionValue(value: string): string {
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(value)
    .digest('base64url');
  return `${value}.${signature}`;
}
