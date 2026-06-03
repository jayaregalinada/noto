import { getSupabaseAdmin } from '@/lib/supabase';
import type { User } from '@/lib/types';

/** All seeded users, for the login picker and the share dialog. */
export async function listUsers(): Promise<User[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('users')
    .select('id, name, email')
    .order('name');
  if (error) throw error;
  return data ?? [];
}
