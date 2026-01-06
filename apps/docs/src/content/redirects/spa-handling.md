---
order: 4
shortTitle: 'SPA Handling'
title: 'SPA Redirect Handling'
description: 'Handle redirects in React Router, Vue Router, and other SPAs.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# SPA Redirect Handling

Single-page apps usually handle routing in JavaScript. After a successful submission, use your router instead of `window.location`.

## Example 1: React Router

```tsx
import { useNavigate } from 'react-router-dom';

export function ContactForm() {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      navigate('/thank-you');
    } catch (error) {
      console.error(error);
      navigate('/error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <button type="submit">Send</button>
    </form>
  );
}
```

## Example 2: Vue Router

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" required />
    <button type="submit">Send</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('email', email.value);

  try {
    const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Submission failed: ${response.status}`);
    }

    router.push('/thank-you');
  } catch (error) {
    console.error(error);
    router.push('/error');
  }
};
</script>
```

## Example 3: Svelte SPA routing

```svelte
<script>
  import { goto } from '$app/navigation';

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      goto('/thank-you');
    } catch (error) {
      console.error(error);
      goto('/error');
    }
  }
</script>

<form on:submit={handleSubmit}>
  <input name="email" type="email" required />
  <button type="submit">Send</button>
</form>
```
