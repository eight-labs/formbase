---
order: 2
shortTitle: 'HTML Field Types'
title: 'HTML Field Types'
description: 'Markup, submission data shape, and special handling for every standard input type.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# HTML Field Types

This page lists every standard HTML input type and how Formbase records it. Each example shows the markup, the submission data shape, and any special handling to keep in mind.

## text

**HTML**

```html
<input type="text" name="fullName" />
```

**Submission data**

```json
{
  "fullName": "Ada Lovelace"
}
```

**Special handling**

- Use `required`, `minlength`, and `maxlength` for basic validation.

## email

**HTML**

```html
<input type="email" name="email" />
```

**Submission data**

```json
{
  "email": "ada@example.com"
}
```

**Special handling**

- Browsers validate the format automatically.

## password

**HTML**

```html
<input type="password" name="password" />
```

**Submission data**

```json
{
  "password": "example-password"
}
```

**Special handling**

- Avoid collecting passwords unless you must; treat submissions as sensitive data.

## number

**HTML**

```html
<input type="number" name="budget" min="0" step="1" />
```

**Submission data**

```json
{
  "budget": "5000"
}
```

**Special handling**

- Values arrive as strings; convert to numbers in your own processing pipeline.

## tel

**HTML**

```html
<input type="tel" name="phone" />
```

**Submission data**

```json
{
  "phone": "+1 555 0100"
}
```

**Special handling**

- Use `pattern` for basic formatting rules.

## url

**HTML**

```html
<input type="url" name="website" />
```

**Submission data**

```json
{
  "website": "https://example.com"
}
```

**Special handling**

- Browser validation enforces a URL format.

## date

**HTML**

```html
<input type="date" name="startDate" />
```

**Submission data**

```json
{
  "startDate": "2026-01-03"
}
```

**Special handling**

- Values are ISO date strings; store as strings or parse into dates.

## time

**HTML**

```html
<input type="time" name="startTime" />
```

**Submission data**

```json
{
  "startTime": "09:30"
}
```

**Special handling**

- Values are strings in local time.

## datetime-local

**HTML**

```html
<input type="datetime-local" name="meetingTime" />
```

**Submission data**

```json
{
  "meetingTime": "2026-01-03T09:30"
}
```

**Special handling**

- Values are local time strings without timezone info.

## textarea

**HTML**

```html
<textarea name="message"></textarea>
```

**Submission data**

```json
{
  "message": "Hello from a multiline field."
}
```

**Special handling**

- Preserve line breaks in your exports.

## select

**HTML**

```html
<select name="plan">
  <option value="starter">Starter</option>
  <option value="pro">Pro</option>
</select>
```

**Submission data**

```json
{
  "plan": "pro"
}
```

**Special handling**

- For multiple selections, send JSON or use a custom encoding.

## radio

**HTML**

```html
<label>
  <input type="radio" name="priority" value="low" /> Low
</label>
<label>
  <input type="radio" name="priority" value="high" /> High
</label>
```

**Submission data**

```json
{
  "priority": "high"
}
```

**Special handling**

- Only the selected value is submitted.

## checkbox (single)

**HTML**

```html
<label>
  <input type="checkbox" name="terms" value="accepted" />
  I agree to the terms
</label>
```

**Submission data**

```json
{
  "terms": "accepted"
}
```

**Special handling**

- Unchecked boxes do not submit a value.

## checkbox (multiple)

**HTML**

```html
<label>
  <input type="checkbox" name="interests" value="design" /> Design
</label>
<label>
  <input type="checkbox" name="interests" value="dev" /> Development
</label>
```

**Submission data**

```json
{
  "interests": "dev"
}
```

**Special handling**

- Multiple values with the same name collapse to the last value when using `multipart/form-data`.
- To send arrays, submit as JSON instead:

```json
{
  "interests": ["design", "dev"]
}
```

## file

**HTML**

```html
<input type="file" name="file" />
```

**Submission data**

```json
{
  "file": "https://storage.example.com/..."
}
```

**Special handling**

- Use `multipart/form-data` for file uploads.
- If you want the stored key to be `file` or `image`, name the input accordingly.

## hidden

**HTML**

```html
<input type="hidden" name="source" value="pricing-page" />
```

**Submission data**

```json
{
  "source": "pricing-page"
}
```

**Special handling**

- Great for UTM tags and form context metadata.

## Next steps

- [File uploads](/file-uploads/basic-file-upload)
- [Data format reference](/managing-submissions/data-format-reference)
