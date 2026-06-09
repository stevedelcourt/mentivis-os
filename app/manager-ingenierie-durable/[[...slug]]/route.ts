import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const POSSIBLE_BASES = [
  path.join(process.cwd(), "public", "manager-ingenierie-durable"),
  path.join(process.cwd(), "..", "public", "manager-ingenierie-durable"),
  "/home/sc4bovu7233/nextapp/public/manager-ingenierie-durable",
];

let BASE = POSSIBLE_BASES[0];
for (const dir of POSSIBLE_BASES) {
  if (fs.existsSync(path.join(dir, "index.html"))) {
    BASE = dir;
    break;
  }
}

const MIME: Record<string, string> = {
  html: "text/html; charset=utf-8",
  svg: "image/svg+xml",
  webp: "image/webp",
  png: "image/png",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const filename = slug && slug.length > 0 ? slug[slug.length - 1] : "index.html";
  const filePath = path.join(BASE, filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(filename).slice(1).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
