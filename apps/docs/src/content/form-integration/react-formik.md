---
order: 5
shortTitle: 'React: Formik'
title: 'Formik Integration'
description: 'Formik + Formbase with validation and async submission.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Formik Integration

Formik is a strong choice for complex form state. Below are two complete examples.

## Example 1: Basic JSON submission

```tsx
import { Formik } from 'formik';

type FormValues = {
  name: string;
  email: string;
  message: string;
};

export function ContactFormFormik() {
  return (
    <Formik<FormValues>
      initialValues={{ name: '', email: '', message: '' }}
      validate={(values) => {
        const errors: Partial<FormValues> = {};
        if (!values.name) errors.name = 'Name is required';
        if (!values.email) errors.email = 'Email is required';
        if (!values.message) errors.message = 'Message is required';
        return errors;
      }}
      onSubmit={async (values, { resetForm, setStatus }) => {
        setStatus(undefined);
        try {
          const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });

          if (!response.ok) {
            throw new Error(`Submission failed: ${response.status}`);
          }

          resetForm();
          setStatus('Submitted!');
        } catch (error) {
          console.error(error);
          setStatus('Something went wrong.');
        }
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting,
        status,
      }) => (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
          {errors.name && <span role="alert">{errors.name}</span>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <span role="alert">{errors.email}</span>}

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
          />
          {errors.message && <span role="alert">{errors.message}</span>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
          {status && <p role="status">{status}</p>}
        </form>
      )}
    </Formik>
  );
}
```

## Example 2: File upload with FormData

```tsx
import { Formik } from 'formik';

export function ContactFormFormikWithFile() {
  return (
    <Formik
      initialValues={{ name: '', attachment: null as File | null }}
      onSubmit={async (values, { resetForm, setStatus }) => {
        setStatus(undefined);

        const formData = new FormData();
        formData.append('name', values.name);
        if (values.attachment) {
          formData.append('file', values.attachment);
        }

        try {
          const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
          }

          resetForm();
          setStatus('Uploaded!');
        } catch (error) {
          console.error(error);
          setStatus('Upload failed.');
        }
      }}
    >
      {({ handleSubmit, setFieldValue, isSubmitting, status }) => (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={(event) => setFieldValue('name', event.target.value)}
          />

          <label htmlFor="attachment">Attachment</label>
          <input
            id="attachment"
            name="attachment"
            type="file"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] ?? null;
              setFieldValue('attachment', file);
            }}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Send'}
          </button>
          {status && <p role="status">{status}</p>}
        </form>
      )}
    </Formik>
  );
}
```

## Notes

- When using Formik, handle `File` values explicitly with `setFieldValue`.
- Use `setStatus` for server errors or success messages.
