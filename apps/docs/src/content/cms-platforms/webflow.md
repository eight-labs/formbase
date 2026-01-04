---
order: 0
shortTitle: 'Webflow'
title: 'Webflow Integration'
description: 'Connect Webflow forms to Formbase with a custom embed.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Webflow Integration

Webflow is great for design, but its built-in form handling is limited. Formbase gives you a real backend without losing Webflow's layout control.

## Step-by-step setup

1. Create a form in Formbase and copy the endpoint.
2. In Webflow Designer, add an **Embed** element where your form should live.
3. Paste the HTML form snippet and set the `action` to your Formbase endpoint.
4. Publish and submit a test entry.


## Example 1: Basic Webflow embed

```html
<form action="https://formbase.dev/s/YOUR_FORM_ID" method="POST">
  <label for="name">Name</label>
  <input id="name" name="name" type="text" required />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Send</button>
</form>
```

## Example 2: AJAX submission inside Webflow

```html
<form id="webflow-contact">
  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>
  <button type="submit">Send</button>
  <p id="status" role="status" aria-live="polite"></p>
</form>

<script>
  const form = document.getElementById('webflow-contact');
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

      status.textContent = 'Thanks!';
      form.reset();
    } catch (error) {
      console.error(error);
      status.textContent = 'Submission failed. Please retry.';
    }
  });
</script>
```

## Webflow gotchas

- Webflow form blocks do not expose the `action` attribute by default; use an Embed block for full control.
- Remove any Webflow-specific attributes like `data-name` if they conflict with your markup.
- Always publish after changes; the Designer preview does not run custom code the same way.
