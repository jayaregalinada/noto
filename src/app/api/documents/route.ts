import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createDocument } from '@/lib/documents';

/** Creates a blank document and opens it in the editor. */
export async function POST(request: Request): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url), 303);
  }

  const document = await createDocument({ ownerId: user.id });
  return NextResponse.redirect(new URL(`/documents/${document.id}`, request.url), 303);
}
