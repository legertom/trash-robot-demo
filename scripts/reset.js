// Puts the project back exactly as it was when you cloned it.
// Throws away every local change and commit. Used by: npm run reset
import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";

function git(...args) {
  return execFileSync("git", args, { stdio: ["ignore", "pipe", "inherit"] }).toString().trim();
}

console.log("Resetting to the starting point...");
try {
  git("fetch", "--quiet", "origin");
} catch {
  console.log("(could not reach GitHub, using the last known copy of main)");
}
git("reset", "--quiet", "--hard", "origin/main");
git("clean", "--quiet", "-fd");
rmSync(".claude/gate-log.jsonl", { force: true });
console.log(`Done. You are back at: ${git("log", "--oneline", "-1")}`);
console.log("Next: npm test");
