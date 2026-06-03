export interface DocumentRow {
  id: string;
  title: string;
  content_html: string;
  owner_id: string;
  source_filename: string | null;
  created_at: string;
  updated_at: string;
}
