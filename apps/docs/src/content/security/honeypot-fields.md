---
order: 1
shortTitle: 'Honeypot Fields'
title: 'Honeypot Fields'
description: 'Add invisible fields that catch bots without hurting UX.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Honeypot Fields

A honeypot field is a hidden input that real users never fill out. Bots often do.

## Example 1: Hidden field with CSS

```html
<form action="https://formbase.dev/s/YOUR_FORM_ID" method="POST">
  <div class="honeypot">
    <label for="company">Company</label>
    <input id="company" name="company" type="text" tabindex="-1" />
  </div>

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />
  <button type="submit">Send</button>
</form>

<style>
  .honeypot {
    position: absolute;
    left: -9999px;
  }
</style>
```

## Example 2: Server-side check

```ts
// Pseudo-code example
if (formData.company) {
  throw new Error('Bot detected');
}
```

## Tips

- Do not use `display: none`; some bots skip hidden fields.
- Use a believable label to entice bots without confusing users.
