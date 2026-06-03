import { NextResponse } from 'next/server';
import { z } from 'zod';
import { canManage } from '@/lib/access';
import { getCurrentUser } from '@/lib/auth';
import {
  getDocumentForUser,
  getUserByEmail,
  shareDocument,
  unshareDocument,
} from '@/lib/documents';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const shareSchema = z.object({
  email: z.email(),
  role: z.enum(['viewer', 'editor']),
});

const unshareSchema = z.object({
  userId: z.uuid(),
});

/** Grant another user access to a document by email. Requires ownership. */
export async function POST(
  request: Request,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const doc = await getDocumentForUser(id, user.id);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!canManage(doc.role)) {
    return NextResponse.json({ error: 'Only the owner can share.' }, { status: 403 });
  }

  const parsed = shareSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email and role.' }, { status: 400 });
  }

  const target = await getUserByEmail(parsed.data.email);
  if (!target) {
    return NextResponse.json(
      { error: 'No user with that email. Try one of the seeded accounts.' },
      { status: 404 },
    );
  }
  if (target.id === doc.document.owner_id) {
    return NextResponse.json(
      { error: 'That user is the owner and already has access.' },
      { status: 400 },
    );
  }

  await shareDocument(id, target.id, parsed.data.role);
  return NextResponse.json({ ok: true });
}

/** Revoke a user's access. Requires ownership. */
export async function DELETE(
  request: Request,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const doc = await getDocumentForUser(id, user.id);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!canManage(doc.role)) {
    return NextResponse.json({ error: 'Only the owner can unshare.' }, { status: 403 });
  }

  const parsed = unshareSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await unshareDocument(id, parsed.data.userId);
  return NextResponse.json({ ok: true });
}
