---
order: 0
shortTitle: 'HTML Forms (Traditional)'
title: 'HTML Forms (Traditional)'
description: 'The simplest way to send submissions: no JavaScript required.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# HTML Forms (Traditional)

Traditional HTML submissions are the fastest way to get started. The browser handles the POST, and the user gets an immediate success redirect.

## HTML vs AJAX (quick tradeoffs)

| Approach | Best for | Tradeoffs |
| --- | --- | --- |
| HTML form | Simple sites, no JS, progressive enhancement | Limited control over custom UI |
| AJAX | SPAs, rich UI feedback, inline errors | Requires JavaScript and extra code |

## Example 1: Basic contact form

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase HTML Form</title>
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

## Example 2: Progressive enhancement with graceful fallback

This form works without JavaScript, but if JS is available it shows inline success and error messages.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Progressive Formbase Form</title>
  </head>
  <body>
    <form
      id="contact-form"
      action="https://formbase.dev/s/YOUR_FORM_ID"
      method="POST"
      enctype="multipart/form-data"
    >
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label for="attachment">Attachment</label>
      <input id="attachment" name="attachment" type="file" />

      <button type="submit" id="submit">Send</button>
      <p id="status" role="status" aria-live="polite"></p>
    </form>

    <script>
      const form = document.getElementById('contact-form');
      const status = document.getElementById('status');
      const submit = document.getElementById('submit');

      form.addEventListener('submit', async (event) => {
        if (!window.fetch) return; // Fallback to native submission.
        event.preventDefault();
        status.textContent = '';
        submit.disabled = true;

        try {
          const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
          });

          if (!response.ok) {
            throw new Error(`Submission failed: ${response.status}`);
          }

          status.textContent = 'Thanks! We will be in touch soon.';
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

## Tips

- Configure your return URL in the dashboard to control where users land next.
- Use `required`, `pattern`, and native input types for basic validation.
- For custom UI, see [JavaScript / AJAX Submission](/form-integration/javascript-ajax-submission).
