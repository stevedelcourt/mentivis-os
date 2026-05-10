import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "./types";
import { getDb } from "./sqlite";

const BCRYPT_SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<{ valid: boolean; migratedHash?: string }> {
  if (passwordHash.startsWith("$2")) {
    const valid = await bcrypt.compare(password, passwordHash);
    return { valid };
  }
  const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
  if (legacyHash === passwordHash) {
    const migratedHash = await hashPassword(password);
    return { valid: true, migratedHash };
  }
  return { valid: false };
}

function rowToUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    role: row.role,
    active: !!row.active,
    createdAt: row.created_at,
  };
}

export function getAllUsers(): User[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  return rows.map(rowToUser);
}

export function getUserByEmail(email: string): User | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE AND active = 1").get(email);
  return row ? rowToUser(row) : undefined;
}

export function getUserById(id: number): User | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return row ? rowToUser(row) : undefined;
}

export function createUser(
  user: Omit<User, "id" | "createdAt">
): User {
  const db = getDb();
  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO users (email, name, password_hash, role, active, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(user.email, user.name, user.passwordHash, user.role, user.active ? 1 : 0, now);
  return { ...user, id: Number(result.lastInsertRowid), createdAt: now };
}

export function updateUser(
  id: number,
  updates: Partial<Omit<User, "id" | "createdAt">>
): User | null {
  const db = getDb();
  const existing = getUserById(id);
  if (!existing) return null;

  const setParts: string[] = [];
  const values: any[] = [];

  if (updates.email !== undefined) { setParts.push("email = ?"); values.push(updates.email); }
  if (updates.name !== undefined) { setParts.push("name = ?"); values.push(updates.name); }
  if (updates.passwordHash !== undefined) { setParts.push("password_hash = ?"); values.push(updates.passwordHash); }
  if (updates.role !== undefined) { setParts.push("role = ?"); values.push(updates.role); }
  if (updates.active !== undefined) { setParts.push("active = ?"); values.push(updates.active ? 1 : 0); }

  if (setParts.length === 0) return existing;

  values.push(id);
  db.prepare(`UPDATE users SET ${setParts.join(", ")} WHERE id = ?`).run(...values);
  return getUserById(id)!;
}

export function deleteUser(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM users WHERE id = ?").run(id);
  return result.changes > 0;
}

export async function seedDefaultUsers(sharedPassword: string) {
  const db = getDb();
  const count = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (count.count === 0) {
    const passwordHash = await hashPassword(sharedPassword);
    createUser({
      email: "steven.delcourt@mentivis.com",
      name: "Steven Delcourt",
      passwordHash,
      role: "god",
      active: true,
    });
  }
}
