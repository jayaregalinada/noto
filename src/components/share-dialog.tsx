'use client';

import { IconShare3, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, type ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { initialsOf } from '@/lib/text';
import type { Collaborator, ShareRole, User } from '@/lib/types';

interface ShareDialogProps {
  documentId: string;
  owner: User;
  collaborators: Collaborator[];
}

export function ShareDialog({ documentId, owner, collaborators }: ShareDialogProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ShareRole>('viewer');
  const [busy, setBusy] = useState(false);

  async function handleShare(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? 'Could not share document.');
      toast.success(`Shared with ${email}.`);
      setEmail('');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not share.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(userId: string, name: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Could not remove access.');
      }
      toast.success(`Removed ${name}.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not remove.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconShare3 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
          <DialogDescription>
            Grant access by email. Seeded accounts are ada@, alan@, grace@, and katherine@
            (all <span className="font-mono">@ajaia.test</span>).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleShare} className="flex items-center gap-2">
          <Input
            type="email"
            required
            placeholder="name@ajaia.test"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Select value={role} onValueChange={(value) => setRole(value as ShareRole)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={busy} aria-label="Add person">
            <IconUserPlus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-1">
          <PersonRow
            user={owner}
            trailing={<span className="text-xs text-muted-foreground">Owner</span>}
          />
          {collaborators.map((collaborator) => (
            <PersonRow
              key={collaborator.user.id}
              user={collaborator.user}
              trailing={
                <div className="flex items-center gap-1">
                  <span className="text-xs capitalize text-muted-foreground">
                    {collaborator.role}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    disabled={busy}
                    aria-label={`Remove ${collaborator.user.name}`}
                    onClick={() =>
                      handleRemove(collaborator.user.id, collaborator.user.name)
                    }
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              }
            />
          ))}
          {collaborators.length === 0 && (
            <p className="px-1 py-2 text-sm text-muted-foreground">
              Not shared with anyone yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PersonRow({ user, trailing }: { user: User; trailing: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md px-1 py-1.5">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initialsOf(user.name)}</AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      {trailing}
    </div>
  );
}
