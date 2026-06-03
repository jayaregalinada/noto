import { NextResponse } from 'next/server';
import { z } from 'zod';
import { canEdit, canManage } from '@/lib/access';
import { getCurrentUser } from '@/lib/auth';
import { deleteDocument, getDocumentForUser, updateDocument } from '@/lib/documents';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const patchSchema = z
  .object({
    title: z.string().max(300).optional(),
    html: z.string().max(1_000_000).optional(),
  })
  .refine((data) => data.title !== undefined || data.html !== undefined, {
    message: 'Provide a title and/or html to update.',
  });

/** Update a document's title and/or content. Requires editor access. */
export async function PATCH(
  request: Request,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const doc = await getDocumentForUser(id, user.id);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!canEdit(doc.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const document = await updateDocument(id, parsed.data);
  return NextResponse.json({ document });
}

/** Delete a document. Requires ownership. */
export async function DELETE(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const doc = await getDocumentForUser(id, user.id);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!canManage(doc.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await deleteDocument(id);
  return NextResponse.json({ ok: true });
}
