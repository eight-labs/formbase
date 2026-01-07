---
order: 2
shortTitle: 'Rate Limiting'
title: 'Rate Limiting'
description: 'Protect your forms from bursts and abuse.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Rate Limiting

Rate limits protect your form endpoint from spam and abuse. Formbase does not enforce rate limits in the codebase, so configure them at your edge.

## Example 1: Cloudflare rate limit rule

```text
If request path matches /s/* and rate > 60/minute per IP -> block
```

## Example 2: Nginx rate limiting

```nginx
limit_req_zone $binary_remote_addr zone=formbase:10m rate=60r/m;

location /s/ {
  limit_req zone=formbase burst=20 nodelay;
}
```

## Tips

- Rate limits work best with spam protection and honeypots.
- Adjust burst settings for legitimate traffic spikes.
