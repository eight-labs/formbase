---
order: 1
shortTitle: 'Framer'
title: 'Framer Integration'
description: 'Send Framer form submissions to Formbase.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Framer Integration

Framer supports custom code blocks, which makes it easy to send form data to Formbase.

## Step-by-step setup

1. Create a form in Formbase and copy the endpoint.
2. Add a **Code** component in Framer where the form should appear.
3. Paste the HTML or React snippet and set the `action` or fetch URL.
4. Publish and test a submission.


## Example 1: HTML form in a Code component

```html
<form action="https://formbase.dev/s/YOUR_FORM_ID" method="POST">
  <label for="name">Name</label>
  <input id="name" name="name" type="text" required />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Send</button>
</form>
```

## Example 2: AJAX submission with custom status UI

```html
<form id="framer-contact">
  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>
  <button type="submit">Send</button>
  <p id="status" role="status" aria-live="polite"></p>
</form>

<script>
  const form = document.getElementById('framer-contact');
  const status = document.getElementById('status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

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
    }
  });
</script>
```

## Framer gotchas

- Framer may sanitize scripts in some contexts; prefer Code components for custom scripts.
- Test on a published preview to ensure scripts run.
