#!/usr/bin/env python3
"""Generate 1200x630 JPG Open Graph images from source visuals.

Reads jobs from lib/seo/og-manifest.json (bloc defaults, pages, posts)
plus per-article `image` fields in lib/cms/referentiel.ts.

Outputs go to public/images/og/<name>.jpg and are committed to git
(all public assets must be tracked - deploy does git reset --hard).

Modes:
  default   generate missing/outdated outputs (needs macOS `sips`);
            without sips, verify-only with warnings, exit 0.
  --check   strict verify: exit 1 if any expected output is missing.
            Used by `npm run og:check` and tests.

Incremental: skips outputs newer than their source.
"""

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(REPO, "public")
MANIFEST = os.path.join(REPO, "lib", "seo", "og-manifest.json")
REFERENTIEL_TS = os.path.join(REPO, "lib", "cms", "referentiel.ts")
OG_WIDTH = 1200
OG_HEIGHT = 630
JPEG_QUALITY = 80


def slugify_route(pathname: str) -> str:
    s = re.sub(r"^/+|/+$", "", pathname).replace("/", "-")
    return s or "home"


def collect_jobs():
    with open(MANIFEST, encoding="utf-8") as f:
        manifest = json.load(f)
    jobs = []  # (src_web, dest_web)
    for bloc, src in manifest.get("blocDefaults", {}).items():
        jobs.append((src, f"/images/og/bloc-{bloc.lower()}.jpg"))
    for route, src in manifest.get("pages", {}).items():
        jobs.append((src, f"/images/og/page-{slugify_route(route)}.jpg"))
    for slug, src in manifest.get("posts", {}).items():
        jobs.append((src, f"/images/og/post-{slug}.jpg"))
    # Per-article hero images from referentiel.ts `"image"` fields.
    if os.path.exists(REFERENTIEL_TS):
        with open(REFERENTIEL_TS, encoding="utf-8") as f:
            ts = f.read()
        # Entries are JSON-shaped; image sits near slug within each object.
        for m in re.finditer(r'"slug":\s*"([^"]+)"(.*?)"image":\s*"([^"]+)"', ts, re.DOTALL):
            slug, middle, src = m.group(1), m.group(2), m.group(3)
            # Ensure image belongs to the same entry (no new entry boundary between).
            if '"id":' not in middle:
                jobs.append((src, f"/images/og/{slug}.jpg"))
    # Deduplicate, keep first occurrence.
    seen = set()
    unique = []
    for job in jobs:
        if job[1] not in seen:
            seen.add(job[1])
            unique.append(job)
    return unique


def sips_size(path: str):
    try:
        out = subprocess.run(
            ["sips", "-g", "pixelWidth", "-g", "pixelHeight", path],
            capture_output=True, text=True, check=True,
        ).stdout
        w = int(re.search(r"pixelWidth:\s*(\d+)", out).group(1))
        h = int(re.search(r"pixelHeight:\s*(\d+)", out).group(1))
        return w, h
    except Exception:
        return None


def convert(src_abs: str, dest_abs: str) -> bool:
    """Resample to width 1200 then center-crop to 1200x630 JPEG."""
    try:
        os.makedirs(os.path.dirname(dest_abs), exist_ok=True)
        tmp = dest_abs + ".tmp.jpg"
        subprocess.run(
            ["sips", "-s", "format", "jpeg", "-s", "formatOptions", str(JPEG_QUALITY),
             "--resampleWidth", str(OG_WIDTH), src_abs, "--out", tmp],
            capture_output=True, check=True,
        )
        size = sips_size(tmp)
        if size and size[1] < OG_HEIGHT:
            subprocess.run(
                ["sips", "--resampleHeight", str(OG_HEIGHT), tmp, "--out", tmp],
                capture_output=True, check=True,
            )
        subprocess.run(
            ["sips", "--cropToHeightWidth", str(OG_HEIGHT), str(OG_WIDTH), tmp, "--out", dest_abs],
            capture_output=True, check=True,
        )
        if os.path.exists(tmp):
            os.remove(tmp)
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ERROR sips failed for {src_abs}: {e.stderr[:200] if e.stderr else e}")
        return False


def main() -> int:
    check_only = "--check" in sys.argv
    jobs = collect_jobs()
    print(f"[og] {len(jobs)} jobs (manifest + referentiel image fields)")
    has_sips = shutil.which("sips") is not None
    if not has_sips and not check_only:
        print("[og] sips not available (non-macOS builder) - verify-only mode")
    missing = []
    generated = 0
    skipped = 0
    for src_web, dest_web in jobs:
        src_abs = os.path.join(PUBLIC, src_web.lstrip("/"))
        dest_abs = os.path.join(PUBLIC, dest_web.lstrip("/"))
        if not os.path.exists(src_abs):
            print(f"  MISSING SOURCE {src_web} -> {dest_web}")
            missing.append(dest_web)
            continue
        if os.path.exists(dest_abs) and os.path.getmtime(dest_abs) >= os.path.getmtime(src_abs):
            skipped += 1
            continue
        if check_only or not has_sips:
            print(f"  MISSING OUTPUT {dest_web} (from {src_web})")
            missing.append(dest_web)
            continue
        print(f"  generate {dest_web} <- {src_web}")
        if convert(src_abs, dest_abs):
            generated += 1
        else:
            missing.append(dest_web)
    print(f"[og] generated={generated} up-to-date={skipped} missing={len(missing)}")
    if check_only and missing:
        print("[og] FAIL - run `npm run og` on macOS to generate:")
        for m in missing:
            print(f"   - {m}")
        return 1
    if missing and has_sips and not check_only:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
