# CLAUDE.md

Engineering standards for the **Salary Management** app. Read this before writing code. These rules override default behavior.

## Project context

A web app for ACME's **HR Manager** to manage salary data for ~10,000 employees across countries and answer "how do we pay people?". It is a **system of record + analysis surface** — **not** a payroll-execution system.

- Source of truth for scope: **`REQUIREMENTS.md`**. Architecture & trade-offs: **`ARCHITECTURE.md`**.
- This is an assessment deliverable. Optimize for **clear judgment, clean code, meaningful tests, and readable git history** — not feature breadth.

## Stack (do not substitute without updating the docs)

- **Frontend:** React + Vite · TypeScript · **shadcn/ui on Base UI** (`@base-ui-components/react`) + Tailwind · TanStack Query · TanStack Table · Recharts · React Router · React Hook Form + Zod · Axios
- **Backend:** Express + TypeScript · Prisma · Zod · Pino · fast-csv · helmet/cors/compression
- **DB:** PostgreSQL (Docker Compose locally, hosted in deploy; selected by `DATABASE_URL`)
- **Tests/tooling:** Vitest · Supertest · React Testing Library · ESLint + Prettier

## Repo layout

```
server/   Express API   (src/{routes,controllers,services,lib}, prisma/{schema.prisma,seed.ts})
client/   React SPA      (src/{pages,components,api,hooks})
docker-compose.yml        PostgreSQL for local dev
```

## Backend conventions

- **Layering:** `route → controller → service → Prisma`. Business logic lives in **services** (pure, HTTP-agnostic, unit-testable). Controllers only translate HTTP ↔ service calls. Never put Prisma queries in controllers or business logic in routes.
- **Validation:** every request body/query is validated with **Zod at the boundary** (controller). Services assume already-valid input. Share Zod schemas with the client where practical.
- **Errors:** throw typed errors in services; a single error-handling middleware maps them to HTTP status + JSON. No raw `res.status(500)` scattered around.
- **Salary history is append-only.** A salary change is an **INSERT** into `salary_records` plus an UPDATE of `employees.current_salary_id`, both in **one transaction**. Never UPDATE or DELETE an existing salary record.
- **Soft delete only.** Deactivate via `status = inactive`; never hard-delete employees.
- **Aggregate in the database**, not in Node. Return compact summaries. Use parameterized `$queryRaw` for what the query builder can't express (median, buckets).
- **No secrets in code.** Config via env vars (`DATABASE_URL`, etc.).

## Frontend conventions

- **Server state via TanStack Query** only — no manual fetch-into-useState for server data. Query keys encode page/filter/search.
- **Directory state lives in the URL** (page, filters, search) so views are shareable and back/forward works. Never load all 10k rows client-side.
- shadcn components are **owned in-repo** under `components/ui` — edit them directly rather than wrapping.
- Forms use **React Hook Form + Zod**; reuse the API's Zod schemas.
- Keep components small and presentational; data fetching in hooks (`hooks/`) or page-level.

## Testing standards

- **Fast and deterministic.** No dependence on wall-clock (`Date.now()`/`new Date()`) or network in unit tests — inject "now" and effective dates.
- **Services are the priority** for unit tests: salary-change atomicity, FX normalization math, pagination/filter edges.
- **API integration tests** (Supertest) for key endpoints: status codes, response shapes, validation rejections.
- Frontend: test the high-value interactions (directory filtering, salary-change form), not blanket coverage.
- Assert on **specific values**, not just truthiness. Mock at boundaries, not internal logic.

## Performance bar (from `REQUIREMENTS.md`)

- Directory list/filter **< 150 ms**, dashboard **< 300 ms** on 10k rows, server-side.
- Index the columns the directory filters/sorts by. Verify with the 10k seed.

## Scope discipline

- **Don't add anything not in `REQUIREMENTS.md`'s in-scope list.** If scope needs to change, **update `REQUIREMENTS.md` first** (and say why in the commit), don't quietly expand.
- **No version/roadmap/future-support framing** anywhere (no "V1", "future", "could be extended later", "if it grows"). This is a single deliverable. State what is, not what might be.
- Single base salary per employee — **no bonuses/equity/variable comp**. **No auth** (single trusted HR Manager).

## Git discipline

- **Small, incremental, meaningful commits** — the history is graded. Never one big drop.
- **Conventional commit** subjects: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`.
- Commit only when asked; end commit messages with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

## Commands (filled in as scaffolding lands)

- DB up: `docker-compose up -d`
- Migrate + seed: `pnpm --filter server prisma migrate dev && pnpm --filter server seed`
- Dev: `pnpm dev` (client + server)
- Test: `pnpm test`
