import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const CVS_DIR = path.join(DATA_DIR, "cvs");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv") as File | null;
    const filename = formData.get("filename") as string;

    if (!file || !filename) {
      return NextResponse.json({ error: "Missing file or filename" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const MAX_SIZE = 6 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 6MB" }, { status: 400 });
    }

    if (!fs.existsSync(CVS_DIR)) {
      fs.mkdirSync(CVS_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(CVS_DIR, filename), buffer);

    const cvUrl = `/api/cvs/${filename}`;

    return NextResponse.json({ success: true, cvUrl });
  } catch (err) {
    console.error("[UploadCV] Error:", err);
    return NextResponse.json({ error: "Upload failed", message: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
