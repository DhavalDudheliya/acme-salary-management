# ACME Salary Management

Web-based salary management for ACME's HR manager.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- Docker

## Run Locally

Start PostgreSQL:

```sh
docker-compose up -d
```

Run the API:

```sh
cd server
npm install
npm run dev
```

Run the client in a second terminal:

```sh
cd client
npm install
npm run dev
```

The API health check is available at `http://localhost:4000/api/health`.
