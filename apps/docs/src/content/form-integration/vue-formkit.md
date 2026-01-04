---
order: 7
shortTitle: 'Vue: FormKit'
title: 'Vue FormKit Integration'
description: 'Use FormKit for validation and composable form UI.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Vue FormKit Integration

FormKit pairs nicely with Formbase for validation and structured inputs.

## Example 1: Basic submission

```ts
// main.ts
import { createApp } from 'vue';
import { plugin, defaultConfig } from '@formkit/vue';
import App from './App.vue';

createApp(App)
  .use(plugin, defaultConfig())
  .mount('#app');
```

```vue
<template>
  <FormKit
    type="form"
    submit-label="Send"
    @submit="handleSubmit"
  >
    <FormKit type="text" name="name" label="Name" validation="required" />
    <FormKit type="email" name="email" label="Email" validation="required" />
    <FormKit
      type="textarea"
      name="message"
      label="Message"
      validation="required"
    />
    <p role="status">{{ status }}</p>
  </FormKit>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const status = ref('');

const handleSubmit = async (data: Record<string, string>) => {
  status.value = '';

  try {
    const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Submission failed: ${response.status}`);
    }

    status.value = 'Submitted!';
  } catch (error) {
    console.error(error);
    status.value = 'Submission failed. Please retry.';
  }
};
</script>
```

## Example 2: File uploads with FormKit

```vue
<template>
  <FormKit type="form" submit-label="Send" @submit="handleSubmit">
    <FormKit type="text" name="name" label="Name" validation="required" />
    <FormKit type="file" name="attachment" label="Attachment" />
    <p role="status">{{ status }}</p>
  </FormKit>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const status = ref('');

const handleSubmit = async (data: Record<string, unknown>) => {
  status.value = '';

  const formData = new FormData();
  formData.append('name', String(data.name ?? ''));

  const files = data.attachment as File[] | undefined;
  if (files && files[0]) {
    formData.append('file', files[0]);
  }

  try {
    const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    status.value = 'Uploaded!';
  } catch (error) {
    console.error(error);
    status.value = 'Upload failed. Please retry.';
  }
};
</script>
```

## Notes

- FormKit file inputs return an array of `File` objects.
- Use FormKit validation rules for better UX.
