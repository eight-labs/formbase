---
order: 0
shortTitle: 'Requirements'
title: 'Self-Hosting Requirements'
description: 'Prerequisites for running Formbase with Docker Compose.'
lastModifiedAt: 2026-01-03
publishedAt: 2026-01-03
---

# Self-Hosting Requirements

Formbase can be self-hosted using Docker Compose. These are the prerequisites you will need.

## Required

- Docker Engine 24+
- Docker Compose v2
- Node.js 20+ (for local builds and scripts)

## Recommended

- A reverse proxy (Nginx or Caddy) for TLS termination
- An S3-compatible storage provider (MinIO, R2, S3)

## Next steps

- [Docker Compose setup](/self-hosting/docker-compose-setup)
- [Environment variables](/self-hosting/environment-variables)
