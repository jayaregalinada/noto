import { Badge } from '@/components/ui/badge';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

const roleStyles: Record<Role, string> = {
  owner: 'border-transparent bg-primary/10 text-primary',
  editor: 'border-transparent bg-accent/15 text-accent',
  viewer: 'border-transparent bg-muted text-muted-foreground',
};

export function RoleBadge({ accessRole }: { accessRole: Role }) {
  return (
    <Badge variant="outline" className={cn('capitalize', roleStyles[accessRole])}>
      {accessRole}
    </Badge>
  );
}
