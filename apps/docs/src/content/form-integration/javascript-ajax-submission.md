---
order: 1
shortTitle: 'JavaScript / AJAX Submission'
title: 'JavaScript / AJAX Submission'
description: 'Full control over loading, errors, and SPA-friendly flows.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# JavaScript / AJAX Submission

AJAX submissions let you keep users on the same page, show loading states, and handle errors inline. This is ideal for SPAs or highly customized forms.

## Example 1: Fetch API (recommended)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase Fetch Example</title>
  </head>
  <body>
    <form id="contact-form">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label for="message">Message</label>
      <textarea id="message" name="message" required></textarea>

      <button id="submit" type="submit">Send</button>
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

          status.textContent = 'Submitted!';
          form.reset();
        } catch (error) {
          console.error(error);
          status.textContent = 'Submission failed. Please retry.';
        } finally {
          submit.disabled = false;
        }
      });
    </script>
  </body>
</html>
```

## Example 2: XMLHttpRequest

Use this if you need compatibility with older environments.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase XHR Example</title>
  </head>
  <body>
    <form id="xhr-form">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <button type="submit">Send</button>
      <p id="xhr-status" role="status" aria-live="polite"></p>
    </form>

    <script>
      const xhrForm = document.getElementById('xhr-form');
      const xhrStatus = document.getElementById('xhr-status');

      xhrForm.addEventListener('submit', (event) => {
        event.preventDefault();
        xhrStatus.textContent = 'Sending...';

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://formbase.dev/s/YOUR_FORM_ID', true);

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            xhrStatus.textContent = 'Submitted!';
            xhrForm.reset();
          } else {
            xhrStatus.textContent = `Error: ${xhr.status}`;
          }
        };

        xhr.onerror = () => {
          xhrStatus.textContent = 'Network error. Please try again.';
        };

        xhr.send(new FormData(xhrForm));
      });
    </script>
  </body>
</html>
```

## Example 3: jQuery AJAX

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formbase jQuery Example</title>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  </head>
  <body>
    <form id="jquery-form">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <button type="submit">Send</button>
      <p id="jquery-status" role="status" aria-live="polite"></p>
    </form>

    <script>
      $('#jquery-form').on('submit', function (event) {
        event.preventDefault();

        $('#jquery-status').text('Sending...');
        const formData = new FormData(this);

        $.ajax({
          url: 'https://formbase.dev/s/YOUR_FORM_ID',
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
        })
          .done(() => {
            $('#jquery-status').text('Submitted!');
            $('#jquery-form')[0].reset();
          })
          .fail((jqXHR) => {
            console.error(jqXHR.responseText);
            $('#jquery-status').text(`Error: ${jqXHR.status}`);
          });
      });
    </script>
  </body>
</html>
```

## Tips

- For file uploads, always use `FormData` and do not set `Content-Type` manually.
- For SPA routing and post-submission flows, see [Redirects](/redirects/basic-redirect-setup).
