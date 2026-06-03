import type { Role } from '@/lib/types';

export function canEdit(role: Role | null): boolean {
  return role === 'owner' || role === 'editor';
}
