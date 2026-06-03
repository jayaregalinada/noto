import { getSupabaseAdmin } from '@/lib/supabase';
import type { ShareRow } from '@/lib/types';

export async function getShares(documentId: string): Promise<ShareRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('document_shares')
    .select('document_id, user_id, role')
    .eq('document_id', documentId);
  if (error) throw error;
  return data ?? [];
}
