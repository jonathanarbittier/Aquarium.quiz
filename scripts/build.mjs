import { cp, mkdir, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const projectRoot = new URL("../", import.meta.url).pathname;
const outputRoot = join(projectRoot, "dist");

const rootFiles = ["index.html", "favicon.svg", "robots.txt"];
const assetFiles = [
  "app.js",
  "config.js",
  "styles.css",
  "filter-canister-fallback.svg",
  "filter-hob-fallback.svg",
  "filter-internal-fallback.svg",
  "filter-sponge-fallback.svg",
  "reef-hero-1280.avif",
  "reef-hero-1280.webp",
  "reef-hero-2172.avif",
  "reef-hero-2172.webp"
];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(join(outputRoot, "assets"), { recursive: true });

for (const file of rootFiles) {
  await cp(join(projectRoot, file), join(outputRoot, file));
}

for (const file of assetFiles) {
  await cp(join(projectRoot, "assets", file), join(outputRoot, "assets", file));
}

const { stdout, stderr } = await run(process.execPath, [join(projectRoot, "scripts/generate-pages.mjs"), "dist"], {
  cwd: projectRoot
});

if (stdout) process.stdout.write(stdout);
if (stderr) process.stderr.write(stderr);
console.log("Built deployable static site in dist/");
