---
order: 3
shortTitle: 'React: Vanilla'
title: 'React Integration (Vanilla)'
description: 'Use React state and fetch to send submissions.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# React Integration (Vanilla)

These examples use React state and the Fetch API. They work in any React setup.

## Example 1: Basic form with useState

```tsx
import { useState } from 'react';

type FormState = {
  name: string;
  email: string;
  message: string;
};

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      setStatus('Thanks! We received your message.');
      setFormState({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        required
        value={formState.name}
        onChange={handleChange}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={formState.email}
        onChange={handleChange}
      />

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        required
        value={formState.message}
        onChange={handleChange}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
      <p role="status" aria-live="polite">{status}</p>
    </form>
  );
}
```

## Example 2: File upload with FormData

```tsx
import { useState } from 'react';

export function ContactFormWithFile() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (file) {
      formData.set('file', file);
    }

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      setStatus('Uploaded!');
      form.reset();
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus('Upload failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label htmlFor="file">Attachment</label>
      <input
        id="file"
        name="file"
        type="file"
        onChange={(event) => {
          const selected = event.target.files?.[0] ?? null;
          setFile(selected);
        }}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Send'}
      </button>
      <p role="status" aria-live="polite">{status}</p>
    </form>
  );
}
```

## Next steps

- [React Hook Form](/form-integration/react-hook-form)
- [Formik](/form-integration/react-formik)
- [File uploads](/file-uploads/basic-file-upload)
