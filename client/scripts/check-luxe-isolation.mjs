/**
 * Guards the Home 02 stylesheet against leaking into the other homepages.
 *
 * `livora.css` deliberately uses generic class names — `.container`, `.hero`,
 * `.section-title`, `.btn-default` — because they mirror the design it was
 * ported from. That is only safe while every one of them is nested inside the
 * single `.lv { … }` block, since Next.js serves the stylesheet globally once
 * its route has been visited.
 *
 * This walks the file at brace depth 0 and fails if it finds anything other
 * than comments, `lv-`-prefixed @keyframes, and that one `.lv` block.
 *
 *   node scripts/check-luxe-isolation.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, "../src/app/(luxe)/livora.css");

const source = readFileSync(target, "utf8");

// Strip comments first so a `}` or a selector inside prose cannot shift the
// depth count or be mistaken for a rule.
const css = source.replace(/\/\*[\s\S]*?\*\//g, "");

const problems = [];
let depth = 0;
let buffer = "";
let sawLvBlock = false;

for (const char of css) {
  if (char === "{") {
    if (depth === 0) {
      const selector = buffer.trim().replace(/\s+/g, " ");
      buffer = "";

      if (selector === ".lv") {
        if (sawLvBlock) {
          problems.push(
            "More than one top-level `.lv` block — keep it to one so the file " +
              "is trivially auditable."
          );
        }
        sawLvBlock = true;
      } else if (selector.startsWith("@keyframes")) {
        const name = selector.slice("@keyframes".length).trim();
        if (!name.startsWith("lv-")) {
          problems.push(
            `@keyframes "${name}" is global. Prefix it \`lv-\` so it cannot ` +
              `collide with an animation on another page.`
          );
        }
      } else {
        problems.push(
          `Top-level rule \`${selector}\` escapes the .lv block and will apply ` +
            `site-wide. Move it inside \`.lv { … }\`.`
        );
      }
    } else {
      buffer = "";
    }
    depth += 1;
  } else if (char === "}") {
    depth -= 1;
    buffer = "";
    if (depth < 0) {
      problems.push("Unbalanced `}` — the file has more closes than opens.");
      break;
    }
  } else {
    buffer += char;
  }
}

if (depth > 0) {
  problems.push(`Unbalanced braces — ${depth} block(s) left open.`);
}

if (!sawLvBlock) {
  problems.push("No `.lv { … }` block found. Did the file get restructured?");
}

if (problems.length) {
  console.error("\n✗ Home 02 stylesheet is not isolated:\n");
  for (const p of problems) console.error(`  • ${p}`);
  console.error("");
  process.exit(1);
}

console.log("✓ livora.css is fully scoped to .lv — no rules escape to other pages.");
