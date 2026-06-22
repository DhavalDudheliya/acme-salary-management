# SupportHub — Architecture Review

> A reverse‑engineered, code‑accurate architecture deep‑dive of the SupportHub multi‑tenant
> customer‑support / helpdesk SaaS platform. Every claim in these documents is traced to the
> actual implementation in `apps/api` and `apps/web`.

## What is SupportHub?

SupportHub is a **multi‑tenant, white‑label customer support platform** (a Zendesk/Intercom‑class
helpdesk). Each company that registers gets an isolated **workspace** addressed by a subdomain
(`acme.supporthub.bond`). The platform:

- Turns inbound **Gmail and Outlook** emails into support **tickets** automatically (push‑based, via
  Google Pub/Sub and Microsoft Graph webhooks).
- Uses **Google Gemini** to auto‑classify each ticket (tags, sentiment, priority) and a rule engine
  to **auto‑assign** tickets to agents.
- Pushes **real‑time updates** to agent dashboards over **Socket.IO**.
- Supports **white‑label theming** per workspace (colors, fonts, logo → oklch CSS variables).
- Provides **reporting/analytics**, **search**, **team invitations**, and **RBAC** (ADMIN/AGENT).

## Tech Stack (from `package.json` files)

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces + Turborepo |
| Backend | Node ≥20, Express 5, TypeScript (ESM) |
| ORM / DB | Prisma 7 (`@prisma/adapter-pg`) → PostgreSQL |
| Cache / Queue broker | Redis 7 (ioredis) |
| Background jobs | BullMQ 5 (2 queues + 2 workers) |
| Scheduler | node-cron |
| Real‑time | Socket.IO 4 |
| AI | Google Gemini (`@google/genai`, `gemini-2.0-flash`) |
| Email ingest | googleapis (Gmail), `@microsoft/microsoft-graph-client` + `@azure/msal-node` (Outlook) |
| Object storage | AWS S3 + CloudFront (`@aws-sdk/client-s3`) |
| Outbound email | nodemailer (SMTP) |
| Auth | jsonwebtoken (dual‑token), bcrypt, AES‑256‑GCM for OAuth tokens |
| Validation | Zod 4 |
| Logging | pino / pino-http |
| Frontend | Next.js 16 (App Router, Turbopack), React 19, TanStack Query, Axios, Tailwind 4, shadcn/ui, GSAP, three.js |

## Document Index

| # | Document | Covers |
|---|----------|--------|
| 1 | [system-architecture.md](./system-architecture.md) | High‑level + component architecture, API request lifecycle, error handling, external integrations |
| 2 | [database-architecture.md](./database-architecture.md) | All entities, ER diagram, relationships, multi‑tenancy data model, scaling concerns |
| 3 | [authentication-architecture.md](./authentication-architecture.md) | Registration, login, dual‑token JWT, refresh rotation, email verification, password reset |
| 4 | [authorization-architecture.md](./authorization-architecture.md) | RBAC (ADMIN/AGENT), enforcement points, permission matrix |
| 5 | [multi-tenant-architecture.md](./multi-tenant-architecture.md) | Tenant isolation strategy, subdomain routing, tenant resolution, data‑leak prevention |
| 6 | [email-ticket-architecture.md](./email-ticket-architecture.md) | Gmail/Outlook ingestion, webhooks, dedup, threading, AI classification, assignment engine |
| 7 | [websocket-architecture.md](./websocket-architecture.md) | Socket.IO rooms, auth handshake, event flow, presence, scaling limits |
| 8 | [background-jobs-architecture.md](./background-jobs-architecture.md) | BullMQ queues, workers, retries, cron renewal, failure handling |
| 9 | [deployment-architecture.md](./deployment-architecture.md) | Inferred topology, environments, processes, env vars |
| 10 | [scalability-analysis.md](./scalability-analysis.md) | Bottlenecks per subsystem, 10k/100k/1M user analysis, failure analysis |
| 11 | [interview-prep.md](./interview-prep.md) | 2‑minute pitches, top follow‑up Q&A, weaknesses, improvements per subsystem |

## Repository Map

```
supportHub/
├── apps/
│   ├── api/                      # Express backend (the focus of this review)
│   │   ├── prisma/schema.prisma  # 11 models + 8 enums
│   │   └── src/
│   │       ├── index.ts          # App bootstrap: HTTP + Socket.IO + workers + cron
│   │       ├── routes.ts         # /api/v1/* route registry
│   │       ├── lib/              # prisma, redis, queue, socket, logger singletons
│   │       ├── middlewares/      # auth, admin, request-id, not-found
│   │       ├── errors/           # AppError + global error handler
│   │       ├── modules/          # auth, invitation, customer, ticket, email,
│   │       │                     #   workspace, rules, reports, search
│   │       ├── services/         # gemini, assignment-engine, s3, email (SMTP)
│   │       ├── workers/          # email.worker, ai-classification.worker
│   │       ├── cron/             # renewal.cron (Gmail watch / Outlook subscription)
│   │       └── utils/            # jwt, encryption, token, password, subdomain
│   └── web/                      # Next.js 16 frontend (App Router)
├── packages/                     # ui (shadcn), eslint-config, typescript-config
└── docker-compose.yml            # Redis only (local dev)
```
</content>
