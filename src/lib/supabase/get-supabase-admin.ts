import { type SupabaseClient, createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client authenticated with the new-style secret key
 * (`sb_secret_...`), not the legacy service_role key.
 *
 * Because our auth is simulated (signed cookie, no Supabase JWT), access control
 * is enforced in application code via `@/lib/access` rather than Postgres RLS — a
 * deliberate scope tradeoff documented in the README. This module must only be
 * imported from server code so the secret key never reaches the browser.
 */

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local (see README).',
    );
  }

  cached = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
