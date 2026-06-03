import { IconFileText } from '@tabler/icons-react';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { listUsers } from '@/lib/documents';
import { initialsOf } from '@/lib/text';

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const current = await getCurrentUser();
  if (current) redirect('/documents');

  const [users, params] = await Promise.all([listUsers(), searchParams]);

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <IconFileText className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Ajaia Docs</CardTitle>
          <CardDescription>
            Choose a demo account to continue. This is simulated auth — no password
            required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {params.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              That account could not be found. Please pick another.
            </p>
          )}
          {users.map((user) => (
            <form key={user.id} action="/api/auth/login" method="post">
              <input type="hidden" name="userId" value={user.id} />
              <Button
                type="submit"
                variant="outline"
                className="h-auto w-full justify-start gap-3 px-3 py-3"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
                </Avatar>
                <span className="flex flex-col items-start">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </span>
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
