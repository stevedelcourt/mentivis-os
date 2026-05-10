import crypto from "crypto";
import fs from "fs";
import path from "path";
import { User, UserRole } from "./types";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readUsers(): User[] {
  ensureDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  ensureDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function getAllUsers(): User[] {
  return readUsers();
}

export function getUserByEmail(email: string): User | undefined {
  return readUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.active
  );
}

export function getUserById(id: number): User | undefined {
  return readUsers().find((u) => u.id === id);
}

export function createUser(
  user: Omit<User, "id" | "createdAt">
): User {
  const users = readUsers();
  const newUser: User = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeUsers(users);
  return newUser;
}

export function updateUser(
  id: number,
  updates: Partial<Omit<User, "id" | "createdAt">>
): User | null {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  writeUsers(users);
  return users[idx];
}

export function deleteUser(id: number): boolean {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users.splice(idx, 1);
  writeUsers(users);
  return true;
}

export function seedDefaultUsers(sharedPassword: string) {
  const users = readUsers();
  if (users.length === 0) {
    createUser({
      email: "steven.delcourt@mentivis.com",
      name: "Steven Delcourt",
      passwordHash: hashPassword(sharedPassword),
      role: "god",
      active: true,
    });
  }
}
