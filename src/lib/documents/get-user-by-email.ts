import { getSupabaseAdmin } from '@/lib/supabase';
import type { User } from '@/lib/types';

/** Case-insensitive email lookup, used when sharing a document. */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('users')
    .select('id, name, email')
    .ilike('email', email.trim())
    .maybeSingle();
  if (error) throw error;
  return data;
}
