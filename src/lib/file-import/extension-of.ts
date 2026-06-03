/** Returns the lowercased file extension including the dot, or '' if none. */
export function extensionOf(filename: string): string {
  const index = filename.lastIndexOf('.');
  return index === -1 ? '' : filename.slice(index).toLowerCase();
}
