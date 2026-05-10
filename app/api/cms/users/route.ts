import { NextResponse } from "next/server";
import { requireRole } from "@/lib/cms/auth";
import { getAllUsers, createUser, hashPassword } from "@/lib/cms/users";
import { UserRole } from "@/lib/cms/types";

export async function GET(request: Request) {
  const auth = requireRole(request, ["god"]);
  if (auth instanceof Response) return auth;

  const users = getAllUsers().map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    active: u.active,
    createdAt: u.createdAt,
  }));

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const auth = requireRole(request, ["god"]);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { email, name, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    if (!["god", "editorial", "tarifs"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const users = getAllUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = createUser({
      email,
      name: name || email.split("@")[0],
      passwordHash,
      role: role as UserRole,
      active: true,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
