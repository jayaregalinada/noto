'use client';

import { IconUpload } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Imports a .txt / .md / .docx file as a new document. A hidden file input is
 * triggered by the button; selecting a file submits the multipart form to the
 * import API, which converts it and redirects to the new document.
 */
export function ImportDocumentButton() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form ref={formRef} action="/api/import" method="post" encType="multipart/form-data">
      <input
        ref={inputRef}
        type="file"
        name="file"
        accept=".txt,.md,.markdown,.docx"
        className="hidden"
        onChange={() => {
          if (inputRef.current?.files?.length) {
            setSubmitting(true);
            formRef.current?.submit();
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        disabled={submitting}
        onClick={() => inputRef.current?.click()}
      >
        <IconUpload className="h-4 w-4" />
        {submitting ? 'Importing…' : 'Import file'}
      </Button>
    </form>
  );
}
