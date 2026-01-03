---
order: 3
shortTitle: 'Receiving Your First Submission'
title: 'Receiving Your First Submission'
description: 'Submit a test payload, confirm it appears in the dashboard, and verify notifications.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Receiving Your First Submission

Once your form endpoint is wired up, the best next step is to send a test submission and confirm it shows up in the dashboard and in your inbox.

## Step 1: Send a test submission

### Example 1: Submit via your live HTML form

Open your website, fill in the form, and submit. This confirms the end-to-end flow works in a real browser.

### Example 2: Submit with fetch for quick feedback

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase Test Submission</title>
  </head>
  <body>
    <button id="send">Send Test Submission</button>
    <p id="status" role="status" aria-live="polite"></p>

    <script>
      const status = document.getElementById('status');

      document.getElementById('send').addEventListener('click', async () => {
        status.textContent = 'Sending...';

        try {
          const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Test User',
              email: 'test@example.com',
              message: 'Testing Formbase',
            }),
          });

          if (!response.ok) {
            throw new Error(`Submission failed: ${response.status}`);
          }

          status.textContent = 'Submitted! Check your dashboard.';
        } catch (error) {
          console.error(error);
          status.textContent = 'Submission failed. Try again.';
        }
      });
    </script>
  </body>
</html>
```

### Example 3: Submit with cURL

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"CLI Test","email":"cli@example.com"}' \
  https://formbase.dev/s/YOUR_FORM_ID
```

## Step 2: Confirm it in the dashboard

Open your form and check the submissions table. You should see your test entry at the top.


## Step 3: Verify notifications

If email notifications are enabled, you should receive an alert at your configured recipient email address.

## Troubleshooting tips

- Double-check the form endpoint URL.
- Make sure submissions are enabled for the form.
- Check spam folders if email notifications are enabled.

## Next steps

- [Manage submissions](/managing-submissions/viewing-submissions)
- [Enable email notifications](/form-settings/email-notifications)
