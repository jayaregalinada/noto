'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

/** Surfaces an import/validation error (passed via ?error=) as a toast, then
 *  cleans it out of the URL so a refresh doesn't repeat it. */
export function DashboardErrorToast({ message }: { message: string }) {
  const router = useRouter();

  useEffect(() => {
    toast.error(message);
    router.replace('/documents');
  }, [message, router]);

  return null;
}
