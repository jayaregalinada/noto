import { getSupabaseAdmin } from '@/lib/supabase';
import type { DocumentRow, ShareRole, User } from '@/lib/types';
import type { DashboardDocs } from './dashboard-docs';

const ownerSelect = '*, owner:users!documents_owner_id_fkey(id, name, email)';

/** Loads documents the user owns plus documents shared with them. */
export async function getDashboardDocs(userId: string): Promise<DashboardDocs> {
  const supabase = getSupabaseAdmin();

  const [ownedRes, sharedRes] = await Promise.all([
    supabase
      .from('documents')
      .select(ownerSelect)
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false }),
    supabase
      .from('document_shares')
      .select(`role, document:documents(${ownerSelect})`)
      .eq('user_id', userId),
  ]);

  if (ownedRes.error) throw ownedRes.error;
  if (sharedRes.error) throw sharedRes.error;

  const owned = (ownedRes.data ?? []).map((row) => {
    const { owner, ...document } = row as DocumentRow & { owner: User };
    return { document: document as DocumentRow, owner };
  });

  const shared = (sharedRes.data ?? [])
    .map((row) => {
      const entry = row as unknown as {
        role: ShareRole;
        document: (DocumentRow & { owner: User }) | null;
      };
      if (!entry.document) return null;
      const { owner, ...document } = entry.document;
      return { document: document as DocumentRow, owner, role: entry.role };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.document.updated_at.localeCompare(a.document.updated_at));

  return { owned, shared };
}
