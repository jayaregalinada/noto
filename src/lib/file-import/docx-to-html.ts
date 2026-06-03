import mammoth from 'mammoth';

/** .docx -> HTML via mammoth. */
export async function docxToHtml(buffer: Buffer): Promise<string> {
  const result = await mammoth.convertToHtml({ buffer });
  return result.value;
}
