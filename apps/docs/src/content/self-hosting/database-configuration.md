---
order: 3
shortTitle: 'Database Configuration'
title: 'Database Configuration'
description: 'Use SQLite locally or Turso in production.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Database Configuration

Formbase uses a libSQL-compatible database. You can run SQLite locally or use Turso in production.

## Example 1: Local SQLite (file)

```env
DATABASE_URL=file:/data/formbase.db
```

## Example 2: Turso (libsql)

```env
DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

## Tips

- Back up your SQLite file regularly.
- Use Turso for multi-region reliability.
