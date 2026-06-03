import type { ShareRole } from './share-role';

export interface ShareRow {
  document_id: string;
  user_id: string;
  role: ShareRole;
}
