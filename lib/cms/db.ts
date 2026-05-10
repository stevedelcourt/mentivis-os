import fs from "fs";
import path from "path";
import { Post } from "./types";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readPosts(): Post[] {
  ensureDir();
  if (!fs.existsSync(POSTS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(POSTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writePosts(posts: Post[]) {
  ensureDir();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

let postsCache: Post[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

function getPosts(): Post[] {
  const now = Date.now();
  if (!postsCache || now - cacheTime > CACHE_TTL) {
    postsCache = readPosts();
    cacheTime = now;
  }
  return postsCache;
}

export function getAllPosts(): Post[] {
  return getPosts();
}

export function getPublishedPosts(): Post[] {
  return getPosts().filter((p) => p.published);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getPostById(id: number): Post | undefined {
  return getPosts().find((p) => p.id === id);
}

export function createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Post {
  const posts = readPosts();
  const newPost: Post = {
    ...post,
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.push(newPost);
  writePosts(posts);
  postsCache = null;
  return newPost;
}

export function updatePost(id: number, updates: Partial<Omit<Post, "id" | "createdAt">>): Post | null {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  posts[idx] = {
    ...posts[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writePosts(posts);
  postsCache = null;
  return posts[idx];
}

export function deletePost(id: number): boolean {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  posts.splice(idx, 1);
  writePosts(posts);
  postsCache = null;
  return true;
}

export { generateSlug } from "./utils";
