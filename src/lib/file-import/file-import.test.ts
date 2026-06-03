import { describe, expect, it } from 'vitest';
import { convertFileToDocument } from './convert-file-to-document';
import { extensionOf } from './extension-of';
import { isSupported } from './is-supported';
import { markdownToHtml } from './markdown-to-html';
import { textToHtml } from './text-to-html';
import { titleFromFilename } from './title-from-filename';

describe('extensionOf', () => {
  it('returns the lowercased extension with the dot', () => {
    expect(extensionOf('Report.DOCX')).toBe('.docx');
    expect(extensionOf('notes.md')).toBe('.md');
  });

  it('returns empty string when there is no extension', () => {
    expect(extensionOf('README')).toBe('');
  });
});

describe('isSupported', () => {
  it('accepts txt, md, markdown, docx', () => {
    expect(isSupported('a.txt')).toBe(true);
    expect(isSupported('a.md')).toBe(true);
    expect(isSupported('a.markdown')).toBe(true);
    expect(isSupported('a.docx')).toBe(true);
  });

  it('rejects unsupported types', () => {
    expect(isSupported('a.pdf')).toBe(false);
    expect(isSupported('a.png')).toBe(false);
    expect(isSupported('a.doc')).toBe(false);
  });
});

describe('titleFromFilename', () => {
  it('strips the extension and humanizes separators', () => {
    expect(titleFromFilename('meeting_notes.md')).toBe('meeting notes');
    expect(titleFromFilename('q3-report.docx')).toBe('q3 report');
  });

  it('falls back to Untitled for empty names', () => {
    expect(titleFromFilename('.md')).toBe('Untitled');
  });
});

describe('textToHtml', () => {
  it('splits blank-line-separated paragraphs', () => {
    expect(textToHtml('one\n\ntwo')).toBe('<p>one</p><p>two</p>');
  });

  it('converts single newlines to <br>', () => {
    expect(textToHtml('a\nb')).toBe('<p>a<br>b</p>');
  });

  it('escapes HTML to prevent injection', () => {
    expect(textToHtml('<script>alert(1)</script>')).toBe(
      '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>',
    );
  });
});

describe('markdownToHtml', () => {
  it('renders headings, emphasis, and lists', () => {
    const html = markdownToHtml('# Title\n\n- **bold** item');
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<li>');
  });
});

describe('convertFileToDocument', () => {
  it('derives a title and converts markdown content', async () => {
    const result = await convertFileToDocument(
      'roadmap.md',
      Buffer.from('# Roadmap\n\ntext'),
    );
    expect(result.title).toBe('roadmap');
    expect(result.html).toContain('<h1>Roadmap</h1>');
  });

  it('throws on unsupported file types', async () => {
    await expect(
      convertFileToDocument('image.png', Buffer.from('x')),
    ).rejects.toThrow(/Unsupported file type/);
  });
});
