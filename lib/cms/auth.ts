import crypto from "crypto";
import { UserRole } from "./types";
import { getUserByEmail } from "./users";

const SECRET = process.env.CMS_AUTH_SECRET || process.env.INTERNAL_TOKEN || "mentivis-cms-fallback-secret";

export function createToken(email: string, role: UserRole): string {
  const payload = { email, role, exp: Date.now() + 24 * 60 * 60 * 1000 };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string): { email: string; role: UserRole } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  if (!data || !sig) return null;
  const expectedSig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return { email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export function isAuthorizedEmail(email: string): boolean {
  return email.endsWith("@mentivis.com") || email.endsWith("@mentivisOS.com");
}

export async function getAuthUser(request: Request): Promise<{ email: string; role: UserRole } | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const verified = verifyToken(token);
  if (!verified) return null;
  // Verify user still exists and is active
  const user = await getUserByEmail(verified.email);
  if (!user || user.role !== verified.role) return null;
  return { email: verified.email, role: verified.role };
}

export async function requireAuth(request: Request): Promise<{ email: string; role: UserRole } | Response> {
  const user = await getAuthUser(request);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

export async function requireRole(
  request: Request,
  allowedRoles: UserRole[]
): Promise<{ email: string; role: UserRole } | Response> {
  const user = await getAuthUser(request);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!allowedRoles.includes(user.role)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}
