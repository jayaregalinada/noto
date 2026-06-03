import { IconFileText } from '@tabler/icons-react';
import Link from 'next/link';
import { RoleBadge } from '@/components/role-badge';
import { Card } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/text';
import type { DocumentRow, Role, User } from '@/lib/types';

interface DocumentCardProps {
  document: DocumentRow;
  accessRole: Role;
  /** Shown for documents shared with the current user. */
  owner?: User;
}

export function DocumentCard({ document, accessRole, owner }: DocumentCardProps) {
  return (
    <Link href={`/documents/${document.id}`} className="group block">
      <Card className="h-full gap-0 p-4 transition-colors group-hover:border-primary/40 group-hover:bg-accent/40">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <IconFileText className="h-5 w-5 text-primary" />
          </span>
          <RoleBadge accessRole={accessRole} />
        </div>
        <h3 className="line-clamp-2 font-medium leading-snug">{document.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {owner ? `${owner.name} · ` : ''}
          Edited {formatRelativeTime(document.updated_at)}
        </p>
      </Card>
    </Link>
  );
}
