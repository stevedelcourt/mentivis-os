import { describe, it, expect, beforeAll } from "vitest";
import crypto from "crypto";
import { createToken, verifyToken, isAuthorizedEmail } from "./auth";

beforeAll(() => {
  process.env.CMS_AUTH_SECRET = "test-secret-for-unit-tests";
});

const SECRET = process.env.CMS_AUTH_SECRET || process.env.INTERNAL_TOKEN || "mentivis-cms-fallback-secret";

describe("createToken + verifyToken", () => {
  it("creates a verifiable token", () => {
    const token = createToken("test@mentivis.com", "god");
    const verified = verifyToken(token);
    expect(verified).toEqual({ email: "test@mentivis.com", role: "god" });
  });

  it("rejects a tampered token", () => {
    const token = createToken("test@mentivis.com", "god");
    const tampered = token.slice(0, -4) + "abcd";
    expect(verifyToken(tampered)).toBeNull();
  });

  it("rejects an expired token", () => {
    const payload = { email: "test@mentivis.com", role: "god", exp: Date.now() - 1000 };
    const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
    const expiredToken = `${data}.${sig}`;
    expect(verifyToken(expiredToken)).toBeNull();
  });

  it("rejects malformed tokens", () => {
    expect(verifyToken("not-a-token")).toBeNull();
    expect(verifyToken("")).toBeNull();
  });
});

describe("isAuthorizedEmail", () => {
  it("accepts mentivis.com emails", () => {
    expect(isAuthorizedEmail("user@mentivis.com")).toBe(true);
  });

  it("accepts mentivisOS.com emails", () => {
    expect(isAuthorizedEmail("user@mentivisOS.com")).toBe(true);
  });

  it("rejects other domains", () => {
    expect(isAuthorizedEmail("user@gmail.com")).toBe(false);
    expect(isAuthorizedEmail("user@mentivis.fr")).toBe(false);
  });
});
