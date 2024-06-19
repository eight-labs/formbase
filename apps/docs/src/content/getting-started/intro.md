---
order: 0
shortTitle: 'Intro'
title: 'Getting Started'
description: 'Formbase is a form backend for your HTML Forms'
lastModifiedAt: 2024-03-19
publishedAt: 2024-03-19
---

## Getting Started

Welcome to Formbase! This guide will help you integrate Formbase into your applications. It covers creating a form on Formbase, embedding it into your HTML, and submitting form data using different methods.

## Contents

1. [Quick Start](#quick-start)
2. [HTML Integration](#html-integration)
3. [JavaScript Submission](#javascript-submission)

## Quick Start

This section provides a brief overview to get you up and running quickly with Formbase.

1. **Log in to Formbase**: Navigate to [Formbase](https://formbase.dev) and log in to your account.
2. **Create a New Form**: Once logged in, go to your dashboard and click on the `New Form Endpoint` button.
3. **Configure Your Form**: Add the necessary fields and configure them according to your requirements.
4. **Save Your Form**: After configuring your form, save it. You will receive a unique `Form ID`.

## HTML Integration

Integrating your Formbase form into your HTML is straightforward. Follow these steps to embed your form into your website:

### Basic HTML Form Integration

To integrate your form, add the following HTML snippet to your webpage. Replace `YOUR_FORM_ID` with the `Form ID` you received from Formbase.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Formbase HTML Integration</title>
  </head>
  <body>
    <form
      id="formbase-form"
      action="https://formbase.dev/s/YOUR_FORM_ID"
      enctype="multipart/form-data"
      method="post"
    >
      <!-- User Input Fields -->
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Your Email" required />
      <!-- Submit Button -->
      <button type="submit">Submit</button>
    </form>
  </body>
</html>
```

## JavaScript Submission

For more control over form submission, you can use JavaScript to handle the submission process. This allows you to manage the form data before sending it to Formbase and handle the server response more effectively.

### `onsubmit` Handler for JavaScript

Add the following JavaScript code to your HTML file to handle form submissions using JavaScript. This code intercepts the form submission, sends the data using the Fetch API, and processes the server response.

```html
<script>
  document.getElementById('formbase-form').onsubmit = async function (event) {
    // Prevent the default form submission
    event.preventDefault();
    // Create a FormData object from the form element
    const formData = new FormData(event.target);
    try {
      // Send the form data using the Fetch API
      const response = await fetch('https://formbase.dev/s/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
      });
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error('An error occured' + response.statusText);
      }
      // Parse the JSON response
      const data = await response.json();
    } catch (error) {
      // Log any errors to the console
      console.error('Error:', error);
    }
  };
</script>
```

Replace `YOUR_FORM_ID` with your unique Form ID.
