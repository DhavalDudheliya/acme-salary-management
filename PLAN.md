# Development Plan

How the Salary Management app is built — the data model, API contracts, frontend structure, and the order of work. Scope and stack are fixed by `REQUIREMENTS.md`, `ARCHITECTURE.md`, and `CLAUDE.md`.

---

## 1. Data model

Three tables. Salary history is append-only; the employee row keeps a pointer to its current salary so hot reads stay cheap.

**`employees`**
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | |
| `first_name`, `last_name` | text | |
| `email` | text, unique | |
| `country` | text | indexed (directory filter) |
| `department` | text | indexed (directory filter) |
| `job_title` | text | |
| `currency` | text | local pay currency (ISO 4217) |
| `status` | enum `active`/`inactive` | indexed; soft-delete = `inactive` |
| `hire_date` | date | |
| `current_salary_id` | uuid (fk → salary_records) | denormalized latest; maintained in txn |
| `created_at`, `updated_at` | timestamptz | |

- Composite/index plan: `(status, country)`, `(status, department)`, and a search index on name/email to hold the < 150 ms directory bar.

**`salary_records`** — append-only, never updated/deleted
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | |
| `employee_id` | uuid (fk → employees) | indexed |
| `amount` | numeric(14,2) | annualized |
| `currency` | text | snapshot of pay currency at the time |
| `effective_date` | date | |
| `reason` | text | e.g. hire, raise, adjustment |
| `created_at` | timestamptz | |

**`fx_rates`** — small, HR-editable
| Column | Type | Notes |
|---|---|---|
| `currency` | text (pk) | ISO 4217 |
| `rate_to_base` | numeric | multiply local → base reporting currency |
| `updated_at` | timestamptz | |

- **Base reporting currency** is a fixed constant (e.g. USD) with `rate_to_base = 1`.
- Aggregates normalize local → base using the **current** rate (historical FX out of scope).

## 2. API design

REST, JSON, Zod-validated at the boundary. Base path `/api`.

| Method | Path | Purpose | Key params / body |
|---|---|---|---|
| GET | `/employees` | Directory (paged) | `page, pageSize, q, country, department, status, sort` → `{ rows, total, page, pageSize }` |
| GET | `/employees/:id` | Detail + salary history | → employee + ordered `salaryHistory[]` |
| POST | `/employees` | Create | employee fields + initial salary |
| PATCH | `/employees/:id` | Edit profile | partial employee fields (not salary) |
| DELETE | `/employees/:id` | Soft-delete | sets `status = inactive` |
| POST | `/employees/:id/salary` | Salary change | `{ amount, effectiveDate, reason }` → txn: insert record + update pointer |
| GET | `/fx-rates` | List rates | → `{ base, rates[] }` |
| PUT | `/fx-rates` | Update rates | `{ rates: [{ currency, rateToBase }] }` |
| GET | `/dashboard` | Org analytics | `?currency=` → headcount, payroll, median, avg, distribution buckets, byCountry, byDepartment, recentChanges |
| GET | `/employees/export` | CSV of filtered view | same filters as directory; streams CSV |

**Conventions:** layered `route → controller → service → Prisma`; services are pure and unit-tested; one error middleware maps typed errors → status codes; FX normalization is a single shared, tested helper used by `/dashboard` and `/export`.

## 3. Seeding strategy

- Deterministic generator (seeded RNG — reproducible, test-safe).
- **10,000 employees** spread across a realistic set of countries/departments/currencies; salary ranges scaled per country.
- Each employee gets 1–4 `salary_records` with ascending effective dates; `current_salary_id` points at the latest.
- FX rate rows for every currency used.
- Insert via batched `createMany` (not per-row) so the whole seed runs in seconds.

## 4. Frontend structure

SPA, React Router. Server data through TanStack Query; directory state lives in the URL.

| Route | Page | Key pieces |
|---|---|---|
| `/` → `/employees` | **Directory** | TanStack Table, debounced search, country/department/status filters, server pagination, CSV export button |
| `/employees/:id` | **Detail** | profile panel + salary-history timeline; edit + "change salary" actions |
| `/employees/new` (dialog) | **Create** | RHF + Zod form (shared schema) |
| `/dashboard` | **Dashboard** | Recharts: KPI cards, salary distribution, by-country/department breakdowns, recent changes, reporting-currency selector |
| `/settings/fx` | **FX rates** | editable rate table |

- Shared Zod schemas between form validation and the API.
- shadcn/ui components (on Base UI) owned in `components/ui`; charts via Recharts; data fetching in `hooks/`.

## 5. Testing approach

- **Service unit tests (priority):** salary-change atomicity + history immutability, FX normalization math, pagination/filter/sort building, median/bucket logic — verified on small known fixtures, no clock/network.
- **API integration (Supertest):** each endpoint's status codes, response shapes, and validation rejections against a real test Postgres.
- **Frontend (RTL):** the two highest-value interactions — directory filtering and the salary-change form.
- All tests fast and deterministic; effective dates and "now" are injected, never read from the system clock.

## 6. Performance approach

- Server-side pagination/filter/aggregation only — never ship 10k rows to the browser.
- Indexes on directory filter/sort columns; `EXPLAIN`-verified against the 10k seed.
- Dashboard aggregates computed in Postgres, returned as a compact summary.
- `current_salary_id` avoids per-row "latest salary" computation on hot paths.
- TanStack Query caching removes redundant round-trips for revisited views.
- Targets: directory/filter **< 150 ms**, dashboard **< 300 ms** on 10k rows.

## 7. Build order

Runnable and demoable as early as possible, then deepened; tests land with the code they cover.

1. **Scaffold** — pnpm workspace, `docker-compose` (Postgres), Express skeleton (health, logging, error middleware), Vite + Tailwind + shadcn client shell, TanStack Query + Router wiring.
2. **Data layer** — Prisma schema + migration, then the 10k seed script.
3. **Backend API** — directory → detail → CRUD → salary-change → FX → dashboard → CSV, each with its tests.
4. **Frontend** — directory → detail → create/edit + salary-change forms → dashboard → FX editor / export, then frontend interaction tests.
5. **Polish & deliver** — verify/tune query performance on 10k, write the README quickstart, deploy (hosted Postgres + API + static client), record the demo and add AI-usage notes.

## 8. Risks / watch-items

- **Seed performance** at 10k — batch with `createMany`, not per-row inserts.
- **Dashboard median/buckets** — needs raw parameterized SQL; verify on a small fixture before trusting the 10k numbers.
- **FX normalization** — choose the base currency up front; keep the math in one tested helper used by every aggregate.
- **shadcn-on-Base-UI** is newer than the Radix default — confirm the init flow before building many components on it.
