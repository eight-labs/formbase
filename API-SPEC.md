# Public REST API Implementation Plan

## Overview

Implement a public tRPC API exposed as REST via OpenAPI using `trpc-to-openapi`. The API enables programmatic management of forms and submissions with Bearer token authentication.

## Key Decisions (from interview)

| Aspect                | Decision                                                                     |
| --------------------- | ---------------------------------------------------------------------------- |
| API Key Scope         | User-level (one key = all user's forms)                                      |
| Multiple Keys         | Yes, with optional expiration dates and labels                               |
| Form Creation         | Allowed via API                                                              |
| Submissions Filtering | Date range only (inclusive both ends)                                        |
| Delete Behavior       | Hard delete                                                                  |
| Response Data Format  | Parsed JSON objects (not raw strings)                                        |
| Rate Limiting         | 100 req/min, 429 + Retry-After header                                        |
| Bulk Operations       | Full support (create, update, delete)                                        |
| Duplicate Scope       | Config only (no submissions)                                                 |
| Audit Logs            | Full logging, 90-day retention, preserved on form delete                     |
| Pagination            | Offset-based (?page=N&perPage=N)                                             |
| Bulk HTTP Methods     | Method matches action (DELETE for delete, POST for create, PATCH for update) |
| OpenAPI Spec          | Public at `/api/v1/openapi.json`                                             |
| Webhooks              | Not in initial version                                                       |
| Form Keys             | Read-only exposure                                                           |
| Form Settings         | Subset only (title, description, returnUrl)                                  |
| Error Format          | Standard HTTP: `{ error: { code, message } }`                                |
| Versioning            | URL path (`/api/v1/...`)                                                     |
| Settings UI           | Add to existing settings page                                                |
| Default Email         | Auto-set to API key owner's email                                            |
| Bulk Limit            | No limit                                                                     |
| Caching               | No caching headers                                                           |
| List Response         | Include submission count per form                                            |

---

## Database Schema Changes

### New Table: `api_keys`

```typescript
// packages/db/schema/api-keys.ts
export const apiKeys = sqliteTable(
  'api_keys',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // User-provided label
    keyHash: text('key_hash').notNull().unique(), // SHA-256 hash of the key
    keyPrefix: text('key_prefix').notNull(), // First 8 chars for display (api_xxx...)
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }), // Optional expiration
    lastUsedAt: integer('last_used_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(strftime('%s', 'now') * 1000)`),
  },
  (table) => ({
    userIdx: index('api_key_user_idx').on(table.userId),
    keyHashIdx: index('api_key_hash_idx').on(table.keyHash),
  }),
);
```

### New Table: `api_audit_logs`

```typescript
// packages/db/schema/api-audit-logs.ts
export const apiAuditLogs = sqliteTable(
  'api_audit_logs',
  {
    id: text('id').primaryKey(),
    apiKeyId: text('api_key_id')
      .notNull()
      .references(() => apiKeys.id, { onDelete: 'set null' }),
    userId: text('user_id').notNull(), // Denormalized for preservation
    method: text('method').notNull(), // GET, POST, DELETE, etc.
    path: text('path').notNull(), // /api/v1/forms/xxx
    statusCode: integer('status_code').notNull(), // 200, 404, 429, etc.
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    requestBody: text('request_body'), // JSON string (sanitized)
    responseTimeMs: integer('response_time_ms'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(strftime('%s', 'now') * 1000)`),
  },
  (table) => ({
    apiKeyIdx: index('audit_api_key_idx').on(table.apiKeyId),
    userIdx: index('audit_user_idx').on(table.userId),
    createdAtIdx: index('audit_created_at_idx').on(table.createdAt),
  }),
);
```

---

## API Endpoints

### Authentication

All endpoints require `Authorization: Bearer api_xxxxxxxxxxxxx` header.

### Forms

| Method | Path                               | Description                                             |
| ------ | ---------------------------------- | ------------------------------------------------------- |
| GET    | `/api/v1/forms`                    | List user's forms with pagination and submission counts |
| POST   | `/api/v1/forms`                    | Create a new form                                       |
| GET    | `/api/v1/forms/{formId}`           | Get a single form                                       |
| PATCH  | `/api/v1/forms/{formId}`           | Update a form (title, description, returnUrl)           |
| DELETE | `/api/v1/forms/{formId}`           | Delete a form and all submissions                       |
| POST   | `/api/v1/forms/{formId}/duplicate` | Duplicate a form (config only)                          |

### Bulk Forms

| Method | Path                 | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/v1/forms/bulk` | Create multiple forms |
| PATCH  | `/api/v1/forms/bulk` | Update multiple forms |
| DELETE | `/api/v1/forms/bulk` | Delete multiple forms |

### Submissions

| Method | Path                                                | Description                                      |
| ------ | --------------------------------------------------- | ------------------------------------------------ |
| GET    | `/api/v1/forms/{formId}/submissions`                | List submissions with pagination and date filter |
| GET    | `/api/v1/forms/{formId}/submissions/{submissionId}` | Get a single submission                          |
| DELETE | `/api/v1/forms/{formId}/submissions/{submissionId}` | Delete a submission                              |

### Bulk Submissions

| Method | Path                                      | Description                 |
| ------ | ----------------------------------------- | --------------------------- |
| DELETE | `/api/v1/forms/{formId}/submissions/bulk` | Delete multiple submissions |

### OpenAPI

| Method | Path                   | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| GET    | `/api/v1/openapi.json` | OpenAPI 3.0 specification (public) |

---

## Request/Response Schemas

### List Forms Response

```json
{
  "forms": [
    {
      "id": "abc123",
      "title": "Contact Form",
      "description": "Website contact form",
      "returnUrl": "https://example.com/thanks",
      "keys": ["name", "email", "message"],
      "submissionCount": 42,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Create Form Request

```json
{
  "title": "New Form",
  "description": "Optional description",
  "returnUrl": "https://example.com/thanks"
}
```

### List Submissions Request

```
GET /api/v1/forms/{formId}/submissions?page=1&perPage=50&startDate=2024-01-01&endDate=2024-01-31
```

### List Submissions Response

```json
{
  "submissions": [
    {
      "id": "sub123",
      "formId": "form456",
      "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Hello!"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 50,
    "total": 120,
    "totalPages": 3
  }
}
```

### Bulk Delete Request

```json
{
  "ids": ["id1", "id2", "id3"]
}
```

### Error Response

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Form not found"
  }
}
```

---

## Implementation Structure

### New Files

```
packages/
├── api/
│   ├── routers/
│   │   ├── api-v1/
│   │   │   ├── index.ts           # v1 router combining all sub-routers
│   │   │   ├── forms.ts           # Form CRUD + bulk operations
│   │   │   ├── submissions.ts     # Submission operations
│   │   │   └── meta.ts            # OpenAPI metadata definitions
│   │   └── api-keys.ts            # API key management (for settings UI)
│   ├── middleware/
│   │   ├── api-auth.ts            # Bearer token validation
│   │   └── rate-limit.ts          # Rate limiting logic
│   └── lib/
│       ├── api-key.ts             # Key generation, hashing utilities
│       └── audit-log.ts           # Audit logging helper
├── db/
│   └── schema/
│       ├── api-keys.ts            # API keys table
│       └── api-audit-logs.ts      # Audit logs table

apps/web/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── v1/
│   │           ├── [...trpc]/
│   │           │   └── route.ts   # tRPC-OpenAPI handler
│   │           └── openapi.json/
│   │               └── route.ts   # OpenAPI spec endpoint
│   └── components/
│       └── settings/
│           └── api-keys-section.tsx  # UI for managing API keys
```

### Key Implementation Details

#### 1. API Key Authentication (`packages/api/middleware/api-auth.ts`)

```typescript
export async function validateApiKey(
  authorization: string | null,
  db: Database,
) {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice(7);
  const keyHash = hashApiKey(token);

  const apiKey = await db.query.apiKeys.findFirst({
    where: (table) =>
      and(
        eq(table.keyHash, keyHash),
        or(isNull(table.expiresAt), gt(table.expiresAt, new Date())),
      ),
    with: { user: true },
  });

  if (apiKey) {
    // Update lastUsedAt asynchronously
    db.update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, apiKey.id));
  }

  return apiKey;
}
```

#### 2. Rate Limiting (`packages/api/middleware/rate-limit.ts`)

- Use in-memory sliding window counter (or Upstash Redis if available)
- Key: IP address or API key ID
- Limit: 100 requests per minute
- Returns `Retry-After` header with seconds until reset

#### 3. OpenAPI Metadata Pattern

```typescript
// packages/api/routers/api-v1/meta.ts
export const listFormsMeta: OpenApiMeta = {
  openapi: {
    method: 'GET',
    path: '/api/v1/forms',
    tags: ['Forms'],
    summary: 'List all forms',
    description:
      'Returns a paginated list of forms owned by the authenticated user.',
  },
};
```

#### 4. tRPC-OpenAPI Handler

```typescript
// apps/web/src/app/api/v1/[...trpc]/route.ts

import { createOpenApiNextHandler } from 'trpc-to-openapi';

const handler = createOpenApiNextHandler({
  router: apiV1Router,
  createContext: createApiContext,
  responseMeta: () => ({
    headers: {
      'X-RateLimit-Remaining': '...',
      'X-RateLimit-Reset': '...',
    },
  }),
  onError: ({ error, path }) => {
    logAuditError(error, path);
  },
});
```

#### 5. Audit Log Cleanup Job

- Run daily via cron or scheduled function
- Delete logs older than 90 days:

```sql
DELETE FROM api_audit_logs WHERE created_at < (now - 90 days)
```

---

## Settings UI

### API Keys Section (add to existing settings page)

Features:

- List existing API keys (name, prefix, created date, last used, expiration)
- Create new key (name input, optional expiration date picker)
- Show full key ONCE on creation (modal with copy button)
- Delete key with confirmation
- View usage stats (total requests, last 24h requests from audit logs)

---

## Verification Plan

1. **Unit Tests**
   - API key generation and hashing
   - Rate limit logic
   - Date range filtering

2. **Integration Tests**
   - Create/list/update/delete forms via REST
   - Bulk operations
   - Pagination
   - Rate limit enforcement
   - Invalid/expired key rejection

3. **Manual Testing**
   - Generate OpenAPI spec and validate with Swagger UI
   - Test with curl commands
   - Test with Postman/Insomnia
   - Verify rate limiting with rapid requests
   - Test audit log entries

4. **UI Testing**
   - Create API key and verify display
   - Copy key functionality
   - Delete key functionality
   - View usage stats

---

## Dependencies to Add

```json
{
  "dependencies": {
    "trpc-to-openapi": "^2.0.0",
    "@upstash/ratelimit": "^2.0.0" // Optional, can use in-memory
  }
}
```

---

## Migration Steps

1. Create and run database migrations for new tables
2. Implement API key utilities (generate, hash, validate)
3. Implement rate limiting middleware
4. Create v1 tRPC router with OpenAPI metadata
5. Set up REST handler at `/api/v1/[...trpc]`
6. Add OpenAPI spec endpoint
7. Implement audit logging
8. Build settings UI for API key management
9. Add audit log cleanup job
10. Write tests
11. Update documentation
