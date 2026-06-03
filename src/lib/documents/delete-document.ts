import { getSupabaseAdmin } from '@/lib/supabase';

/** Deletes a document. Shares cascade via the foreign key. */
export async function deleteDocument(documentId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from('documents')
    .delete()
    .eq('id', documentId);
  if (error) throw error;
}
