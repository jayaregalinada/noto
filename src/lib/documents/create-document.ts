import { getSupabaseAdmin } from '@/lib/supabase';
import type { DocumentRow } from '@/lib/types';

const emptyDocumentHtml = '<p></p>';

export interface CreateDocumentInput {
  ownerId: string;
  title?: string;
  html?: string;
  sourceFilename?: string | null;
}

export async function createDocument(input: CreateDocumentInput): Promise<DocumentRow> {
  const { data, error } = await getSupabaseAdmin()
    .from('documents')
    .insert({
      owner_id: input.ownerId,
      title: input.title?.trim() || 'Untitled document',
      content_html: input.html ?? emptyDocumentHtml,
      source_filename: input.sourceFilename ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as DocumentRow;
}
