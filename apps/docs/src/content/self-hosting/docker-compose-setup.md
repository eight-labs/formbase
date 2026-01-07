---
order: 1
shortTitle: 'Docker Compose Setup'
title: 'Docker Compose Setup'
description: 'Run Formbase with Docker Compose and local services.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Docker Compose Setup

This is a complete `docker-compose.yml` for a self-hosted setup with Formbase, MinIO, and a local SMTP server (Inbucket). Replace values with your own.

```yaml
version: '3.8'

name: formbase
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: formbase-app
    ports:
      - '3000:3000'
    env_file:
      - .env
    environment:
      DATABASE_URL: file:/data/formbase.db
      NEXT_PUBLIC_APP_URL: http://localhost:3000
      SMTP_TRANSPORT: smtp
      SMTP_HOST: inbucket
      SMTP_PORT: 2500
      STORAGE_ENDPOINT: minio
      STORAGE_PORT: 9002
      STORAGE_USESSL: 'false'
      STORAGE_ACCESS_KEY: formbase
      STORAGE_SECRET_KEY: password
      STORAGE_BUCKET: formbase
      ALLOW_SIGNIN_SIGNUP: 'true'
    volumes:
      - formbase-db:/data
    depends_on:
      - minio
      - inbucket

  minio:
    image: minio/minio
    container_name: formbase-minio
    ports:
      - '9002:9002'
      - '9001:9001'
    volumes:
      - minio:/data
    environment:
      MINIO_ROOT_USER: formbase
      MINIO_ROOT_PASSWORD: password
    entrypoint: sh
    command: -c 'mkdir -p /data/formbase && minio server /data --console-address ":9001" --address ":9002"'

  inbucket:
    image: inbucket/inbucket
    container_name: formbase-mailserver
    ports:
      - '9000:9000'
      - '2500:2500'
      - '1100:1100'
    volumes:
      - formbase-mail:/data

volumes:
  formbase-db:
  minio:
  formbase-mail:
```

## Dockerfile (required)

Create a `Dockerfile` at the repo root:

```dockerfile
FROM node:20-bullseye

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* bun.lock* ./
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/web
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

## First-time setup

1. Create `.env` using the [Environment Variables](/self-hosting/environment-variables) guide.
2. Run `docker compose up -d`.
3. Visit `http://localhost:3000` and create your account.
