/**
 * Simple in-memory rate limiter using sliding window algorithm.
 * Works on serverless environments (per-instance), suitable for Vercel.
 *
 * For high-traffic production use, replace with @upstash/ratelimit + Redis.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leak on long-running instances
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

export interface RateLimitOptions {
  /** Number of requests allowed per window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests in current window */
  remaining: number;
  /** Epoch ms when the window resets */
  resetAt: number;
  /** How many seconds until reset */
  retryAfter: number;
}

/**
 * Check and increment rate limit for a given key (e.g. IP address).
 *
 * @param key      - Unique identifier, typically the client IP.
 * @param options  - `limit` (max requests) and `windowSeconds` (window size).
 */
export function rateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowSeconds } = options;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let entry = store.get(key);

  // New or expired window → reset
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count += 1;

  const remaining = Math.max(0, limit - entry.count);
  const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

  return {
    success: entry.count <= limit,
    remaining,
    resetAt: entry.resetAt,
    retryAfter,
  };
}
