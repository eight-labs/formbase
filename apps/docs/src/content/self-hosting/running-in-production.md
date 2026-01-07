---
order: 6
shortTitle: 'Running in Production'
title: 'Running in Production'
description: 'Checklist for a stable and secure deployment.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Running in Production

Use this checklist before going live.

## Production checklist

- Set `NEXT_PUBLIC_APP_URL` to your public domain.
- Enable TLS (HTTPS) at your reverse proxy.
- Configure backups for your database and storage bucket.
- Set rate limits at the edge.
- Monitor logs and alerts for failures.

## Example: Reverse proxy headers

```nginx
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
```

## Example: Health check

```bash
curl -I https://forms.example.com
```

## Tips

- Use a staging environment for testing upgrades.
- Document your recovery plan and credentials.
