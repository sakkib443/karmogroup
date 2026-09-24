// Enables this repo's supply-chain guard on the current machine.
//
// Runs automatically via the "prepare" npm script on `npm install`, and can be
// run by hand: `node scripts/setup-git-guard.mjs`. It only touches local git
// config, and stays silent/harmless outside a git checkout (e.g. CI tarballs).
import { execSync } from "node:child_process";

try {
  // Share the committed hooks in .githooks/ (auto-heal + commit block).
  execSync("git config core.hooksPath .githooks", { stdio: "ignore" });
  // Make the `merge=ours` attribute on postcss.config.mjs actually take effect.
  execSync("git config merge.ours.driver true", { stdio: "ignore" });
  console.log("[karmo] git supply-chain guard enabled (hooks + postcss merge=ours).");
} catch {
  // Not a git working copy, or git not on PATH — nothing to enable.
}
