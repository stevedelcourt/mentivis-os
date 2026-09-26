#!/usr/bin/env python3
"""Static-export API snapshot + hosting files (Universe / PreProd).

Runs inside `npm run prebuild` AFTER static-export-guard.js, only when
STATIC_EXPORT=1. Reads the local CMS database (frozen prod copy) and writes:

  out/api/_snapshot/posts.fr.json / posts.en.json
  out/api/_snapshot/jobs.fr.json  / jobs.en.json
  out/proxy.php        (from scripts/static-proxy.php.tpl, IDs injected)
  out/.htaccess        (static hosting rules, copied from template)

Localization mirrors the Node API routes exactly:
  FR: published + non-empty content.
  EN: published + non-empty content_en, *En fields mapped over base fields.
 Reads HubSpot IDs + recipient emails from the environment (same names as
 .env.deploy). Missing recipient => placeholder + loud warning (mail would
 go nowhere); the build still succeeds so PreProd can be smoke-tested.
"""

import json
import os
import shutil
import sqlite3
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "out")
SNAP = os.path.join(OUT, "api", "_snapshot")
DB = os.path.join(REPO, "data", "mentivis.db")

POST_FIELDS = [
    "id", "slug", "title", "excerpt", "content", "category", "date",
    "date_iso", "image_url", "image_tag", "image_caption", "featured",
    "published", "created_at", "updated_at", "gradient_id", "title_en",
    "excerpt_en", "content_en", "pdf_url", "pdf_title", "pdf_title_en",
    "pdf_image", "pdf_context",
]
# camelCase aliases expected by the frontend (rowToPost mapping).
POST_ALIAS = {
    "date_iso": "dateISO", "image_url": "imageUrl", "image_tag": "imageTag",
    "image_caption": "imageCaption", "gradient_id": "gradientId",
    "title_en": "titleEn", "excerpt_en": "excerptEn", "content_en": "contentEn",
    "pdf_url": "pdfUrl", "pdf_title": "pdfTitle",
    "pdf_title_en": "pdfTitleEn", "pdf_image": "pdfImage",
    "pdf_context": "pdfContext", "created_at": "createdAt",
    "updated_at": "updatedAt",
}
JOB_FIELDS = [
    "id", "slug", "reference", "title", "location", "remote", "type",
    "department", "description", "why_join", "published", "created_at",
    "updated_at", "title_en", "description_en", "why_join_en",
    "location_en", "department_en",
]
JOB_ALIAS = {
    "why_join": "whyJoin", "title_en": "titleEn",
    "description_en": "descriptionEn", "why_join_en": "whyJoinEn",
    "location_en": "locationEn", "department_en": "departmentEn",
    "created_at": "createdAt", "updated_at": "updatedAt",
}


def rows(table, fields):
    db = sqlite3.connect(DB)
    db.row_factory = sqlite3.Row
    try:
        out = db.execute(
            f"SELECT {', '.join(fields)} FROM {table}").fetchall()
    except sqlite3.OperationalError as e:
        print(f"[snapshot] table {table} unreadable ({e}) -> empty")
        return []
    return [dict(r) for r in out]


def aliased(row, alias):
    out = {}
    for k, v in row.items():
        out[alias.get(k, k)] = v
    return out


def localize_post(p, lang):
    if lang == "en":
        if p.get("titleEn"):
            p["title"] = p["titleEn"]
        if p.get("excerptEn"):
            p["excerpt"] = p["excerptEn"]
        if p.get("contentEn"):
            p["content"] = p["contentEn"]
    return p


def localize_job(j, lang):
    if lang == "en":
        for base, en in [("title", "titleEn"), ("description", "descriptionEn"),
                         ("whyJoin", "whyJoinEn"), ("location", "locationEn"),
                         ("department", "departmentEn")]:
            if j.get(en):
                j[base] = j[en]
    return j


def main():
    if os.environ.get("STATIC_EXPORT") != "1":
        return 0
    os.makedirs(SNAP, exist_ok=True)

    posts = [aliased(r, POST_ALIAS) for r in rows("posts", POST_FIELDS)]
    posts_fr = [p for p in posts if p.get("published") and p.get("content")]
    posts_en = [localize_post(dict(p), "en") for p in posts
                if p.get("published") and p.get("contentEn")]

    jobs = [aliased(r, JOB_ALIAS) for r in rows("jobs", JOB_FIELDS)]
    jobs_fr = [j for j in jobs if j.get("published")]
    jobs_en = [localize_job(dict(j), "en") for j in jobs_fr]

    for name, data in [("posts.fr", posts_fr), ("posts.en", posts_en),
                       ("jobs.fr", jobs_fr), ("jobs.en", jobs_en)]:
        dest = os.path.join(SNAP, name + ".json")
        with open(dest, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
        print(f"[snapshot] {name}.json: {len(data)} item(s)")

    # --- proxy.php (IDs + recipient injected, never committed) ---
    tpl = os.path.join(REPO, "scripts", "static-proxy.php.tpl")
    with open(tpl, encoding="utf-8") as f:
        php = f.read()
    portal = os.environ.get("HUBSPOT_PORTAL_ID", "")
    form = os.environ.get("HUBSPOT_FORM_ID", "")
    recipient = os.environ.get("RECIPIENT_EMAIL", "")
    if not portal or not form:
        print("[snapshot] WARNING: HUBSPOT_PORTAL_ID/FORM_ID missing - "
              "proxy.php HubSpot forwarding disabled")
    if not recipient:
        recipient = "CHANGE-ME@example.com"
        print("[snapshot] WARNING: RECIPIENT_EMAIL missing - candidatures "
              "email will go nowhere until configured")
    php = (php.replace("%%HUBSPOT_PORTAL_ID%%", portal)
              .replace("%%HUBSPOT_FORM_ID%%", form)
              .replace("%%RECIPIENT_EMAIL%%", recipient))
    with open(os.path.join(OUT, "proxy.php"), "w", encoding="utf-8") as f:
        f.write(php)
    print("[snapshot] proxy.php written")

    # --- .htaccess (static hosting rules) ---
    shutil.copy(os.path.join(REPO, "scripts", "export-htaccess.txt"),
                os.path.join(OUT, ".htaccess"))
    print("[snapshot] .htaccess written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
