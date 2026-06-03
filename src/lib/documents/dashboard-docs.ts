import type { DocumentRow, ShareRole, User } from '@/lib/types';

/** The two buckets shown on the dashboard: documents you own vs shared with you. */
export interface DashboardDocs {
  owned: { document: DocumentRow; owner: User }[];
  shared: { document: DocumentRow; owner: User; role: ShareRole }[];
}
