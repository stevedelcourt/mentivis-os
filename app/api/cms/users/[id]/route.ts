import { NextResponse } from "next/server";
import { requireRole } from "@/lib/cms/auth";
import { getAllUsers, updateUser, deleteUser, hashPassword } from "@/lib/cms/users";
import { UserRole } from "@/lib/cms/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireRole(request, ["god"]);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, role, active, password } = body;

    const updates: Partial<{ name: string; role: UserRole; active: boolean; passwordHash: string }> = {};
    if (typeof name === "string") updates.name = name;
    if (["god", "editorial", "tarifs"].includes(role)) updates.role = role;
    if (typeof active === "boolean") updates.active = active;
    if (typeof password === "string" && password.length > 0) {
      updates.passwordHash = await hashPassword(password);
    }

    const user = updateUser(userId, updates);
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireRole(request, ["god"]);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const user = getAllUsers().find((u) => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Prevent deleting the last god user
  if (user.role === "god") {
    const gods = getAllUsers().filter((u) => u.role === "god" && u.active);
    if (gods.length <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last god user" },
        { status: 403 }
      );
    }
  }

  const success = deleteUser(userId);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
