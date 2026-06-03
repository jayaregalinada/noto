import { IconFileText } from '@tabler/icons-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { initialsOf } from '@/lib/text';
import type { User } from '@/lib/types';

/** Top navigation bar showing the current user and a logout action. */
export function AppHeader({ user }: { user: User }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/documents"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <IconFileText className="h-5 w-5 text-primary" />
          Ajaia Docs
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">{initialsOf(user.name)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.name}
            </span>
          </div>
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
