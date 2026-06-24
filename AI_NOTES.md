# AI usage notes

This project was built with an agentic AI coding tool (Claude Code). This note
records **how** AI was used, where it was delegated, and — importantly — what was
verified by hand rather than trusted blindly.

## Approach

- **A standards file drives the agent.** [`CLAUDE.md`](CLAUDE.md) encodes the
  engineering rules (layering, append-only salary history, aggregate-in-DB,
  URL-driven directory state, test priorities, commit discipline). It is the
  single most leveraged artifact: the agent reads it before writing code, so the
  conventions are enforced consistently instead of re-explained per prompt.
- **Plan before code.** Scope lives in [`REQUIREMENTS.md`](REQUIREMENTS.md),
  design in [`ARCHITECTURE.md`](ARCHITECTURE.md), and build order in
  [`PLAN.md`](PLAN.md) / [`PROGRESS.md`](PROGRESS.md). Each feature was built
  against that plan and committed incrementally so the history is reviewable.
- **Small, conventional commits.** Each commit is one meaningful step
  (`feat:`/`fix:`/`test:`/`docs:`/`chore:`), which keeps the diff — and the AI's
  reasoning — easy to follow.

## What AI was delegated

- Scaffolding the layered Express API and the module-wise React client.
- The deterministic 10k seed (mulberry32 RNG, FK-safe bulk load).
- DB-side aggregation: median via `percentile_cont`, distribution via
  `width_bucket`, FX normalization joins — written as parameterized `$queryRaw`.
- TanStack Query/Table wiring, URL-driven directory + dashboard state, and the
  React Hook Form + Zod forms (schemas shared in spirit with the API's Zod).
- The test suites (Vitest + Supertest backend, RTL frontend).

## What was verified by hand (not trusted blindly)

AI accelerates, but correctness was checked against the running system:

- **Salary-change deadlock — found by a test, not assumed.** Writing a concurrency
  test for the salary-change transaction surfaced a real Postgres *deadlock*: each
  `INSERT` takes a `FOR KEY SHARE` lock on the employee row (FK), then the pointer
  `UPDATE` needs an exclusive lock, so concurrent same-employee changes couldn't
  upgrade. Fix: lock the employee row `FOR UPDATE` up front. The test now asserts
  the serialized outcome (commit `d9f33de` / `8bb68d5`).
- **Prisma 7 + pg error shape.** A duplicate-email returned 500 instead of 409
  because the pg driver adapter no longer populates `meta.target`; the field moved
  to `meta.driverAdapterError.cause.constraint.fields`. Confirmed against the live
  driver and handled both shapes.
- **FX normalization math** was checked against the seeded data (e.g. ~$822M USD
  total reconciles to the EUR view at the seeded rate).
- **Performance bar** was measured on the 10k seed (directory < 150 ms, dashboard
  < 300 ms), not assumed from the query shape.
- **CSV export row count** looked off-by-one via `wc -l` (no trailing newline);
  re-counted with `awk` to confirm 10,000 rows — i.e. the tool's first reading was
  questioned before being accepted.

## Guardrails kept in place

- Tests are fast and deterministic — no wall-clock or network in unit tests;
  "now"/effective dates are injected.
- No secrets in code; configuration is via environment variables.
- Scope discipline: features outside `REQUIREMENTS.md` were not added; exclusions
  (no auth, no payroll execution, single base salary) are deliberate and documented.
