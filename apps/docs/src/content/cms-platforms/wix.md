---
order: 4
shortTitle: 'Wix'
title: 'Wix Integration'
description: 'Connect Wix forms to Formbase using Embed or Velo.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Wix Integration

Wix supports both HTML embeds and Velo (custom code). Use whichever fits your site plan.

## Step-by-step setup

1. Create a form in Formbase and copy the endpoint.
2. Add an **Embed** element or enable **Velo** for custom scripting.
3. Insert your form code or fetch logic.
4. Publish and test.


## Example 1: Embed HTML form

```html
<form action="https://formbase.dev/s/YOUR_FORM_ID" method="POST">
  <label for="name">Name</label>
  <input id="name" name="name" type="text" required />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Send</button>
</form>
```

## Example 2: Velo (client-side) submission

```js
// In Wix Velo (Page Code)
$w.onReady(function () {
  $w('#submitButton').onClick(async () => {
    $w('#status').text = '';

    const payload = {
      name: $w('#nameInput').value,
      email: $w('#emailInput').value,
    };

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      $w('#status').text = 'Submitted!';
      $w('#nameInput').value = '';
      $w('#emailInput').value = '';
    } catch (error) {
      console.error(error);
      $w('#status').text = 'Submission failed. Please retry.';
    }
  });
});
```

## Wix gotchas

- Velo is required for custom JavaScript; enable it in site settings.
- Embed blocks may not allow external scripts on some plans.
