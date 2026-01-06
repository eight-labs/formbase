---
order: 1
shortTitle: 'Multiple Files'
title: 'Multiple File Uploads'
description: 'Let users attach more than one file in a single submission.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Multiple File Uploads

Multiple file uploads are perfect for portfolio submissions, job applications, or multi-asset requests.

## Example 1: HTML input with multiple files

```html
<form
  action="https://formbase.dev/s/YOUR_FORM_ID"
  method="POST"
  enctype="multipart/form-data"
>
  <label for="files">Attachments</label>
  <input id="files" name="files" type="file" multiple />

  <button type="submit">Upload</button>
</form>
```

## Example 2: AJAX upload with file list UI

```html
<form id="multi-upload">
  <label for="files">Attachments</label>
  <input id="files" name="files" type="file" multiple />

  <ul id="file-list"></ul>
  <button type="submit">Upload</button>
  <p id="status" role="status" aria-live="polite"></p>
</form>

<script>
  const form = document.getElementById('multi-upload');
  const filesInput = document.getElementById('files');
  const list = document.getElementById('file-list');
  const status = document.getElementById('status');

  filesInput.addEventListener('change', () => {
    list.innerHTML = '';
    [...filesInput.files].forEach((file) => {
      const item = document.createElement('li');
      item.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
      list.appendChild(item);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    const formData = new FormData();
    [...filesInput.files].forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      status.textContent = 'Uploaded!';
      form.reset();
      list.innerHTML = '';
    } catch (error) {
      console.error(error);
      status.textContent = 'Upload failed. Please retry.';
    }
  });
</script>
```

## How multiple files appear

Formbase stores multiple uploads as arrays of URLs.

```json
{
  "files": [
    "https://storage.example.com/file-a.pdf",
    "https://storage.example.com/file-b.pdf"
  ]
}
```

## Tips

- Communicate limits clearly in the UI.
- Use client-side validation to block unsupported files before upload.
