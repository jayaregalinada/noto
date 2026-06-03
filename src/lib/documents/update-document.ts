import { getSupabaseAdmin } from '@/lib/supabase';
import type { DocumentRow } from '@/lib/types';

export interface UpdateDocumentFields {
  title?: string;
  html?: string;
}

/** Updates a document's title and/or content and bumps updated_at. */
export async function updateDocument(
  documentId: string,
  fields: UpdateDocumentFields,
): Promise<DocumentRow> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (fields.title !== undefined) {
    patch.title = fields.title.trim() || 'Untitled document';
  }
  if (fields.html !== undefined) {
    patch.content_html = fields.html;
  }

  const { data, error } = await getSupabaseAdmin()
    .from('documents')
    .update(patch)
    .eq('id', documentId)
    .select('*')
    .single();
  if (error) throw error;
  return data as DocumentRow;
}
