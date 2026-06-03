function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Plain text -> HTML: blank lines split paragraphs, single newlines become <br>. */
export function textToHtml(text: string): string {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const paragraphs = normalized.split(/\n{2,}/);
  return paragraphs
    .map((paragraph) => {
      const inner = escapeHtml(paragraph.trim()).replace(/\n/g, '<br>');
      return `<p>${inner || '<br>'}</p>`;
    })
    .join('');
}
