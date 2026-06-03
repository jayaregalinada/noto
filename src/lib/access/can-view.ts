import type { Role } from '@/lib/types';

export function canView(role: Role | null): boolean {
  return role !== null;
}
