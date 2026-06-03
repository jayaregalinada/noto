import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export function NewDocumentButton() {
  return (
    <form action="/api/documents" method="post">
      <Button type="submit">
        <IconPlus className="h-4 w-4" />
        New document
      </Button>
    </form>
  );
}
