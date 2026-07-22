import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const CVS_DIR = path.join(DATA_DIR, "cvs");

export async function PUT(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get("filename");
    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    const contentType = request.headers.get("content-type") || "";
    if (contentType !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await request.arrayBuffer());
    const MAX_SIZE = 6 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 6MB" }, { status: 400 });
    }

    if (!fs.existsSync(CVS_DIR)) {
      fs.mkdirSync(CVS_DIR, { recursive: true });
    }

    fs.writeFileSync(path.join(CVS_DIR, filename), buffer);

    return NextResponse.json({ success: true, cvUrl: `/api/cvs/${filename}` });
  } catch (err) {
    console.error("[UploadCV] Error:", err);
    return NextResponse.json({ error: "Upload failed", message: String(err) }, { status: 500 });
  }
}
