---
order: 4
shortTitle: 'Security Considerations'
title: 'File Upload Security Considerations'
description: 'Protect your app and users when accepting files.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# File Upload Security Considerations

File uploads are one of the most common attack vectors. Formbase stores files safely, but you should still validate and constrain uploads in your app.

## Key security rules

- Never trust file extensions alone.
- Validate MIME types and inspect file signatures.
- Store files in private buckets when possible and use signed URLs.
- Scan uploads for malware if they will be redistributed.

## Example 1: Verify file signatures (magic bytes)

```ts
// Pseudo-code example
function isPdf(buffer: Buffer) {
  const signature = buffer.subarray(0, 4).toString('hex');
  return signature === '25504446'; // %PDF
}

if (!isPdf(fileBuffer)) {
  throw new Error('Invalid PDF file');
}
```

## Example 2: Use signed URLs for downloads

```ts
// Pseudo-code example
const url = await storage.signGetUrl({
  bucket: 'formbase',
  object: 'file.pdf',
  expiresIn: 60 * 10, // 10 minutes
});
```

## Example 3: Malware scanning workflow

```text
Upload -> Store in quarantine -> Scan -> Move to public/private bucket
```

## Why server-side validation matters

Client-side checks can be bypassed. Always validate on the server before processing or sharing files.
