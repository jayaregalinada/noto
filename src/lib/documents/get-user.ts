import { getSupabaseAdmin } from '@/lib/supabase';
import type { User } from '@/lib/types';

export async function getUser(id: string): Promise<User | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('users')
    .select('id, name, email')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
