/** Secret used to sign the session cookie. Set SESSION_SECRET in production. */
export function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'dev-insecure-secret-change-me';
}
