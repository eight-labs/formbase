---
order: 1
shortTitle: 'Dynamic URL Parameters'
title: 'Dynamic URL Parameters'
description: 'Personalize redirects with values from the submission.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Dynamic URL Parameters

Dynamic parameters let you personalize thank-you pages. Formbase can inject field values into your return URL.

## Example 1: Static return URL with placeholders

Set the return URL in the dashboard using placeholders:

```text
https://example.com/thanks?name={name}&plan={plan}
```

When a user submits `name=Chris` and `plan=pro`, the redirect becomes:

```text
https://example.com/thanks?name=Chris&plan=pro
```

## Example 2: Build a redirect URL in JavaScript

If you want more control, build the URL yourself after a successful AJAX submission.

```html
<form id="pricing-form">
  <input name="name" type="text" required />
  <select name="plan">
    <option value="starter">Starter</option>
    <option value="pro">Pro</option>
  </select>
  <button type="submit">Send</button>
</form>

<script>
  const form = document.getElementById('pricing-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const params = new URLSearchParams({
      name: String(formData.get('name') ?? ''),
      plan: String(formData.get('plan') ?? ''),
    });

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      window.location.href = `/thanks?${params.toString()}`;
    } catch (error) {
      console.error(error);
      window.location.href = '/error';
    }
  });
</script>
```

## Tips

- Always URL-encode values when building URLs manually.
- Avoid putting sensitive data in query parameters.
