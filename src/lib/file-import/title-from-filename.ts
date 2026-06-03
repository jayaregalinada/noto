/** Derives a human document title from a filename ('meeting_notes.md' -> 'meeting notes'). */
export function titleFromFilename(filename: string): string {
  const base = filename
    .replace(/\.[^./\\]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim();
  return base || 'Untitled';
}
