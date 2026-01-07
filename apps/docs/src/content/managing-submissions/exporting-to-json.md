---
order: 2
shortTitle: 'Exporting to JSON'
title: 'Exporting to JSON'
description: 'Download submissions as JSON for full fidelity.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Exporting to JSON

JSON exports preserve nested data structures and are ideal for integrations and analytics.

## Where to find the export button

Open your form and click **Export** in the top-right of the submissions table.


## Example 1: JSON structure

Exports are a JSON array. Each item is the submitted data object.

```json
[
  {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "message": "Hello from Formbase"
  },
  {
    "name": "Grace Hopper",
    "email": "grace@example.com",
    "message": "Hi there"
  }
]
```

## Example 2: Nested and array data

JSON exports preserve arrays and objects.

```json
[
  {
    "name": "Ada",
    "tags": ["beta", "priority"],
    "meta": { "source": "pricing" }
  }
]
```

## Tips

- Use JSON when you need timestamps or nested data.
- For spreadsheet workflows, CSV exports are easier to open.
