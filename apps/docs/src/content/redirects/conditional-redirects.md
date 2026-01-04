---
order: 3
shortTitle: 'Conditional Redirects'
title: 'Conditional Redirects'
description: 'Send users to different pages based on their submission.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Conditional Redirects

Conditional redirects are useful when you want different thank-you pages for different choices (plan, region, lead type).

## Example 1: Dashboard rules

In the dashboard, create rules like:

- If `plan` is `enterprise` -> redirect to `/thanks-enterprise`
- If `plan` is `starter` -> redirect to `/thanks-starter`


## Example 2: Client-side conditional redirect

```html
<form id="plan-form">
  <select name="plan">
    <option value="starter">Starter</option>
    <option value="enterprise">Enterprise</option>
  </select>
  <button type="submit">Send</button>
</form>

<script>
  const form = document.getElementById('plan-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const plan = String(formData.get('plan') ?? '');

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      if (plan === 'enterprise') {
        window.location.href = '/thanks-enterprise';
      } else {
        window.location.href = '/thanks-starter';
      }
    } catch (error) {
      console.error(error);
      window.location.href = '/error';
    }
  });
</script>
```

## Tips

- Keep rules simple and predictable.
- Avoid putting sensitive logic solely in client-side checks.
