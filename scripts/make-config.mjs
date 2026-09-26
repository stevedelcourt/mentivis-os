#!/usr/bin/env node
// Génère mentivis-config.php (configuration des formulaires PHP) à partir des valeurs HubSpot
// gardées hors dépôt, puis le dépose à la racine du dépôt (fichier ignoré par git).
//
// Usage :
//   npm run config                       (lit docs/env.hubspot.md, sinon .env.deploy)
//   npm run config -- chemin/vers/fichier
//
// Formats acceptés : CLE=valeur, CLE: valeur, `CLE` = `valeur`, tableau Markdown | CLE | valeur |.
// Le fichier produit se dépose par FTP dans le dossier qui CONTIENT public_html, jamais dedans.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const KEYS = ["HUBSPOT_PORTAL_ID", "HUBSPOT_FORM_ID", "HUBSPOT_ACCESS_TOKEN"];

/** Extrait les clés connues d'un texte .env ou Markdown. */
export function parseSecrets(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    for (const key of KEYS) {
      if (values[key]) continue;
      const cells = line.split("|").map((c) => c.trim().replace(/^[`"']+|[`"']+$/g, ""));
      const idx = cells.indexOf(key);
      if (line.includes("|") && idx !== -1 && cells[idx + 1]) {
        values[key] = cells[idx + 1];
        continue;
      }
      const m = line.match(new RegExp(`(?:^|[\\s\`*-])(?:export\\s+)?[\`*]*${key}[\`*]*\\s*[:=]\\s*(.+)$`));
      if (m) {
        const v = m[1].trim().replace(/^[`"']+|[`"']+$/g, "").trim();
        if (v) values[key] = v;
      }
    }
  }
  return values;
}

const phpString = (s) => `'${String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

export function renderConfig(v) {
  return `<?php
// Configuration des formulaires PHP (public_html/forms/), générée par npm run config.
// À déposer UN NIVEAU AU-DESSUS de public_html. Ne jamais la mettre dans public_html ni dans git.
return [
    'HUBSPOT_PORTAL_ID' => ${phpString(v.HUBSPOT_PORTAL_ID)},
    'HUBSPOT_FORM_ID' => ${phpString(v.HUBSPOT_FORM_ID)},
    'HUBSPOT_ACCESS_TOKEN' => ${phpString(v.HUBSPOT_ACCESS_TOKEN || "")},
    'ALLOWED_ORIGINS' => ['https://mentivisos.com', 'https://www.mentivisos.com'],
];
`;
}

function main() {
  const arg = process.argv[2];
  const candidates = arg ? [resolve(arg)] : [join(root, "docs/env.hubspot.md"), join(root, ".env.deploy")];
  const source = candidates.find((f) => existsSync(f));
  if (!source) {
    console.error(`Aucun fichier de valeurs trouvé (${candidates.join(", ")}).`);
    process.exit(1);
  }
  const values = parseSecrets(readFileSync(source, "utf8"));
  const missing = ["HUBSPOT_PORTAL_ID", "HUBSPOT_FORM_ID"].filter((k) => !values[k]);
  if (missing.length) {
    console.error(`Valeurs manquantes dans ${source} : ${missing.join(", ")}.`);
    process.exit(1);
  }
  if (!values.HUBSPOT_ACCESS_TOKEN) {
    console.warn("Attention : HUBSPOT_ACCESS_TOKEN absent. Les candidatures partiront sans CV.");
  }

  const out = join(root, "mentivis-config.php");
  writeFileSync(out, renderConfig(values), { mode: 0o600 });

  const lint = spawnSync("php", ["-l", out], { encoding: "utf8" });
  if (lint.error) console.warn("PHP non installé : syntaxe non vérifiée.");
  else if (lint.status !== 0) {
    console.error(lint.stdout || lint.stderr);
    process.exit(1);
  }

  const token = values.HUBSPOT_ACCESS_TOKEN || "";
  console.log(`Écrit : ${out}`);
  console.log(`  source : ${source}`);
  console.log(`  portail : ${values.HUBSPOT_PORTAL_ID}, formulaire : ${values.HUBSPOT_FORM_ID}`);
  console.log(`  jeton : ${token ? `****${token.slice(-4)}` : "absent"}`);
  console.log("À déposer par FTP dans le dossier qui contient public_html (pas dedans).");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
