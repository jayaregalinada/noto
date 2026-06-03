import { redirect } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { DashboardErrorToast } from '@/components/dashboard-error-toast';
import { DocumentCard } from '@/components/document-card';
import { ImportDocumentButton } from '@/components/import-document-button';
import { NewDocumentButton } from '@/components/new-document-button';
import { getCurrentUser } from '@/lib/auth';
import { getDashboardDocs } from '@/lib/documents';

interface DocumentsPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [{ owned, shared }, params] = await Promise.all([
    getDashboardDocs(user.id),
    searchParams,
  ]);

  return (
    <>
      <AppHeader user={user} />
      {params.error && <DashboardErrorToast message={params.error} />}

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your documents</h1>
            <p className="text-sm text-muted-foreground">
              Create, edit, and share rich-text documents.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ImportDocumentButton />
            <NewDocumentButton />
          </div>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Owned by you</h2>
          {owned.length === 0 ? (
            <EmptyState message="You haven't created any documents yet. Start with “New document” or import a file." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {owned.map(({ document }) => (
                <DocumentCard key={document.id} document={document} accessRole="owner" />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Shared with you
          </h2>
          {shared.length === 0 ? (
            <EmptyState message="Nothing shared with you yet. When someone grants you access, it shows up here." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shared.map(({ document, owner, role }) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  accessRole={role}
                  owner={owner}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
