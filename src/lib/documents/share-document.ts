import { getSupabaseAdmin } from '@/lib/supabase';
import type { ShareRole } from '@/lib/types';

/** Grants (or updates) a user's access to a document. Idempotent via upsert. */
export async function shareDocument(
  documentId: string,
  userId: string,
  role: ShareRole,
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from('document_shares')
    .upsert(
      { document_id: documentId, user_id: userId, role },
      { onConflict: 'document_id,user_id' },
    );
  if (error) throw error;
}
