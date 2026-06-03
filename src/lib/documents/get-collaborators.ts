import { getSupabaseAdmin } from '@/lib/supabase';
import type { Collaborator, ShareRole, User } from '@/lib/types';

/** Users a document is shared with (excludes the owner), for the share dialog. */
export async function getCollaborators(documentId: string): Promise<Collaborator[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('document_shares')
    .select('role, user:users(id, name, email)')
    .eq('document_id', documentId);
  if (error) throw error;

  return (data ?? [])
    .map((row) => {
      const entry = row as unknown as { role: ShareRole; user: User | null };
      return entry.user ? { user: entry.user, role: entry.role } : null;
    })
    .filter((entry): entry is Collaborator => entry !== null)
    .sort((a, b) => a.user.name.localeCompare(b.user.name));
}
