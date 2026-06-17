# Salary Management — Architecture

> Companion to `REQUIREMENTS.md`. This document explains *how* the system is built and *why* the key decisions were made.

## 1. System overview

A classic three-tier web app: a **React SPA**, a **stateless Express API**, and a **PostgreSQL** database accessed through **Prisma**. All heavy lifting (pagination, filtering, aggregation, currency normalization) happens **server-side** so the browser never loads 10k rows.

```
┌──────────────────────┐        HTTP / JSON         ┌──────────────────────────┐
│   React SPA (Vite)    │  ───────────────────────▶  │   Express API (TypeScript) │
│                       │  ◀───────────────────────  │                            │
│  • Directory (paged)  │                            │  Routes → Controllers      │
│  • Employee detail    │                            │    → Services (logic)      │
│  • Org dashboard      │                            │    → Prisma (data access)  │
│  • FX rate editor     │                            │                            │
│  TanStack Query cache │                            │  Zod validation @ boundary │
└──────────────────────┘                            └─────────────┬─────────────┘
                                                                   │ SQL (Prisma)
                                                                   ▼
                                                     ┌──────────────────────────┐
                                                     │      PostgreSQL           │
                                                     │  employees · salary_      │
                                                     │  records · fx_rates       │
                                                     │  (indexed for filter/sort)│
                                                     └──────────────────────────┘
                                                     (runs via docker-compose)
```

## 2. Component responsibilities

**Frontend — React + Vite SPA**
- UI built with **shadcn/ui** on **Base UI** primitives + **Tailwind CSS** — components are copied into the repo and owned directly, giving full control over the look and behavior of the directory, detail, and dashboard surfaces.
- **TanStack Query** for server state: caching, background refetch, and request dedup. This is what makes the directory *feel* fast — paging back to a visited page is instant from cache.
- **TanStack Table** (headless) drives the employee directory grid, paired with server-side pagination/sort/filter.
- **Recharts** renders the dashboard (distribution, country/department breakdowns).
- Forms via **React Hook Form + Zod**, sharing validation schemas with the backend.
- URL-driven state for the directory (page, filters, search) so views are shareable and back/forward works.

**Backend — Express + TypeScript**
- Layered: **route → controller → service → Prisma**. Business logic lives in services (testable in isolation, no HTTP); controllers only translate HTTP ↔ service calls.
- **Zod** validates every request body/query at the boundary; invalid input is rejected before it reaches a service.
- Stateless — no in-process session.

**Data access — Prisma**
- Single source of truth for schema (`schema.prisma`) and migrations. Types flow from DB → app automatically.
- Aggregations that don't map cleanly to the Prisma query builder use `$queryRaw` (parameterized) — e.g. median, distribution buckets.

**Database — PostgreSQL**
- Indices on the columns the directory filters/sorts by (country, department, status, name) to hold the < 150 ms bar.

## 3. Data model

```
employees                         salary_records (append-only)        fx_rates
──────────                        ───────────────────────────        ────────
id            (pk)                id              (pk)                currency  (pk)  e.g. "USD"
first_name                        employee_id     (fk → employees)   rate_to_base   numeric
last_name                        amount          numeric            updated_at
email         (unique)            currency        text
country                          effective_date  date
department                       reason          text
job_title                       created_at      timestamp
currency      (local pay ccy)
status        (active|inactive)  ── immutable: a salary change INSERTs
hire_date                           a new row; rows are never updated
current_salary_id (fk)              or deleted ──
created_at / updated_at
```

**Why this shape:**
- **Append-only `salary_records`** gives a true salary history for free and makes "how did this person's pay evolve?" a simple query. A salary *change* is an INSERT, never an UPDATE — history is immutable by construction.
- `employees.current_salary_id` denormalizes the latest record so the directory and dashboard don't compute "latest salary per employee" on every read. It's maintained in the same transaction as the salary-change insert.
- **Soft delete** via `status = inactive` (plus a hire/term concept) — we never hard-delete, preserving history and payroll totals' integrity.
- **`fx_rates`** is a small HR-editable table. `rate_to_base` converts each local currency to the single reporting currency. Aggregates normalize at query time using the *current* rate (see requirements: historical FX is deliberately out of scope).

## 4. Key request flows

**Directory list** — `GET /api/employees?page&pageSize&q&country&department&status&sort`
→ service builds a Prisma `where`/`orderBy` from validated params → one paged query + one `count` → returns `{ rows, total, page }`. Filtering and counting are **in the DB**, never in Node.

**Salary change** — `POST /api/employees/:id/salary`
→ in a **single transaction**: INSERT new `salary_records` row, then UPDATE `employees.current_salary_id`. Atomic, so the "current" pointer is never out of sync with history.

**Dashboard** — `GET /api/dashboard`
→ a handful of aggregate queries (headcount, payroll sum, median, distribution buckets, group-by country/department), each normalizing local→base via a join to `fx_rates`. Computed in Postgres, returned as a compact JSON summary.

## 5. Key trade-offs

| Decision | Chosen | Alternative | Why |
|---|---|---|---|
| **Database** | PostgreSQL | SQLite | Postgres is the production-credible choice for a 10k-employee, multi-country system and showcases real aggregation/indexing. Cost: setup friction — **neutralized with `docker-compose` + one-command setup**, so onboarding stays < 5 min. |
| **App shape** | React SPA + separate Express API | Next.js full-stack | A clean client/server split makes the architecture explicit and the API independently testable — better for demonstrating engineering judgment than colocated server actions. |
| **Pagination** | Server-side (offset/limit + count) | Client-side load-all | 10k rows must never hit the browser. Offset pagination is simple and fast enough at this scale. |
| **Salary history** | Append-only table | Mutable salary column + audit log | Immutability is simpler *and* gives real history. A salary change is an INSERT. |
| **"Latest salary"** | Denormalized `current_salary_id` | Compute MAX(effective_date) per read | Keeps directory/dashboard reads cheap at 10k rows; correctness guarded by writing both in one transaction. |
| **Currency** | Current-rate normalization | Historical per-date FX | Matches how HR reads "what we pay today"; avoids storing/looking up rate-as-of-date. Out of scope by design. |
| **Validation** | Zod at the API boundary | Trust + DB constraints only | Fail fast with clear errors; keep services working on already-valid data. |

## 6. Performance approach

- **Indexes** on directory filter/sort columns; `EXPLAIN`-checked against the 10k seed.
- **Aggregate in the DB**, return summaries — the dashboard payload is a few KB regardless of headcount.
- **Denormalized current salary** avoids per-row "latest" computation on hot paths.
- **TanStack Query** caching on the client removes redundant round-trips for revisited pages/filters.
- Targets: directory/filter **< 150 ms**, dashboard **< 300 ms** server-side on 10k rows (from `REQUIREMENTS.md`).

## 7. Testing strategy

- **Service-layer unit tests** (the bulk): business logic — salary-change atomicity, FX normalization math, filter/sort query building, pagination edges — tested without HTTP.
- **API integration tests**: key endpoints against a real Postgres (test schema), asserting status codes, shapes, and validation rejections.
- **Deterministic & fast**: no wall-clock or network dependence; effective dates and "now" are injected, not read from the system clock.
- Frontend: focused tests on the highest-value interactive pieces (directory filtering, salary-change form) rather than blanket coverage.

## 8. Repository layout (planned)

```
salary-management/
├── docker-compose.yml        # PostgreSQL for local dev
├── server/                   # Express + TypeScript API
│   ├── prisma/               # schema.prisma, migrations, seed.ts
│   └── src/
│       ├── routes/  controllers/  services/  lib/
│       └── index.ts
├── client/                   # React + Vite SPA
│   └── src/  (pages/ components/ api/ hooks/)
├── REQUIREMENTS.md
└── ARCHITECTURE.md
```

## 9. Deployment & onboarding

The database differs by environment but the code does not — both are PostgreSQL, selected by a single `DATABASE_URL` env var, giving full local-vs-prod parity.

| Environment | Database | Why |
|---|---|---|
| **Local dev + tests** | Docker Compose Postgres | One command (`docker-compose up -d`), offline, disposable, and reseedable per test run — keeps tests fast and deterministic. No shared mutable state. |
| **Deployed demo** | Hosted Postgres (e.g. Neon / Supabase / Railway) | Needed to ship the live app anyway; managed, persistent, no infra to run. |

- **Local:** `docker-compose up -d` (Postgres) → `prisma migrate` → `seed` → run API + client. Single documented sequence in the README, target < 5 minutes.
- **Hosting:** stateless Express API on a container host (e.g. Render/Railway/Fly) pointed at the hosted Postgres; client as a static build (e.g. Vercel/Netlify) pointed at the API URL.
- **Why not hosted-DB-for-everything:** sharing one hosted DB means credentials in the repo and graders clobbering each other's seed runs; making each grader provision their own is *more* friction than Docker. Local Docker keeps onboarding to one offline command and tests network-free.

## 10. Key dependencies

Deliberately small and conventional — every choice is a mainstream default for this stack, so a reviewer recognizes it on sight.

**Frontend**
| Package | Role |
|---|---|
| `react`, `vite` | SPA + build/dev server |
| `tailwindcss` + **shadcn/ui** on **Base UI** (`@base-ui-components/react`) | styling and owned UI components |
| `@tanstack/react-query` | server-state cache, dedup, background refetch |
| `@tanstack/react-table` | headless data grid for the directory |
| `recharts` | dashboard charts |
| `react-router-dom` | client routing |
| `react-hook-form` + `zod` | forms and validation (schemas shared with API) |
| `axios` | HTTP client with interceptors |

**Backend**
| Package | Role |
|---|---|
| `express` + TypeScript | HTTP API |
| `@prisma/client`, `prisma` | ORM, schema, migrations, seed |
| `zod` | request validation at the boundary |
| `pino` | structured logging |
| `fast-csv` | streamed CSV export |
| `helmet`, `cors`, `compression` | standard Express hardening |

**Tooling & tests**
| Package | Role |
|---|---|
| `vitest` | single test runner for client + server |
| `supertest` | HTTP integration tests against Express |
| `@testing-library/react` | user-centric component tests |
| `eslint`, `prettier` | lint + format |
