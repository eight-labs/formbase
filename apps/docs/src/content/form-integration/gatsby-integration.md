---
order: 11
shortTitle: 'Gatsby'
title: 'Gatsby Integration'
description: 'Submit to Formbase from Gatsby sites.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Gatsby Integration

Gatsby uses React, so you can reuse the same patterns as any React app.

## Example 1: Basic fetch submission

```tsx
import { useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      setStatus('Submitted!');
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus('Submission failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
      <p role="status">{status}</p>
    </form>
  );
}
```

## Example 2: File upload

```tsx
import { useState } from 'react';

export function UploadForm() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    if (file) {
      formData.set('file', file);
    }

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      setStatus('Uploaded!');
      event.currentTarget.reset();
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus('Upload failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="file">Attachment</label>
      <input
        id="file"
        name="file"
        type="file"
        onChange={(event) => {
          setFile(event.target.files?.[0] ?? null);
        }}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Send'}
      </button>
      <p role="status">{status}</p>
    </form>
  );
}
```
