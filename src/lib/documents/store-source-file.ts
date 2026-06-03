import { getSupabaseAdmin, uploadsBucket } from '@/lib/supabase';

/**
 * Stores the raw uploaded file alongside the document it produced. Storage is a
 * nice-to-have, so a missing bucket is logged rather than failing the import.
 */
export async function storeSourceFile(
  documentId: string,
  filename: string,
  data: Buffer,
  contentType: string,
): Promise<void> {
  const path = `${documentId}/${filename}`;
  const { error } = await getSupabaseAdmin()
    .storage.from(uploadsBucket)
    .upload(path, data, { contentType, upsert: true });
  if (error) {
    console.warn(`[uploads] could not store ${path}: ${error.message}`);
  }
}
