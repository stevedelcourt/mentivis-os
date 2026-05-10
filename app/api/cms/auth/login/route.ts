import { NextResponse } from "next/server";
import { createToken, isAuthorizedEmail } from "@/lib/cms/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (!isAuthorizedEmail(email)) {
      return NextResponse.json(
        { error: "Unauthorized email domain. Use @mentivis.com or @mentivisOS.com" },
        { status: 403 }
      );
    }

    const expectedPassword = process.env.CMS_AUTH_SECRET || process.env.INTERNAL_TOKEN;
    console.log("[CMS LOGIN] expected:", expectedPassword?.slice(0, 4) + "...", "received:", password?.slice(0, 4) + "...", "match:", password === expectedPassword);
    if (password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = createToken(email);
    return NextResponse.json({ success: true, token, email });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
