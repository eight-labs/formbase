---
order: 5
shortTitle: 'Error Handling'
title: 'File Upload Error Handling'
description: 'Handle oversized files, invalid types, and failed uploads gracefully.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# File Upload Error Handling

Good error handling keeps users informed and reduces support tickets. Handle errors in the same place as the upload logic.

## Example 1: Size + type validation before upload

```html
<input id="file" type="file" />
<p id="status" role="status" aria-live="polite"></p>

<script>
  const fileInput = document.getElementById('file');
  const status = document.getElementById('status');
  const maxBytes = 10 * 1024 * 1024; // Example: 10 MB
  const allowed = ['application/pdf', 'image/png', 'image/jpeg'];

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    if (!allowed.includes(file.type)) {
      status.textContent = 'Invalid file type.';
      fileInput.value = '';
      return;
    }

    if (file.size > maxBytes) {
      status.textContent = 'File is too large.';
      fileInput.value = '';
      return;
    }

    status.textContent = 'File is ready to upload.';
  });
</script>
```

## Example 2: Catch upload failures

```html
<form id="upload-form">
  <input id="file" name="file" type="file" required />
  <button type="submit">Upload</button>
  <p id="status" role="status" aria-live="polite"></p>
</form>

<script>
  const form = document.getElementById('upload-form');
  const status = document.getElementById('status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      status.textContent = 'Uploaded!';
    } catch (error) {
      console.error(error);
      status.textContent = 'Upload failed. Please retry.';
    }
  });
</script>
```

## Example 3: Retry logic for flaky networks

```js
async function uploadWithRetry(formData, attempts = 2) {
  try {
    const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
  } catch (error) {
    if (attempts > 0) {
      return uploadWithRetry(formData, attempts - 1);
    }
    throw error;
  }
}
```

## Common failure reasons

- File too large for your configured limits
- Unsupported MIME type
- Network timeout or lost connection
