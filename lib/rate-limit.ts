import fs from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const RATE_LIMIT_FILE = path.join(DATA_DIR, "rate-limit.json");

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

function readLimits(): Record<string, RateLimitEntry> {
  try {
    if (!fs.existsSync(RATE_LIMIT_FILE)) return {};
    const data = fs.readFileSync(RATE_LIMIT_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function writeLimits(limits: Record<string, RateLimitEntry>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(RATE_LIMIT_FILE, JSON.stringify(limits));
  } catch {
    // Silently fail — rate limiting is best-effort on shared hosting
  }
}

/**
 * Check if a key (e.g. IP address) has exceeded the rate limit.
 * Uses a JSON file for persistence across server restarts.
 * Best-effort: file I/O errors are silently ignored.
 */
export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const limits = readLimits();
  const entry = limits[key];

  if (!entry || now > entry.resetAt) {
    limits[key] = { count: 1, resetAt: now + windowMs };
    writeLimits(limits);
    return true;
  }

  entry.count++;
  writeLimits(limits);
  return entry.count <= maxRequests;
}

/**
 * Clean up expired entries periodically.
 * Call this occasionally (e.g. on every 10th request) to prevent file bloat.
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  const limits = readLimits();
  let changed = false;
  for (const key of Object.keys(limits)) {
    if (limits[key].resetAt < now) {
      delete limits[key];
      changed = true;
    }
  }
  if (changed) writeLimits(limits);
}
