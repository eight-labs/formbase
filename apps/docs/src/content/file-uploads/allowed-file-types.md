---
order: 2
shortTitle: 'Allowed File Types'
title: 'Allowed File Types'
description: 'Restrict uploads by MIME type or extension.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Allowed File Types

Restricting file types keeps uploads safer and more predictable. Use both client-side checks and server-side validation.

## Example 1: Use the accept attribute

```html
<form
  action="https://formbase.dev/s/YOUR_FORM_ID"
  method="POST"
  enctype="multipart/form-data"
>
  <label for="resume">Resume (PDF only)</label>
  <input id="resume" name="file" type="file" accept="application/pdf" />
  <button type="submit">Upload</button>
</form>
```

## Example 2: Client-side validation

```html
<input id="upload" type="file" />
<p id="status" role="status" aria-live="polite"></p>

<script>
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  const upload = document.getElementById('upload');
  const status = document.getElementById('status');

  upload.addEventListener('change', () => {
    const file = upload.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      status.textContent = 'Unsupported file type.';
      upload.value = '';
      return;
    }

    status.textContent = 'File looks good.';
  });
</script>
```

## Example 3: Server-side validation (recommended)

Even with client-side checks, always verify file types on the server.

```ts
// Example server-side pseudo-code
const allowed = new Set(['application/pdf', 'image/png', 'image/jpeg']);

if (!allowed.has(file.mimeType)) {
  throw new Error('Unsupported file type');
}
```

## Tips

- `accept` is a hint to the browser, not a security boundary.
- Validate MIME types and file signatures server-side for critical workflows.
