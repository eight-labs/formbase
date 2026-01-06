---
order: 1
shortTitle: 'Exporting to CSV'
title: 'Exporting to CSV'
description: 'Download submissions as CSV with clear column mapping.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Exporting to CSV

CSV exports are perfect for spreadsheets and lightweight reporting.

## Where to find the export button

Open your form and click **Export** in the top-right of the submissions table.


## CSV column structure

- **Columns** are ordered by the form's key list.
- **Column names** match your field names.
- **Rows** represent each submission.

### Example 1: Basic CSV header and row

```csv
name,email,message
```

```csv
Ada,ada@example.com,Hello from Formbase
```

### Example 2: Nested or array data

If a field contains an array or object, it is stringified by the export process. For richer structures, prefer JSON export.

```csv
name,tags
Ada,["beta","priority"]
```

## Date formatting

`createdAt` is not included in the CSV export by default. Use JSON export if you need timestamps.

## Tips

- Use simple field names to keep headers clean.
- For analytics workflows, JSON exports are more predictable.
