import { NextResponse } from "next/server";
import { createToken, isAuthorizedEmail } from "@/lib/cms/auth";
import { appendFileSync } from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "logs", "cms-login.log");

function log(msg: string) {
  try {
    appendFileSync(LOG_FILE, `${new Date().toISOString()} ${msg}\n`);
  } catch {
    // ignore
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      log("MISSING_FIELDS");
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (!isAuthorizedEmail(email)) {
      log(`DOMAIN_REJECT email=${email}`);
      return NextResponse.json(
        { error: "Unauthorized email domain. Use @mentivis.com or @mentivisOS.com" },
        { status: 403 }
      );
    }

    const cmsSecret = process.env.CMS_AUTH_SECRET;
    const internalToken = process.env.INTERNAL_TOKEN;
    const expectedPassword = cmsSecret || internalToken;

    log(`ATTEMPT email=${email} cmsSecretSet=${!!cmsSecret} internalTokenSet=${!!internalToken} expectedLen=${expectedPassword?.length} receivedLen=${password?.length} match=${password === expectedPassword}`);

    if (password !== expectedPassword) {
      log(`REJECT expectedFirst4=${expectedPassword?.slice(0, 4)} receivedFirst4=${password?.slice(0, 4)}`);
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    log(`SUCCESS email=${email}`);
    const token = createToken(email);
    return NextResponse.json({ success: true, token, email });
  } catch (err) {
    log(`ERROR ${err}`);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
