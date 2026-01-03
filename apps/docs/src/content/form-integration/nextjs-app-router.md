---
order: 9
shortTitle: 'Next.js (App Router)'
title: 'Next.js Integration (App Router)'
description: 'Submit to Formbase from Next.js App Router pages.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Next.js Integration (App Router)

These examples use the Next.js App Router. Pick a client component or a server action depending on your needs.

## Example 1: Client component with fetch

```tsx
'use client';

import { useState } from 'react';

export default function ContactPage() {
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

## Example 2: Server action as a proxy

This keeps your endpoint URL out of the client bundle and lets you add server-side validation.

```ts
// app/contact/actions.ts
'use server';

type ActionState = { ok: boolean; message: string };

export async function submitToFormbase(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Submission failed: ${response.status}`);
    }

    return { ok: true, message: 'Submitted!' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'Submission failed. Please retry.' };
  }
}
```

```tsx
// app/contact/page.tsx
'use client';

import { useFormState } from 'react-dom';
import { submitToFormbase } from './actions';

const initialState = { ok: false, message: '' };

export default function ContactPage() {
  const [state, formAction] = useFormState(submitToFormbase, initialState);

  return (
    <form action={formAction}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <button type="submit">Send</button>
      <p role="status">{state.message}</p>
    </form>
  );
}
```

## Notes

- Use server actions when you need to hide the endpoint or add server-side logic.
- File uploads work with `FormData` in both examples.
