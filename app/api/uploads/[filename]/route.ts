import fs from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Security: prevent directory traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(UPLOADS_DIR, safeFilename);

  // Ensure the resolved path is within uploads dir
  if (!filePath.startsWith(UPLOADS_DIR)) {
    return new Response("Not found", { status: 404 });
  }

  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(safeFilename).slice(1).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  const buffer = fs.readFileSync(filePath);

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
