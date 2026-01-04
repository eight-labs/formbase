---
order: 2
shortTitle: 'WordPress'
title: 'WordPress Integration'
description: 'Use a Custom HTML block to send WordPress forms to Formbase.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# WordPress Integration

WordPress lets you drop in raw HTML blocks, which is the easiest way to connect a Formbase endpoint.

## Step-by-step setup

1. Create a form in Formbase and copy the endpoint.
2. In the WordPress editor, add a **Custom HTML** block.
3. Paste your form markup and update the `action` URL.
4. Publish the page and submit a test entry.


## Example 1: Basic HTML form

```html
<form action="https://formbase.dev/s/YOUR_FORM_ID" method="POST">
  <label for="name">Name</label>
  <input id="name" name="name" type="text" required />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Send</button>
</form>
```

## Example 2: AJAX submission inside WordPress

```html
<form id="wp-contact">
  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>
  <button type="submit">Send</button>
  <p id="status" role="status" aria-live="polite"></p>
</form>

<script>
  const form = document.getElementById('wp-contact');
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

## WordPress gotchas

- Some themes strip scripts from blocks; use a plugin that allows custom JS if needed.
- Caching plugins may delay changes from appearing; clear cache after updates.
