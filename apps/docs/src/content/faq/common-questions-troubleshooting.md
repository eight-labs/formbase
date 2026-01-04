---
order: 0
shortTitle: 'Common Questions'
title: 'Common Questions & Troubleshooting'
description: 'Quick fixes for the most common Formbase issues.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Common Questions & Troubleshooting

### Form submissions aren't arriving
1. Check that the form endpoint URL is correct.
2. Verify that submissions are enabled for the form.
3. Submit a test entry with `curl` to rule out frontend issues.

### Email notifications are missing
1. Confirm that email notifications are enabled in form settings.
2. Check the default recipient email address.
3. Check your spam folder or SMTP provider logs.

### File upload is failing
1. Verify the file is under your configured size limit (proxy or platform).
2. Check that the file type is allowed.
3. Confirm storage credentials are configured.

### CORS errors in the browser
1. Make sure you are using `https://` in the endpoint URL.
2. Confirm your reverse proxy is forwarding `OPTIONS` requests.
3. Check for browser extensions that block requests.

### Redirects are not working
1. Confirm the return URL is set in the dashboard.
2. Use an absolute URL with `https://`.
3. For SPA apps, handle the redirect in JavaScript.

### JSON submissions return errors
1. Ensure the request has `Content-Type: application/json`.
2. Validate your JSON before sending.
3. Confirm the endpoint accepts JSON submissions.
