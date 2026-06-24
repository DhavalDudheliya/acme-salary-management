# Deployment (Render)

The app deploys as three pieces: a managed **PostgreSQL** database, the
**Express API** (Node web service), and the **React SPA** (static site). All
three are described in [`render.yaml`](render.yaml) as a Render Blueprint.

## One-time setup

1. **Create the Blueprint.** In the Render dashboard: **New → Blueprint**, connect
   this repository, and apply. Render provisions the database and both services
   from `render.yaml`. The API gets `DATABASE_URL` wired automatically, and on
   boot it runs `prisma migrate deploy` (creates the schema) and `npm run seed`
   (loads the 10,000-employee dataset). **No shell is needed** — the seed is
   idempotent and skips itself once the data exists, so redeploys don't wipe it.

2. **Point the SPA at the *real* API URL.** This is the step that bites people.
   The SPA bakes `VITE_API_BASE_URL` in **at build time**, and `render.yaml`
   intentionally has **no default** for it:
   - Open the **`acme-salary-api`** service in the dashboard and copy its actual
     public URL from the top of the page. It is usually **not** the bare
     `https://acme-salary-api.onrender.com` — that subdomain is global and often
     already taken, so Render assigns yours a suffix
     (e.g. `https://acme-salary-api-x7k2.onrender.com`).
   - Verify it's yours: `https://<that-host>/api/health` must return
     `{"status":"ok"}`. (A `401 {"error":"unauthorized"}` means you're hitting
     someone else's service — you have the wrong host.)
   - Set `VITE_API_BASE_URL` to `https://<that-host>/api` on the
     **`acme-salary-web`** service, then **redeploy** it (env changes only take
     effect on a fresh build).

> To reseed from scratch later, set `SEED_FORCE=1` on the API service and
> redeploy; remove it afterward so normal restarts don't reload.

## Verify

- API health: `https://<api-host>/api/health` → `{"status":"ok"}`.
- Directory data: `https://<api-host>/api/employees?pageSize=1` → one row with a
  `currentSalary`.
- Open the SPA URL and confirm the directory lists employees and the dashboard
  renders.

## Notes

- **Free tier** services sleep when idle; the first request after a sleep takes a
  few seconds to wake. Fine for a demo; not a production SLA.
- **CORS** is open on the API (no auth, no cookies — single trusted HR Manager),
  so the static SPA on a different origin can call it directly.
- **Migrations** run at start via `prisma migrate deploy` (no dev tooling needed
  at runtime); the schema is created on first boot.
