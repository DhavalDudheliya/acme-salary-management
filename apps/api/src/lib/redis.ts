/**
 * Redis Connection Singleton
 *
 * Creates and exports a single ioredis instance for use by BullMQ
 * and any other Redis-dependent features.
 * Reads REDIS_URL from environment.
 */

import Redis from "ioredis";
import logger from "./logger.js";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("Missing REDIS_URL environment variable");
}

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (err) => {
  logger.error({ err }, "Redis connection error");
});

export default redis;
