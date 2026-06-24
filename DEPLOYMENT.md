# Deployment (Render)

The app deploys as three pieces: a managed **PostgreSQL** database, the
**Express API** (Node web service), and the **React SPA** (static site). All
three are described in [`render.yaml`](render.yaml) as a Render Blueprint.

## One-time setup

1. **Create the Blueprint.** In the Render dashboard: **New → Blueprint**, connect
   this repository, and apply. Render provisions the database and both services
   from `render.yaml`. The API gets `DATABASE_URL` wired from the database
   automatically and runs `prisma migrate deploy` on boot.

2. **Point the SPA at the API.** The API's public URL is
   `https://acme-salary-api.onrender.com` (Render derives it from the service
   name; confirm the exact host on the API service page). The SPA bakes
   `VITE_API_BASE_URL` in **at build time**, so:
   - If the API host matches the default in `render.yaml`, you're done.
   - Otherwise set `VITE_API_BASE_URL` to `https://<your-api-host>/api` on the
     `acme-salary-web` service and **redeploy** it.

3. **Seed the database once.** Open the **Shell** on the `acme-salary-api`
   service and run:
   ```sh
   npm run seed
   ```
   This loads the deterministic 10,000-employee dataset. It is **not** part of the
   build, so ordinary redeploys don't wipe the data. (The seed `TRUNCATE`s and
   reloads, so re-running it resets to the same baseline.)

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
