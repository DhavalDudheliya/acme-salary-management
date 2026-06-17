# Salary Management — Requirements

## Goal

Give ACME's HR Manager a single web application to **manage salary data for ~10,000 employees across multiple countries** and to **answer questions about how the org pays people** — replacing the current spreadsheet-based workflow.

The product is a **system of record + analysis surface**. It is deliberately *not* a payroll-execution system.

## User persona

A single **HR Manager**. Non-technical, time-pressed, needs to find an employee, change a salary, and read top-line compensation facts without thinking about how the software works. Usability for this one persona outranks feature breadth.

## In scope

| Capability | What it does |
|---|---|
| **Employee directory** | Server-paginated, searchable, filterable list (by country, department, status). Built to stay fast at 10k rows — no client-side load-everything. |
| **Employee detail** | Full profile + **append-only salary history** timeline. |
| **CRUD** | Create / edit / **soft-delete** (deactivate, never hard-delete) employees. |
| **Salary change** | First-class action that appends a new record to salary history with effective date and reason. History is immutable. |
| **Org dashboard** | Headcount, total payroll, median & average salary, salary distribution, breakdowns by country and department, and recent salary changes. The "how do we pay people?" surface. |
| **Currency normalization** | Salaries stored in local currency; an **editable FX rate table** (HR-maintained) normalizes everything to one reporting currency for aggregates. |
| **CSV export** | Export the current filtered directory view. |
| **Seed** | Script generating **10,000 employees** with realistic multi-country spread and salary history. Treated as a product deliverable. |

## Out of scope (deliberate) — and why

- **Payroll execution / payslips / disbursement** — this is a record + analysis tool, not a system that moves money. Different risk, compliance, and integration surface entirely.
- **Country-specific tax / statutory compliance** — enormous per-jurisdiction surface with no payoff for the core "manage + understand salaries" goal.
- **Bonuses, equity, benefits, variable comp** — each employee has a single base salary figure and nothing else. No variable pay of any kind.
- **Authentication & access control (login, SSO, RBAC, approval workflows)** — there is exactly one persona (the HR Manager) and the app runs as that single trusted user, so there is **no auth**. Authn/authz is real work with no payoff for demonstrating the core salary-management capability.
- **Live FX feeds** — rates are point-in-time, HR-edited values. A live feed is an integration + reliability burden; HR controls the numbers they report on instead.
- **Natural-language "ask anything" / LLM analytics** — the dashboard answers the concrete questions the persona actually has; an open-ended query box is impressive-looking scope with high correctness risk.
- **Historical FX** — aggregates use the *current* rate, not the rate on each change's effective date. Simpler and matches how an HR Manager reads "what do we pay today."
- **Multi-tenant / multiple legal entities** — one fictional org. "Multi-country" means employees paid in local currency, not separate legal entities.
- **Full-field audit log** — only salary changes carry history (the field that matters for "how we pay"); we don't keep a change history for every field.

## Key assumptions

- One HR Manager user; the app runs as that single trusted user, so there is **no authentication**.
- All employees are **full-time salaried**; salary stored **annualized**.
- FX rates are **point-in-time HR-edited** values; aggregates use the **current** rate.
- "Multi-country" = employees in different countries paid in **local currency**, single legal entity.

## Non-functional bar

- **Directory list / filter:** < 150 ms server response on 10k rows.
- **Dashboard:** < 300 ms on 10k rows.
- **Server-side** pagination, filtering, and aggregation — never ship 10k rows to the browser.
- **Salary history is append-only** (immutable records).
- **Tests** are fast and deterministic — no clock or network dependence in unit tests.
- **Onboarding:** a new developer is running the app (incl. seeded DB) in **under ~5 minutes** from the README. PostgreSQL ships via `docker-compose` so DB setup is one command.

## Stack

React (Vite) · Express + TypeScript · Prisma · PostgreSQL. Rationale and trade-offs in `ARCHITECTURE.md`.
