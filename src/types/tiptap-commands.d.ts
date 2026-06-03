/**
 * Tiptap command type augmentations.
 *
 * @tiptap/starter-kit@3.24 bundles its extensions at runtime but does not ship
 * the per-extension `declare module '@tiptap/core'` command augmentations, so
 * chainable commands like `toggleBold` are untyped. We re-declare exactly the
 * commands used by the editor toolbar, mirroring the upstream extension types.
 */
import '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bold: {
      toggleBold: () => ReturnType;
    };
    italic: {
      toggleItalic: () => ReturnType;
    };
    underline: {
      toggleUnderline: () => ReturnType;
    };
    paragraph: {
      setParagraph: () => ReturnType;
    };
    heading: {
      toggleHeading: (attributes: { level: 1 | 2 | 3 | 4 | 5 | 6 }) => ReturnType;
    };
    bulletList: {
      toggleBulletList: () => ReturnType;
    };
    orderedList: {
      toggleOrderedList: () => ReturnType;
    };
  }
}
