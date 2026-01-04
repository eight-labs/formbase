---
order: 5
shortTitle: 'Error Page Redirects'
title: 'Error Page Redirects'
description: 'Send users to a friendly error page when a submission fails.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Error Page Redirects

When something goes wrong, a friendly error page keeps users informed and helps you recover the submission.

## Example 1: Configure the error URL in the dashboard

Set an error page URL in the form settings so non-JS submissions have a fallback.


## Example 2: Client-side error redirect

```html
<form id="contact">
  <input name="email" type="email" required />
  <button type="submit">Send</button>
</form>

<script>
  const form = document.getElementById('contact');

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
      window.location.href = '/error?reason=submit_failed';
    }
  });
</script>
```

## Tips

- Provide a contact email on your error page.
- Consider saving the form data locally so users do not have to retype.
