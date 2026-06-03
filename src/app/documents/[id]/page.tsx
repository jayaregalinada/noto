import { notFound, redirect } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { DocumentEditor } from '@/components/document-editor';
import { getCurrentUser } from '@/lib/auth';
import { getCollaborators, getDocumentForUser } from '@/lib/documents';

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { id } = await params;
  const doc = await getDocumentForUser(id, user.id);
  if (!doc) notFound();

  // Collaborator list is only needed (and only visible) for the owner.
  const collaborators = doc.role === 'owner' ? await getCollaborators(id) : [];

  return (
    <>
      <AppHeader user={user} />
      <DocumentEditor
        document={doc.document}
        role={doc.role}
        owner={doc.owner}
        collaborators={collaborators}
      />
    </>
  );
}
