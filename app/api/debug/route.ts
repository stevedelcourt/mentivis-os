export async function GET() {
  const fs = await import("fs");
  const path = await import("path");

  const DATA_DIR = process.env.DATA_DIR || "./data";
  const DB_PATH = path.join(DATA_DIR, "mentivis.db");
  const cwd = process.cwd();

  const results: Record<string, unknown> = {
    cwd,
    DATA_DIR,
    DB_PATH,
    dbExists: false,
    dbSize: 0,
    sqlJsInit: false,
    sqlJsDb: false,
    postCount: 0,
    error: null,
  };

  try {
    results.dbExists = fs.existsSync(DB_PATH);
    if (results.dbExists) {
      results.dbSize = fs.statSync(DB_PATH).size;
    }
  } catch (e: any) {
    results.error = "fs_error: " + e.message;
  }

  try {
    const initSqlJs = (await import("sql.js")).default;
    const SQL = await initSqlJs();
    results.sqlJsInit = true;

    let buf: Buffer | null = null;
    if (fs.existsSync(DB_PATH)) {
      buf = fs.readFileSync(DB_PATH);
    }
    const db = new SQL.Database(buf ? new Uint8Array(buf) : null);
    results.sqlJsDb = true;

    try {
      db.exec("PRAGMA journal_mode = WAL;");
    } catch {}

    const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").step()
      ? db.getAsObject().count
      : 0;
    results.postCount = postCount;
  } catch (e: any) {
    results.error = "sqljs_error: " + String(e?.message || e);
  }

  return Response.json(results);
}
