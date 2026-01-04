---
order: 5
shortTitle: 'File Storage'
title: 'File Storage (MinIO)'
description: 'Configure S3-compatible storage for file uploads.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# File Storage (MinIO)

Formbase stores uploaded files in an S3-compatible bucket. MinIO is the easiest local option.

## Example 1: MinIO local configuration

```ini
STORAGE_ENDPOINT=minio
STORAGE_PORT=9002
STORAGE_USESSL=false
STORAGE_ACCESS_KEY=formbase
STORAGE_SECRET_KEY=password
STORAGE_BUCKET=formbase
```

## Example 2: S3-compatible provider

```ini
STORAGE_ENDPOINT=s3.us-east-1.amazonaws.com
STORAGE_PORT=443
STORAGE_USESSL=true
STORAGE_ACCESS_KEY=your-access-key
STORAGE_SECRET_KEY=your-secret-key
STORAGE_BUCKET=formbase
```

## Tips

- Keep buckets private and use signed URLs for downloads.
- Rotate storage credentials regularly.
