import fs from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const CVS_DIR = path.join(DATA_DIR, "cvs");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Security: prevent directory traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(CVS_DIR, safeFilename);

  // Ensure the resolved path is within cvs dir
  if (!filePath.startsWith(CVS_DIR)) {
    return new Response("Not found", { status: 404 });
  }

  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
