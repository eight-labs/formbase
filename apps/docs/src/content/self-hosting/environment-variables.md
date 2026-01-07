---
order: 2
shortTitle: 'Environment Variables'
title: 'Environment Variables'
description: 'Every environment variable used by Formbase.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Environment Variables

Below is the full list of environment variables used by Formbase. Use `.env` or your hosting provider's settings.

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `NODE_ENV` | Optional | Runtime mode. | `production` |
| `PORT` | Optional | Server port. | `3000` |
| `DATABASE_URL` | Required | SQLite file or Turso libsql URL. | `file:/data/formbase.db` |
| `TURSO_AUTH_TOKEN` | Optional | Token for Turso libsql. | `turso_xxx` |
| `NEXT_PUBLIC_APP_URL` | Required | Public URL for redirects and links. | `https://forms.example.com` |
| `BETTER_AUTH_SECRET` | Required | Secret for auth encryption (32+ chars). | `your-long-secret` |
| `AUTH_GITHUB_ID` | Optional | GitHub OAuth client ID. | `github-client-id` |
| `AUTH_GITHUB_SECRET` | Optional | GitHub OAuth client secret. | `github-client-secret` |
| `AUTH_GOOGLE_ID` | Optional | Google OAuth client ID. | `google-client-id` |
| `AUTH_GOOGLE_SECRET` | Optional | Google OAuth client secret. | `google-client-secret` |
| `SMTP_TRANSPORT` | Optional | Email provider (`smtp` or `resend`). | `smtp` |
| `SMTP_HOST` | Optional | SMTP host name. | `smtp.mailgun.org` |
| `SMTP_PORT` | Optional | SMTP port. | `587` |
| `SMTP_USER` | Optional | SMTP username. | `postmaster@example.com` |
| `SMTP_PASS` | Optional | SMTP password. | `smtp-password` |
| `RESEND_API_KEY` | Optional | Resend API key (if using Resend). | `re_xxx` |
| `ALLOW_SIGNIN_SIGNUP` | Required | Allow new accounts (true/false). | `true` |
| `UMAMI_TRACKING_ID` | Optional | Umami analytics site ID. | `uuid` |
| `STORAGE_ENDPOINT` | Required for uploads | S3-compatible endpoint host. | `minio` |
| `STORAGE_PORT` | Required for uploads | Storage port. | `9002` |
| `STORAGE_USESSL` | Required for uploads | Use SSL for storage endpoint. | `false` |
| `STORAGE_ACCESS_KEY` | Required for uploads | Storage access key. | `formbase` |
| `STORAGE_SECRET_KEY` | Required for uploads | Storage secret key. | `password` |
| `STORAGE_BUCKET` | Required for uploads | Storage bucket name. | `formbase` |
| `VERCEL_URL` | Optional | Vercel deployment URL. | `formbase.vercel.app` |

## Notes

- If `SMTP_TRANSPORT` is `smtp`, you must set SMTP host, port, user, and pass.
- If `SMTP_TRANSPORT` is `resend`, set `RESEND_API_KEY`.
- File uploads require all `STORAGE_*` variables.
