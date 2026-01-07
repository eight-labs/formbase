---
order: 0
shortTitle: 'Introduction'
title: 'Introduction'
description: 'What Formbase is and how to get your first submission.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Introduction

Formbase gives your forms a backend without you running one. You create a form in the dashboard, copy the endpoint, and start receiving submissions. The same endpoint works for traditional HTML forms, single-page apps, and API-style JSON posts.

Here is the big idea:

- You own the form markup and UI.
- Formbase handles submission storage, files, and email notifications.
- You can export data any time.

## Quick Start (Two Ways)

### Example 1: Traditional HTML submission

This is the simplest possible path. The browser submits the form and handles the redirect.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase Quick Start</title>
  </head>
  <body>
    <form
      action="https://formbase.dev/s/YOUR_FORM_ID"
      method="POST"
    >
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label for="message">Message</label>
      <textarea id="message" name="message" required></textarea>

      <button type="submit">Send</button>
    </form>
  </body>
</html>
```

### Example 2: AJAX submission with better UI control

Use JavaScript when you want loading states, inline error messaging, or SPA-friendly behavior.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase AJAX Quick Start</title>
  </head>
  <body>
    <form id="contact-form">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label for="message">Message</label>
      <textarea id="message" name="message" required></textarea>

      <button type="submit" id="submit">Send</button>
      <p id="status" role="status" aria-live="polite"></p>
    </form>

    <script>
      const form = document.getElementById('contact-form');
      const status = document.getElementById('status');
      const submit = document.getElementById('submit');

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        status.textContent = '';
        submit.disabled = true;

        try {
          const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
            method: 'POST',
            body: new FormData(form),
          });

          if (!response.ok) {
            throw new Error(`Submission failed: ${response.status}`);
          }

          status.textContent = 'Thanks! We received your message.';
          form.reset();
        } catch (error) {
          console.error(error);
          status.textContent = 'Something went wrong. Please try again.';
        } finally {
          submit.disabled = false;
        }
      });
    </script>
  </body>
</html>
```

## What happens after submission

- Submissions appear in your dashboard under the form.
- You can enable email notifications for instant alerts.
- Exports are available as CSV or JSON.

## Next steps

- [Create your first form](/getting-started/creating-your-first-form)
- [Find and use your endpoint](/getting-started/your-form-endpoint)
- [Receive your first submission](/getting-started/receiving-your-first-submission)
