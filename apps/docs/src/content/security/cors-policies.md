---
order: 3
shortTitle: 'CORS Policies'
title: 'CORS Policies'
description: 'Understand cross-origin submissions and common fixes.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# CORS Policies

CORS controls which origins can submit to your Formbase endpoint from the browser.

## Default behavior

Formbase allows cross-origin submissions by default so you can post from any domain.

## Example 1: Restrict origins at the edge

If you self-host, add an allowlist at your reverse proxy.

```nginx
add_header Access-Control-Allow-Origin "https://example.com" always;
add_header Access-Control-Allow-Methods "POST, OPTIONS" always;
add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
```

## Example 2: Troubleshooting a CORS error

- Confirm the request method is `POST`.
- Ensure the endpoint is correct and uses HTTPS.
- If you added a custom proxy, verify it forwards `OPTIONS` requests.

## Tips

- CORS affects browser requests only; server-to-server calls ignore it.
- Keep your allowlist as narrow as possible.
