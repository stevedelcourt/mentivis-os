import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { checkRateLimit, cleanupRateLimits } from "./rate-limit";

describe("checkRateLimit", () => {
  let tmpDir: string;
  let originalDataDir: string | undefined;

  beforeEach(() => {
    originalDataDir = process.env.DATA_DIR;
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "rate-limit-"));
    process.env.DATA_DIR = tmpDir;
  });

  afterEach(() => {
    process.env.DATA_DIR = originalDataDir;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("allows requests under the limit", () => {
    const key = "ip-1";
    expect(checkRateLimit(key, 3, 60000)).toBe(true);
    expect(checkRateLimit(key, 3, 60000)).toBe(true);
    expect(checkRateLimit(key, 3, 60000)).toBe(true);
  });

  it("blocks requests over the limit", () => {
    const key = "ip-2";
    checkRateLimit(key, 2, 60000);
    checkRateLimit(key, 2, 60000);
    expect(checkRateLimit(key, 2, 60000)).toBe(false);
  });

  it("resets after the window expires", () => {
    const key = "ip-3";
    checkRateLimit(key, 1, 1);
    // Manually expire the window
    const limitsPath = path.join(tmpDir, "rate-limit.json");
    const limits = JSON.parse(fs.readFileSync(limitsPath, "utf-8"));
    limits[key].resetAt = Date.now() - 1;
    fs.writeFileSync(limitsPath, JSON.stringify(limits));

    expect(checkRateLimit(key, 1, 60000)).toBe(true);
  });

  it("cleanup removes expired entries", () => {
    const limitsPath = path.join(tmpDir, "rate-limit.json");
    fs.writeFileSync(
      limitsPath,
      JSON.stringify({
        old: { count: 5, resetAt: Date.now() - 1000 },
        fresh: { count: 1, resetAt: Date.now() + 60000 },
      })
    );
    cleanupRateLimits();
    const remaining = JSON.parse(fs.readFileSync(limitsPath, "utf-8"));
    expect(remaining).toHaveProperty("fresh");
    expect(remaining).not.toHaveProperty("old");
  });
});
