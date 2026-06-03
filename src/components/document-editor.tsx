'use client';

import {
  IconArrowLeft,
  IconCheck,
  IconCloud,
  IconCloudCheck,
  IconDots,
  IconExclamationCircle,
  IconLoader2,
  IconTrash,
} from '@tabler/icons-react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { EditorToolbar } from '@/components/editor-toolbar';
import { RoleBadge } from '@/components/role-badge';
import { ShareDialog } from '@/components/share-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { canEdit, canManage } from '@/lib/access';
import type { Collaborator, DocumentRow, Role, User } from '@/lib/types';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface DocumentEditorProps {
  document: DocumentRow;
  role: Role;
  owner: User;
  collaborators: Collaborator[];
}

export function DocumentEditor({
  document,
  role,
  owner,
  collaborators,
}: DocumentEditorProps) {
  const router = useRouter();
  const editable = canEdit(role);
  const isOwner = canManage(role);

  const [title, setTitle] = useState(document.title);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<{ title?: string; html?: string }>({});

  const flush = useCallback(async () => {
    const body = pending.current;
    pending.current = {};
    if (body.title === undefined && body.html === undefined) return;
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('save failed');
      setSaveState('saved');
    } catch {
      setSaveState('error');
      toast.error('Could not save your changes.');
    }
  }, [document.id]);

  const scheduleSave = useCallback(
    (patch: { title?: string; html?: string }) => {
      pending.current = { ...pending.current, ...patch };
      setSaveState('saving');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, 700);
    },
    [flush],
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: document.content_html,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap min-h-[55vh] max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor: instance }) => scheduleSave({ html: instance.getHTML() }),
  });

  function handleTitleChange(value: string) {
    setTitle(value);
    scheduleSave({ title: value });
  }

  async function handleDelete() {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('delete failed');
      toast.success('Document deleted.');
      router.push('/documents');
      router.refresh();
    } catch {
      toast.error('Could not delete the document.');
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* Document sub-header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-2.5">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <Link href="/documents" aria-label="Back to documents">
              <IconArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          {editable ? (
            <Input
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              onBlur={flush}
              aria-label="Document title"
              className="h-9 min-w-0 flex-1 border-transparent bg-transparent px-2 text-base font-medium shadow-none hover:border-input focus-visible:border-input"
            />
          ) : (
            <h1 className="flex-1 truncate px-2 text-base font-medium">{title}</h1>
          )}

          <SaveStatus state={saveState} editable={editable} />

          <div className="flex shrink-0 items-center gap-2">
            {!isOwner && <RoleBadge accessRole={role} />}
            {isOwner && (
              <>
                <ShareDialog
                  documentId={document.id}
                  owner={owner}
                  collaborators={collaborators}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                      <IconTrash className="h-4 w-4" />
                      Delete document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Toolbar (editors only) */}
        {editable && editor && (
          <div className="mx-auto w-full max-w-4xl px-3 pb-2">
            <EditorToolbar editor={editor} />
          </div>
        )}
      </div>

      {/* Read-only banner */}
      {!editable && (
        <div className="border-b border-border bg-muted/40">
          <p className="mx-auto w-full max-w-4xl px-4 py-2 text-xs text-muted-foreground">
            You have view-only access. Shared by {owner.name}.
          </p>
        </div>
      )}

      {/* Editing surface */}
      <div className="flex-1 bg-muted/30 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-8 shadow-sm sm:p-12">
          <EditorContent editor={editor} />
        </div>
      </div>
    </main>
  );
}

function SaveStatus({ state, editable }: { state: SaveState; editable: boolean }) {
  if (!editable) {
    return (
      <span className="hidden shrink-0 items-center gap-1 whitespace-nowrap text-xs text-muted-foreground sm:flex">
        <IconCheck className="h-3.5 w-3.5 shrink-0" />
        View only
      </span>
    );
  }

  const config = {
    idle: { icon: IconCloud, label: 'All changes saved', spin: false },
    saving: { icon: IconLoader2, label: 'Saving…', spin: true },
    saved: { icon: IconCloudCheck, label: 'Saved', spin: false },
    error: { icon: IconExclamationCircle, label: 'Save failed', spin: false },
  }[state];

  const Icon = config.icon;
  return (
    <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
      <Icon className={`h-3.5 w-3.5 shrink-0 ${config.spin ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  );
}
