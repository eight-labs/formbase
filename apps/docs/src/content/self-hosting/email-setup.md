---
order: 4
shortTitle: 'Email Setup'
title: 'Email Setup (SMTP/Resend)'
description: 'Configure email notifications for self-hosted Formbase.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Email Setup (SMTP/Resend)

Formbase supports SMTP and Resend for sending submission notifications.

## Example 1: SMTP configuration

```ini
SMTP_TRANSPORT=smtp
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@example.com
SMTP_PASS=your-password
```

## Example 2: Resend configuration

```ini
SMTP_TRANSPORT=resend
RESEND_API_KEY=re_xxx
```

## Tips

- Use a dedicated sending domain for better deliverability.
- Test notifications using a simple form before going live.
