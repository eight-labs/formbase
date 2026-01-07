---
order: 0
shortTitle: 'Basic Redirect Setup'
title: 'Basic Redirect Setup'
description: 'Send users to a thank-you page after submission.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Basic Redirect Setup

Redirects keep your users on-brand after a successful submission. Set a return URL in the Formbase dashboard and the success flow will point users there.

## Step 1: Configure the return URL in the dashboard


## Example 1: Traditional HTML submission

The browser handles the redirect after Formbase accepts the submission.

```html
<form action="https://formbase.dev/s/YOUR_FORM_ID" method="POST">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>
```

## Example 2: AJAX submission with manual redirect

```html
<form id="subscribe">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>

<script>
  const form = document.getElementById('subscribe');

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

      window.location.href = '/thank-you';
    } catch (error) {
      console.error(error);
      window.location.href = '/error';
    }
  });
</script>
```

## Tips

- Keep your thank-you page fast; it is part of the submission UX.
- Use redirects for both success and error flows.
