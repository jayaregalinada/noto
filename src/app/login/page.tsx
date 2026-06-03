import { redirect } from 'next/navigation';
import { NotoLogo } from '@/components/noto-logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
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
          <NotoLogo className="mx-auto mb-1 h-9 w-auto" />
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
