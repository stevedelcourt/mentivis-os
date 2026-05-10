import bcrypt from "bcryptjs";
import crypto from "crypto";
import path from "path";
import { User } from "./types";
import { readJsonFile, writeJsonFile } from "./db";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const USERS_FILE = path.join(DATA_DIR, "users.json");

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt.
 * Replaces the old SHA-256 approach for proper password security.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Verify a password against a hash.
 * Supports both legacy SHA-256 hashes (auto-migrates to bcrypt on match)
 * and modern bcrypt hashes.
 */
export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<{ valid: boolean; migratedHash?: string }> {
  // Modern bcrypt hash
  if (passwordHash.startsWith("$2")) {
    const valid = await bcrypt.compare(password, passwordHash);
    return { valid };
  }

  // Legacy SHA-256 hash — check and offer migration
  const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
  if (legacyHash === passwordHash) {
    const migratedHash = await hashPassword(password);
    return { valid: true, migratedHash };
  }

  return { valid: false };
}

export function getAllUsers(): User[] {
  return readJsonFile<User[]>(USERS_FILE, []);
}

export function getUserByEmail(email: string): User | undefined {
  return getAllUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.active
  );
}

export function getUserById(id: number): User | undefined {
  return getAllUsers().find((u) => u.id === id);
}

export function createUser(
  user: Omit<User, "id" | "createdAt">
): User {
  const users = getAllUsers();
  const newUser: User = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeJsonFile(USERS_FILE, users);
  return newUser;
}

export function updateUser(
  id: number,
  updates: Partial<Omit<User, "id" | "createdAt">>
): User | null {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  writeJsonFile(USERS_FILE, users);
  return users[idx];
}

export function deleteUser(id: number): boolean {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users.splice(idx, 1);
  writeJsonFile(USERS_FILE, users);
  return true;
}

/**
 * Seed default god user if no users exist.
 * Uses bcrypt for the password hash.
 */
export async function seedDefaultUsers(sharedPassword: string) {
  const users = getAllUsers();
  if (users.length === 0) {
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
