import type { ShareRole } from '@/lib/types';

export interface AccessInput {
  ownerId: string;
  shares: { userId: string; role: ShareRole }[];
  userId: string | null;
}
