import { NextResponse } from "next/server";
import { createToken, isAuthorizedEmail } from "@/lib/cms/auth";
import { getUserByEmail, hashPassword, seedDefaultUsers } from "@/lib/cms/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (!isAuthorizedEmail(email)) {
      return NextResponse.json(
        { error: "Unauthorized email domain. Use @mentivis.com or @mentivisOS.com" },
        { status: 403 }
      );
    }

    const sharedPassword = process.env.CMS_AUTH_SECRET || process.env.INTERNAL_TOKEN;

    // Seed default god user if no users exist yet
    if (sharedPassword) {
      seedDefaultUsers(sharedPassword);
    }

    // Try per-user authentication first
    const user = getUserByEmail(email);
    if (user) {
      if (hashPassword(password) !== user.passwordHash) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 }
        );
      }
      const token = createToken(user.email, user.role);
      return NextResponse.json({ success: true, token, email: user.email, role: user.role });
    }

    // Fallback: shared password for users not yet in the database
    if (!sharedPassword || password !== sharedPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Fallback login: treat as god (backward compatibility)
    const token = createToken(email, "god");
    return NextResponse.json({ success: true, token, email, role: "god" });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
