---
order: 3
shortTitle: 'Squarespace'
title: 'Squarespace Integration'
description: 'Add a code block and point your form action to Formbase.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Squarespace Integration

Squarespace allows custom HTML via Code Blocks. That is the easiest way to use Formbase.

## Step-by-step setup

1. Create a form in Formbase and copy the endpoint.
2. In Squarespace, edit your page and insert a **Code** block.
3. Paste the form HTML and set the `action` to your Formbase endpoint.
4. Save and test a submission.


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

## Example 2: AJAX submission

```html
<form id="ss-contact">
  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>
  <button type="submit">Send</button>
  <p id="status" role="status" aria-live="polite"></p>
</form>

<script>
  const form = document.getElementById('ss-contact');
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

## Squarespace gotchas

- Some Squarespace plans restrict custom code blocks.
- Test on a published page to confirm scripts run as expected.
