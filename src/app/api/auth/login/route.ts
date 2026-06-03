import { NextResponse } from 'next/server';
import { getUser } from '@/lib/documents';
import { setSession } from '@/lib/session';

/** Logs a user in from the login form (no password — simulated auth). */
export async function POST(request: Request): Promise<NextResponse> {
  const form = await request.formData();
  const userId = String(form.get('userId') ?? '');
  const user = userId ? await getUser(userId) : null;

  if (!user) {
    return NextResponse.redirect(new URL('/login?error=invalid', request.url), 303);
  }

  await setSession(user.id);
  return NextResponse.redirect(new URL('/documents', request.url), 303);
}
