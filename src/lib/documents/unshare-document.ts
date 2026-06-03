import { getSupabaseAdmin } from '@/lib/supabase';

/** Revokes a user's access to a document. */
export async function unshareDocument(documentId: string, userId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from('document_shares')
    .delete()
    .eq('document_id', documentId)
    .eq('user_id', userId);
  if (error) throw error;
}
