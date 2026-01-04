---
order: 4
shortTitle: 'React Hook Form'
title: 'React Hook Form Integration'
description: 'Use React Hook Form with Formbase for validation and clean form state.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# React Hook Form Integration

React Hook Form is fast, lightweight, and great for accessible validation. Here are two complete examples.

## Example 1: Basic JSON submission

```tsx
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export function ContactFormRHF() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      reset();
    } catch (error) {
      console.error(error);
      alert('Submission failed. Please retry.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        {...register('name', { required: 'Name is required' })}
      />
      {errors.name && <span role="alert">{errors.name.message}</span>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        {...register('email', {
          required: 'Email is required',
        })}
      />
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        {...register('message', { required: 'Message is required' })}
      />
      {errors.message && <span role="alert">{errors.message.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

## Example 2: File uploads with FormData

```tsx
import { useForm } from 'react-hook-form';

type UploadFormData = {
  name: string;
  attachment: FileList;
};

export function ContactFormRHFWithFile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<UploadFormData>();

  const onSubmit = async (data: UploadFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);

    const file = data.attachment?.[0];
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

      reset();
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please retry.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input id="name" {...register('name', { required: true })} />

      <label htmlFor="attachment">Attachment</label>
      <input id="attachment" type="file" {...register('attachment')} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Send'}
      </button>
    </form>
  );
}
```

## Notes

- Do not set `Content-Type` manually when using `FormData`.
- For advanced validation, use React Hook Form resolvers.
