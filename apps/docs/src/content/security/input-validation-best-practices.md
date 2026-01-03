---
order: 4
shortTitle: 'Input Validation'
title: 'Input Validation Best Practices'
description: 'Combine client-side UX with server-side guarantees.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Input Validation Best Practices

Client-side validation improves UX, but server-side validation is what actually protects your system.

## Example 1: Client-side validation for UX

```html
<input name="email" type="email" required />
<input name="name" type="text" minlength="2" required />
```

## Example 2: Server-side validation for safety

```ts
// Pseudo-code example
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const result = schema.safeParse(submission);
if (!result.success) {
  throw new Error('Invalid submission');
}
```

## Example 3: Protect data in transit and at rest

- Use HTTPS to encrypt traffic in transit.
- Encrypt databases and storage buckets at rest where possible.
- Rotate credentials regularly.

## Why client-side validation is not enough

Anyone can bypass browser validation or submit directly to the endpoint. Always validate on the server side before processing or using data.
