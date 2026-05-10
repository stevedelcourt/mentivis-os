import crypto from "crypto";

const SECRET = process.env.CMS_AUTH_SECRET || process.env.INTERNAL_TOKEN || "mentivis-cms-fallback-secret";

export function createToken(email: string): string {
  const payload = { email, exp: Date.now() + 24 * 60 * 60 * 1000 };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string): { email: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  if (!data || !sig) return null;
  const expectedSig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export function isAuthorizedEmail(email: string): boolean {
  return email.endsWith("@mentivis.com") || email.endsWith("@mentivisOS.com");
}

export function getAuthEmail(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const verified = verifyToken(token);
  return verified?.email || null;
}

export function requireAuth(request: Request): { email: string } | Response {
  const email = getAuthEmail(request);
  if (!email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return { email };
}
