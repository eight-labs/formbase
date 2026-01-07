---
order: 8
shortTitle: 'Svelte'
title: 'Svelte Integration'
description: 'Use Svelte with Formbase for simple or advanced submissions.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Svelte Integration

Svelte makes forms concise and reactive. Here are two complete examples.

## Example 1: Basic JSON submission

```svelte
<script lang="ts">
  let name = '';
  let email = '';
  let message = '';
  let status = '';
  let isSubmitting = false;

  const handleSubmit = async () => {
    status = '';
    isSubmitting = true;

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      status = 'Submitted!';
      name = '';
      email = '';
      message = '';
    } catch (error) {
      console.error(error);
      status = 'Submission failed. Please retry.';
    } finally {
      isSubmitting = false;
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label for="name">Name</label>
  <input id="name" bind:value={name} required />

  <label for="email">Email</label>
  <input id="email" type="email" bind:value={email} required />

  <label for="message">Message</label>
  <textarea id="message" bind:value={message} required></textarea>

  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Sending...' : 'Send'}
  </button>
  <p role="status">{status}</p>
</form>
```

## Example 2: File upload with FormData

```svelte
<script lang="ts">
  let name = '';
  let file: File | null = null;
  let status = '';
  let isSubmitting = false;

  const handleSubmit = async () => {
    status = '';
    isSubmitting = true;

    const formData = new FormData();
    formData.append('name', name);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      status = 'Uploaded!';
      name = '';
      file = null;
    } catch (error) {
      console.error(error);
      status = 'Upload failed. Please retry.';
    } finally {
      isSubmitting = false;
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label for="name">Name</label>
  <input id="name" bind:value={name} required />

  <label for="file">Attachment</label>
  <input
    id="file"
    type="file"
    on:change={(event) => {
      const target = event.target as HTMLInputElement;
      file = target.files?.[0] ?? null;
    }}
  />

  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Uploading...' : 'Send'}
  </button>
  <p role="status">{status}</p>
</form>
```
