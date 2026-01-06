---
order: 0
shortTitle: 'Spam Protection'
title: 'Spam Protection'
description: 'Reduce spam submissions with simple, effective tactics.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Spam Protection

Spam protection is a layered strategy. Combine multiple techniques for better results.

## Strategy checklist

- Use a honeypot field (see next page).
- Add basic client-side validation.
- Rate-limit submission bursts.
- Block obvious bot user agents at your edge.

## Example 1: Time-based trap

Reject submissions that happen too quickly.

```html
<form id="contact-form">
  <input type="hidden" name="form_started_at" value="" />
  <input name="email" type="email" required />
  <button type="submit">Send</button>
</form>

<script>
  const form = document.getElementById('contact-form');
  form.form_started_at.value = Date.now().toString();
</script>
```

On the server, reject if the submission is faster than a human could complete.

## Example 2: Simple bot challenge

```html
<label for="challenge">What is 2 + 3?</label>
<input id="challenge" name="challenge" type="text" required />
```

Check the answer server-side before processing.

## Notes

- Combine multiple defenses for better results.
- Avoid adding too much friction for real users.
