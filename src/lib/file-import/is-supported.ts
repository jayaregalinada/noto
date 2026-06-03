import { extensionOf } from './extension-of';
import { supportedExtensions } from './supported-extensions';

export function isSupported(filename: string): boolean {
  return (supportedExtensions as readonly string[]).includes(extensionOf(filename));
}
