import { resolveRole } from '@/lib/access';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { DocumentRow, DocumentWithRole, Role } from '@/lib/types';
import { getShares } from './get-shares';
import { getUser } from './get-user';

/**
 * Loads a document together with the requesting user's effective role. Returns
 * null when the document does not exist OR the user has no access — callers treat
 * both as "not found" so existence is never leaked.
 */
export async function getDocumentForUser(
  documentId: string,
  userId: string | null,
): Promise<DocumentWithRole | null> {
  const { data: document, error } = await getSupabaseAdmin()
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .maybeSingle();
  if (error) throw error;
  if (!document) return null;

  const shares = await getShares(documentId);
  const role = resolveRole({
    ownerId: document.owner_id,
    shares: shares.map((share) => ({ userId: share.user_id, role: share.role })),
    userId,
  });
  if (!role) return null;

  const owner = await getUser(document.owner_id);
  if (!owner) return null;

  return { document: document as DocumentRow, role: role as Role, owner };
}
