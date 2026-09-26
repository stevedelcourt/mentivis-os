#!/usr/bin/env python3
"""Export du contenu public d'une copie locale de la base de l'ancien CMS (SQLite)
vers les fichiers du dépôt. Aucun serveur ni mot de passe nécessaire.

Usage :
    python3 scripts/export-db-content.py /chemin/vers/mentivis.db [--uploads /chemin/vers/uploads]

Écrit :
    content/blog/<slug>.json   articles (champ "published" conservé)
    content/jobs/<slug>.json   offres d'emploi
    content/pages.json         textes de hero (fr/en)
    content/seo.json           titres, descriptions et JSON-LD globaux (sans la page Tarifs)
    public/uploads/<fichier>   images référencées, si --uploads est fourni

Tables jamais lues : submissions, job_applications, users (données personnelles).
Les URL /api/uploads/<fichier> sont réécrites en /uploads/<fichier>.
"""
import argparse
import json
import re
import shutil
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UPLOAD_RE = re.compile(r"/api/uploads/([A-Za-z0-9._-]+)")
SPECIAL_KEYS = {"date_iso": "dateISO"}
BOOL_KEYS = {"featured", "published", "remote"}

used_uploads: set[str] = set()


def camel(key: str) -> str:
    if key in SPECIAL_KEYS:
        return SPECIAL_KEYS[key]
    head, *rest = key.split("_")
    return head + "".join(p[:1].upper() + p[1:] for p in rest)


def rewrite(value):
    if isinstance(value, str):
        def repl(m):
            used_uploads.add(m.group(1))
            return f"/uploads/{m.group(1)}"
        return UPLOAD_RE.sub(repl, value)
    if isinstance(value, list):
        return [rewrite(v) for v in value]
    if isinstance(value, dict):
        return {k: rewrite(v) for k, v in value.items()}
    return value


def row_to_obj(row: sqlite3.Row) -> dict:
    obj = {}
    for key in row.keys():
        if key == "id":
            continue
        value = row[key]
        name = camel(key)
        if key in BOOL_KEYS:
            value = bool(value)
        obj[name] = "" if value is None else value
    return rewrite(obj)


def write_json(rel: str, data) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def tables(db: sqlite3.Connection) -> set[str]:
    return {r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("db", help="copie locale de mentivis.db")
    parser.add_argument("--uploads", help="dossier uploads/ de l'ancien CMS (images)")
    args = parser.parse_args()

    db_path = Path(args.db)
    if not db_path.is_file():
        print(f"Base introuvable : {db_path}", file=sys.stderr)
        return 1
    db = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
    db.row_factory = sqlite3.Row
    present = tables(db)

    posts = [row_to_obj(r) for r in db.execute("SELECT * FROM posts")] if "posts" in present else []
    for post in posts:
        write_json(f"content/blog/{post['slug']}.json", post)

    jobs = [row_to_obj(r) for r in db.execute("SELECT * FROM jobs")] if "jobs" in present else []
    for job in jobs:
        write_json(f"content/jobs/{job['slug']}.json", job)

    pages: dict = {"fr": {}, "en": {}}
    if "pages" in present:
        for r in db.execute("SELECT lang, page, hero_json FROM pages"):
            try:
                pages.setdefault(r["lang"], {})[r["page"]] = {"hero": rewrite(json.loads(r["hero_json"]))}
            except (TypeError, ValueError):
                pass
    write_json("content/pages.json", pages)

    seo: dict = {"fr": {}, "en": {}}
    if "seo" in present:
        for r in db.execute("SELECT lang, page, title, description, json_ld FROM seo"):
            if r["page"] == "tarifs":
                continue
            try:
                json_ld = json.loads(r["json_ld"])
            except (TypeError, ValueError):
                json_ld = {}
            seo.setdefault(r["lang"], {})[r["page"]] = rewrite(
                {"title": r["title"], "description": r["description"], "jsonLd": json_ld}
            )
    write_json("content/seo.json", seo)

    copied = 0
    missing = []
    if args.uploads:
        src = Path(args.uploads)
        dest = ROOT / "public" / "uploads"
        dest.mkdir(parents=True, exist_ok=True)
        for name in sorted(used_uploads):
            if (src / name).is_file():
                shutil.copy2(src / name, dest / name)
                copied += 1
            elif not (dest / name).is_file():
                missing.append(name)
    else:
        missing = [n for n in sorted(used_uploads) if not (ROOT / "public" / "uploads" / n).is_file()]

    published = sum(1 for p in posts if p.get("published"))
    print(f"articles : {len(posts)} (publiés : {published}), offres : {len(jobs)}, "
          f"heroes : {sum(len(v) for v in pages.values())}, SEO : {sum(len(v) for v in seo.values())}")
    print(f"images référencées : {len(used_uploads)}, copiées : {copied}")
    if missing:
        print("Images manquantes dans public/uploads/ : " + ", ".join(missing))
    print("Vérifier (git status), puis commiter content/ et public/uploads/.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
