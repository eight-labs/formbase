---
order: 2
shortTitle: 'Your Form Endpoint'
title: 'Your Form Endpoint'
description: 'Where to find your endpoint and how to submit to it.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Your Form Endpoint

Every Formbase form gets a unique endpoint. This is the URL your form submits to.

```text
https://formbase.dev/s/YOUR_FORM_ID
```

## Where to find it

Open your form in the dashboard and copy the endpoint shown on the form details page.


## What it accepts

- `multipart/form-data` for HTML form posts and file uploads
- `application/json` for API-style submissions
- Cross-origin submissions are allowed with CORS enabled

## Example 1: HTML form action

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase Endpoint Example</title>
  </head>
  <body>
    <form action="https://formbase.dev/s/YOUR_FORM_ID" method="POST">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <button type="submit">Send</button>
    </form>
  </body>
</html>
```

## Example 2: JSON submission with fetch

Use JSON when you already have structured data and do not need file uploads.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase JSON Submission</title>
  </head>
  <body>
    <button id="send">Send JSON</button>

    <script>
      const button = document.getElementById('send');

      button.addEventListener('click', async () => {
        try {
          const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Ada Lovelace',
              email: 'ada@example.com',
              message: 'Hello from JSON',
            }),
          });

          if (!response.ok) {
            throw new Error(`Submission failed: ${response.status}`);
          }

          const payload = await response.json();
          console.log('Submission stored:', payload);
        } catch (error) {
          console.error('Submission error', error);
        }
      });
    </script>
  </body>
</html>
```

## Example 3: cURL for quick testing

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}' \
  https://formbase.dev/s/YOUR_FORM_ID
```

## When to use which

- **HTML form**: simplest, works without JavaScript, browser handles redirect.
- **AJAX/JSON**: more control over UX, custom success and error handling, ideal for SPAs.

## Next steps

- [Receive your first submission](/getting-started/receiving-your-first-submission)
- [HTML form integration](/form-integration/html-forms-traditional)
- [JavaScript / AJAX submission](/form-integration/javascript-ajax-submission)
