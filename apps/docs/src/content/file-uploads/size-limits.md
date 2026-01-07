---
order: 3
shortTitle: 'Size Limits'
title: 'File Size Limits'
description: 'Understand default limits and how to enforce your own.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# File Size Limits

Formbase does not enforce file size limits in the codebase. The effective limit comes from your reverse proxy or hosting platform, so set one explicitly for performance and security.

## Application vs. infrastructure limits

- **Application-level limit:** none
- **Effective limit:** your proxy or platform request size settings

## Example 1: Client-side size validation

```html
<input id="file" type="file" />
<p id="status" role="status" aria-live="polite"></p>

<script>
  const maxBytes = 10 * 1024 * 1024; // Example: 10 MB
  const fileInput = document.getElementById('file');
  const status = document.getElementById('status');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    if (file.size > maxBytes) {
      status.textContent = 'File is too large.';
      fileInput.value = '';
      return;
    }

    status.textContent = 'File size OK.';
  });
</script>
```

## Example 2: Nginx request size limits

```nginx
# Limit request body size to 10 MB
client_max_body_size 10m;
```

## Example 3: Clear UI copy for limits

```html
<p class="help-text">Max file size: 10 MB (PDF, PNG, JPG)</p>
```

## Tips

- Enforce limits on both client and server.
- Keep total submission size smaller than your storage and email constraints.
