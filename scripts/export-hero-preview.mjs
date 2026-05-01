import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public/previews/vnbus-premium-hero-banner.png");
const url = process.env.HERO_PREVIEW_URL || "http://127.0.0.1:3000/";
const chrome =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

mkdirSync(dirname(output), { recursive: true });

async function isUp() {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

let server;
if (!(await isUp())) {
  server = spawn("npm", ["run", "dev", "--", "-p", "3000"], {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });

  for (let attempt = 0; attempt < 40; attempt += 1) {
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    if (await isUp()) break;
  }
}

if (!(await isUp())) {
  server?.kill();
  throw new Error(`Preview URL is not reachable: ${url}`);
}

if (!existsSync(chrome)) {
  server?.kill();
  throw new Error(`Chrome executable not found. Set CHROME_PATH or install Chrome. Tried: ${chrome}`);
}

const result = spawnSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1600,900",
    "--force-device-scale-factor=1",
    "--virtual-time-budget=5000",
    `--screenshot=${output}`,
    url,
  ],
  { cwd: root, stdio: "inherit" },
);

server?.kill();

if (result.status !== 0) {
  throw new Error(`Chrome screenshot failed with exit code ${result.status}`);
}

console.log(`Saved ${output}`);
