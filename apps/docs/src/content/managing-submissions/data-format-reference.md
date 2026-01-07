---
order: 3
shortTitle: 'Data Format Reference'
title: 'Data Format Reference'
description: 'How Formbase stores and exports submission data.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Data Format Reference

Formbase stores submission data as JSON with dynamic keys. Keys are created from the form field names you submit.

## Example 1: Standard HTML form

**HTML**

```html
<form action="https://formbase.dev/s/YOUR_FORM_ID" method="POST">
  <input name="name" type="text" />
  <input name="email" type="email" />
  <textarea name="message"></textarea>
</form>
```

**Stored data**

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "message": "Hello from Formbase"
}
```

## Example 2: JSON submission

**Request**

```json
{
  "name": "Ada",
  "tags": ["beta", "priority"],
  "meta": { "source": "pricing" }
}
```

**Stored data**

```json
{
  "name": "Ada",
  "tags": ["beta", "priority"],
  "meta": { "source": "pricing" }
}
```

## Example 3: File uploads

**Request**

```html
<input name="file" type="file" />
```

**Stored data**

```json
{
  "file": "https://storage.example.com/abc123.pdf"
}
```

## Notes on dynamic keys

- Formbase updates the key list as new fields appear.
- The CSV export header is built from the key list.
- If your field names change, exports will include both old and new columns.
