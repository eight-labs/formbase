---
order: 10
shortTitle: 'Remix'
title: 'Remix Integration'
description: 'Post to Formbase using Remix actions or fetchers.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Remix Integration

Remix makes server-side form handling first-class. Use an action to send data to Formbase.

## Example 1: Action-based submission

```tsx
import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  try {
    const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Submission failed: ${response.status}`);
    }

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ ok: false, message: 'Submission failed. Please retry.' });
  }
}

export default function ContactRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <button type="submit">Send</button>
      {actionData?.message && <p role="status">{actionData.message}</p>}
    </Form>
  );
}
```

## Example 2: useFetcher for SPA-style UX

```tsx
import { useFetcher } from '@remix-run/react';

export default function ContactFetcher() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/contact">
      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" required />

      <button type="submit" disabled={fetcher.state !== 'idle'}>
        {fetcher.state !== 'idle' ? 'Sending...' : 'Send'}
      </button>
      {fetcher.data?.message && <p role="status">{fetcher.data.message}</p>}
    </fetcher.Form>
  );
}
```

## Notes

- Actions keep your Formbase endpoint on the server.
- Use `useFetcher` for SPA-friendly behavior without full page reloads.
