---
order: 6
shortTitle: 'Vue: Vanilla'
title: 'Vue 3 Integration (Composition API)'
description: 'Use Vue 3 Composition API with Formbase.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Vue 3 Integration (Composition API)

These examples use Vue 3 single-file components with `script setup`.

## Example 1: Basic JSON submission

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <label for="name">Name</label>
    <input id="name" v-model="form.name" type="text" required />

    <label for="email">Email</label>
    <input id="email" v-model="form.email" type="email" required />

    <label for="message">Message</label>
    <textarea id="message" v-model="form.message" required></textarea>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Sending...' : 'Send' }}
    </button>
    <p role="status">{{ status }}</p>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({
  name: '',
  email: '',
  message: '',
});
const status = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  status.value = '';
  isSubmitting.value = true;

  try {
    const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error(`Submission failed: ${response.status}`);
    }

    status.value = 'Submitted!';
    form.name = '';
    form.email = '';
    form.message = '';
  } catch (error) {
    console.error(error);
    status.value = 'Submission failed. Please retry.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
```

## Example 2: File upload with FormData

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <label for="name">Name</label>
    <input id="name" v-model="name" type="text" required />

    <label for="file">Attachment</label>
    <input id="file" type="file" @change="handleFile" />

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Uploading...' : 'Send' }}
    </button>
    <p role="status">{{ status }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const name = ref('');
const file = ref<File | null>(null);
const status = ref('');
const isSubmitting = ref(false);

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  file.value = target.files?.[0] ?? null;
};

const handleSubmit = async () => {
  status.value = '';
  isSubmitting.value = true;

  const formData = new FormData();
  formData.append('name', name.value);
  if (file.value) {
    formData.append('file', file.value);
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
    name.value = '';
    file.value = null;
  } catch (error) {
    console.error(error);
    status.value = 'Upload failed. Please retry.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
```

## Next steps

- [Vue FormKit](/form-integration/vue-formkit)
- [File uploads](/file-uploads/basic-file-upload)
