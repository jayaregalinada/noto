import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createDocument, storeSourceFile } from '@/lib/documents';
import {
  convertFileToDocument,
  isSupported,
  maxFileBytes,
  supportedExtensions,
} from '@/lib/file-import';

function redirectToDashboard(request: Request, error?: string): NextResponse {
  const url = new URL('/documents', request.url);
  if (error) url.searchParams.set('error', error);
  return NextResponse.redirect(url, 303);
}

/** Import a .txt / .md / .docx file as a new editable document. */
export async function POST(request: Request): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url), 303);
  }

  const form = await request.formData();
  const file = form.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return redirectToDashboard(request, 'Please choose a file to import.');
  }
  if (!isSupported(file.name)) {
    return redirectToDashboard(
      request,
      `Unsupported file type. Allowed: ${supportedExtensions.join(', ')}`,
    );
  }
  if (file.size > maxFileBytes) {
    return redirectToDashboard(request, 'File is too large (max 5 MB).');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { title, html } = await convertFileToDocument(file.name, buffer);
    const document = await createDocument({
      ownerId: user.id,
      title,
      html,
      sourceFilename: file.name,
    });
    await storeSourceFile(
      document.id,
      file.name,
      buffer,
      file.type || 'application/octet-stream',
    );
    return NextResponse.redirect(new URL(`/documents/${document.id}`, request.url), 303);
  } catch {
    return redirectToDashboard(request, 'Could not read that file. Please try another.');
  }
}
