---
order: 0
shortTitle: 'Basic File Upload'
title: 'Basic File Upload'
description: 'Send a single file with your Formbase submission.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Basic File Upload

Formbase accepts `multipart/form-data` and stores uploaded files in S3-compatible storage. Files are stored as URLs in your submission data.

## Example 1: HTML file input

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase File Upload</title>
  </head>
  <body>
    <form
      action="https://formbase.dev/s/YOUR_FORM_ID"
      method="POST"
      enctype="multipart/form-data"
    >
      <label for="file">Attachment</label>
      <input id="file" name="file" type="file" required />

      <button type="submit">Upload</button>
    </form>
  </body>
</html>
```

## Example 2: AJAX upload with FormData

```html
<form id="upload-form" enctype="multipart/form-data">
  <label for="file">Attachment</label>
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
      form.reset();
    } catch (error) {
      console.error(error);
      status.textContent = 'Upload failed. Please retry.';
    }
  });
</script>
```

## Example 3: Drag-and-drop upload

```html
<div id="drop-zone" role="button" tabindex="0">
  Drag a file here or click to browse
</div>
<input id="file-input" type="file" hidden />
<p id="drop-status" role="status" aria-live="polite"></p>

<script>
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const status = document.getElementById('drop-status');

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      status.textContent = 'Uploaded!';
    } catch (error) {
      console.error(error);
      status.textContent = 'Upload failed. Please retry.';
    }
  };

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('is-dragging');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('is-dragging');
  });
  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('is-dragging');
    const file = event.dataTransfer.files[0];
    if (file) uploadFile(file);
  });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) uploadFile(file);
  });
</script>
```

## How files appear in submissions

Uploaded files are stored as URLs. Image uploads are stored under the `image` key; other files use `file`.

```json
{
  "file": "https://storage.example.com/abc123.pdf"
}
```

## Server-side processing overview

When Formbase receives a file, it uploads it to your configured storage and writes the resulting URL into the submission data. You can download or process the file later by fetching that URL.

## Next steps

- [Multiple files](/file-uploads/multiple-files)
- [Allowed file types](/file-uploads/allowed-file-types)
