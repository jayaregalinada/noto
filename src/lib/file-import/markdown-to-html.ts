import { marked } from 'marked';

/** Markdown -> HTML via marked (synchronous mode). */
export function markdownToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
