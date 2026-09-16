#!/usr/bin/env node
/**
 * Nitro bundles @electric-sql/pglite into _libs/electric-sql__pglite.mjs but
 * leaves pglite.data / pglite.wasm / initdb.wasm behind. The WASM loader then
 * does `new URL("./pglite.data", import.meta.url)` and 500s on every request
 * when DATABASE_URL is unset (sandbox production-preview). Deployed Vercel
 * sets DATABASE_URL so PGLite never opens — the extra files are a no-op there.
 */
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
const files = ["pglite.data", "pglite.wasm", "initdb.wasm"];
const dests = [
  join(root, ".vercel/output/functions/__server.func/_libs"),
  join(root, ".output/server/_libs"),
];

let copied = 0;
for (const dest of dests) {
  if (!existsSync(dest)) continue;
  for (const name of files) {
    const from = join(srcDir, name);
    if (!existsSync(from)) {
      console.warn("[pglite-assets] missing", from);
      continue;
    }
    copyFileSync(from, join(dest, name));
    copied += 1;
  }
}
if (copied === 0) {
  console.warn("[pglite-assets] no output dirs yet — skip");
} else {
  console.log(`[pglite-assets] copied ${copied} wasm/data files next to the bundled PGLite`);
}
