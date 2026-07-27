/**
 * Verifies that every image Home 02 points at actually exists in /public.
 *
 * Home 02 references assets that another part of the project owns and is
 * actively reorganising — files have already moved folders and changed
 * extension mid-session. A missing image does not fail the build on its own:
 * Next serves a 400 from the optimiser and the tile just renders empty, which
 * is easy to ship without noticing.
 *
 * This turns that silent failure into a loud one.
 *
 *   node scripts/check-home2-assets.mjs
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const componentsDir = resolve(here, "../src/components/Home2");
const publicDir = resolve(here, "../public");

// Only matches paths that look like real assets, so a href like "/foam" or a
// className string never gets mistaken for one.
const ASSET = /["'`](\/[^"'`\s]+\.(?:png|jpe?g|svg|webp|avif|gif|mp4|webm))["'`]/gi;

const missing = [];
const unchecked = [];
let checked = 0;

for (const file of readdirSync(componentsDir)) {
  if (!file.endsWith(".jsx") && !file.endsWith(".js")) continue;

  const source = readFileSync(join(componentsDir, file), "utf8");
  for (const [, assetPath] of source.matchAll(ASSET)) {
    // Template literals that build a path at runtime (`icon-${n}.svg`) cannot
    // be resolved statically. Skipping them is the honest choice — claiming
    // they pass would be worse than admitting they are unchecked.
    if (assetPath.includes("${")) {
      unchecked.push({ file, assetPath });
      continue;
    }
    checked += 1;
    // decodeURI so a path written with %20 still resolves to the real filename.
    if (!existsSync(join(publicDir, decodeURI(assetPath)))) {
      missing.push({ file, assetPath });
    }
  }
}

if (missing.length) {
  console.error("\n✗ Home 02 references images that are not in /public:\n");
  for (const { file, assetPath } of missing) {
    console.error(`  • ${assetPath}`);
    console.error(`      referenced by components/Home2/${file}`);
  }
  console.error(
    "\n  The asset library is shared. If a file moved or changed extension, " +
      "update the reference — do not re-add the old copy.\n"
  );
  process.exit(1);
}

/* ────────────────────────────────────────────────────────────────────────────
   Drift check: Home 02's category tiles quote Home 01's divisions.

   Home 02 deliberately reuses Home 01's four division images so the two
   homepages illustrate the same business with the same pictures. That is a
   copied constant, not an import, and it has already fallen out of step twice
   in one session — once when a file changed extension, once when two proper
   division photographs replaced the stand-ins.

   Neither break failed the build; the tiles just rendered a stand-in or
   nothing. A warning here is the right level: the two files are allowed to
   diverge one day, but never by accident.
   ──────────────────────────────────────────────────────────────────────────── */
const DIVISION_SOURCE = resolve(here, "../src/components/Home/DivisionStack.jsx");
const CATEGORY_SOURCE = join(componentsDir, "Categories.jsx");

if (existsSync(DIVISION_SOURCE) && existsSync(CATEGORY_SOURCE)) {
  const pull = (file, key) => [
    ...readFileSync(file, "utf8").matchAll(
      new RegExp(`${key}:\\s*["'](\\/images\\/[^"']+)["']`, "g")
    ),
  ].map(([, p]) => p);

  const home1 = pull(DIVISION_SOURCE, "image");
  const home2 = pull(CATEGORY_SOURCE, "src");

  const drifted = home1.filter((p) => !home2.includes(p));

  if (home1.length && drifted.length) {
    console.warn(
      "\n⚠ Home 02's category tiles no longer match Home 01's divisions.\n"
    );
    for (const p of drifted) {
      console.warn(`  • Home 01 shows ${p}, Home 02 does not.`);
    }
    console.warn(
      "\n  If Home 01 changed a division photograph, mirror it in " +
        "components/Home2/Categories.jsx.\n"
    );
  }
}

console.log(`✓ all ${checked} Home 02 image references resolve in /public.`);
if (unchecked.length) {
  console.log(
    `  (${unchecked.length} built at runtime and not statically checkable: ` +
      unchecked.map((u) => u.assetPath).join(", ") +
      ")"
  );
}
