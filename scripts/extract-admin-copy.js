const fs = require("fs");
const path = require("path");

/** admin-copy.ts is canonical; this script rewrites it from itself (no-op) or use for CI checks. */
const copyPath = path.join(__dirname, "../components/admin/admin-copy.ts");
const content = fs.readFileSync(copyPath, "utf8");

if (!content.includes("export const adminCopy")) {
  console.error("admin-copy.ts missing export const adminCopy");
  process.exit(1);
}

console.log("OK: strings live in components/admin/admin-copy.ts (edit that file).");
