/**
 * SupportHub API — Entry Point
 *
 * Initializes the Express application with:
 * - CORS middleware for cross-origin requests
 * - JSON and URL-encoded body parsing
 * - Health check endpoints (/ and /api/health)
 * - All feature module routes via centralized routes.ts (/api/*)
 *
 * Environment variables:
 * - PORT: Server port (default: 5000)
 */

import express, { Express, Request, Response } from "express";
import cors from "cors";
import "dotenv/config"; // Load .env variables into process.env
import routes from "./routes.js";

const app: Express = express();
const PORT = process.env.PORT || 5000;

// --- Global Middleware ---
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Health Check Routes ---
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "SupportHub API is running" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- All Feature Module Routes (centralized in routes.ts) ---
app.use("/api", routes);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
