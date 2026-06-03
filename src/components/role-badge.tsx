import { Badge } from '@/components/ui/badge';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

const roleStyles: Record<Role, string> = {
  owner: 'border-transparent bg-primary/10 text-primary',
  editor: 'border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400',
  viewer: 'border-transparent bg-muted text-muted-foreground',
};

export function RoleBadge({ accessRole }: { accessRole: Role }) {
  return (
    <Badge variant="outline" className={cn('capitalize', roleStyles[accessRole])}>
      {accessRole}
    </Badge>
  );
}
