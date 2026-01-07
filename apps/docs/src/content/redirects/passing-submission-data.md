---
order: 2
shortTitle: 'Passing Submission Data'
title: 'Passing Submission Data'
description: 'Send submission IDs or field values to your thank-you page.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Passing Submission Data

Sometimes your thank-you page needs to know what was submitted. Formbase supports passing data in query parameters or reading the JSON response.

## Example 1: Pass a submission ID via AJAX

```html
<form id="contact-form">
  <input name="email" type="email" required />
  <button type="submit">Send</button>
</form>

<script>
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      const payload = await response.json();
      const submissionId = payload.submissionId;
      window.location.href = `/thank-you?submissionId=${submissionId}`;
    } catch (error) {
      console.error(error);
      window.location.href = '/error';
    }
  });
</script>
```

## Example 2: Pass a field value to the thank-you page

```html
<form id="newsletter">
  <input id="email" name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>

<script>
  const form = document.getElementById('newsletter');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      const email = encodeURIComponent(String(formData.get('email') ?? ''));
      window.location.href = `/thank-you?email=${email}`;
    } catch (error) {
      console.error(error);
      window.location.href = '/error';
    }
  });
</script>
```

## Example 3: Read data on the thank-you page

```html
<script>
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  if (email) {
    document.getElementById('email-output').textContent = email;
  }
</script>
```

## Notes

- Avoid sending sensitive data in query strings.
- Use a short-lived token or submission ID for secure lookups.
