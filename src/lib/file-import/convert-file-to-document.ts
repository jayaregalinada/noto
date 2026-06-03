import { docxToHtml } from './docx-to-html';
import { extensionOf } from './extension-of';
import type { ImportResult } from './import-result';
import { markdownToHtml } from './markdown-to-html';
import { textToHtml } from './text-to-html';
import { titleFromFilename } from './title-from-filename';

/**
 * Convert a supported file into a title + HTML body. Throws on unsupported
 * extensions — callers should validate with `isSupported` first.
 */
export async function convertFileToDocument(
  filename: string,
  data: Buffer,
): Promise<ImportResult> {
  const ext = extensionOf(filename);
  const title = titleFromFilename(filename);

  switch (ext) {
    case '.txt':
      return { title, html: textToHtml(data.toString('utf8')) };
    case '.md':
    case '.markdown':
      return { title, html: markdownToHtml(data.toString('utf8')) };
    case '.docx':
      return { title, html: await docxToHtml(data) };
    default:
      throw new Error(`Unsupported file type: ${ext || 'unknown'}`);
  }
}
