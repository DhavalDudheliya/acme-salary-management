# ACME Salary Management

Web-based salary management for ACME's HR manager: a system of record and
analysis surface for ~10,000 employees across countries. Manage employees and
their append-only salary history, and answer "how do we pay people?" from an org
dashboard. See [`REQUIREMENTS.md`](REQUIREMENTS.md) for scope and
[`ARCHITECTURE.md`](ARCHITECTURE.md) for the design and trade-offs.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- Docker (for local PostgreSQL)

## Run locally

**1. Start PostgreSQL:**

```sh
docker-compose up -d
```

**2. Start the API** (first terminal):

```sh
cd server
npm install
cp .env.example .env        # DATABASE_URL points at the Docker Postgres
npm run db:migrate          # apply the schema
npm run seed                # load 10,000 employees + salary history + FX rates
npm run dev                 # http://localhost:5000
```

**3. Start the client** (second terminal):

```sh
cd client
npm install
npm run dev                 # http://localhost:5173
```

Open **http://localhost:5173**. The API health check is at
`http://localhost:5000/api/health`.

> The `seed` step is required — without it the directory and dashboard are empty.
> The seed is deterministic (fixed RNG), so everyone gets the same 10k dataset.

## Tests, lint, and build

```sh
# Server (Vitest + Supertest; integration tests need the seeded DB running)
cd server && npm test && npm run lint && npm run build

# Client (Vitest + React Testing Library)
cd client && npm test && npm run lint && npm run build
```

## Project layout

```
server/   Express + Prisma API   (src/{modules,routes,controllers,services,lib}, prisma/{schema,seed})
client/   React + Vite SPA        (src/{modules,pages,components,routes,api,hooks})
docker-compose.yml                PostgreSQL for local dev
```

## Notes

- **No authentication** — single trusted HR Manager, by design (see `REQUIREMENTS.md`).
- **Salary history is append-only**; a change inserts a new record and repoints
  `current_salary_id` in one transaction. Employees are soft-deleted (`status = inactive`).
- AI-assisted development notes are in [`AI_NOTES.md`](AI_NOTES.md).
