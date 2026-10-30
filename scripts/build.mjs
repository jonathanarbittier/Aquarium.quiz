import { cp, mkdir, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { dirname, join } from "node:path";
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
  "reef-hero-2172.webp",
  "product-photos/fluval-fx6.webp"
];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(join(outputRoot, "assets"), { recursive: true });

for (const file of rootFiles) {
  await cp(join(projectRoot, file), join(outputRoot, file));
}

for (const file of assetFiles) {
  const target = join(outputRoot, "assets", file);
  await mkdir(dirname(target), { recursive: true });
  await cp(join(projectRoot, "assets", file), target);
}

const { stdout, stderr } = await run(process.execPath, [join(projectRoot, "scripts/generate-pages.mjs"), "dist"], {
  cwd: projectRoot
});

if (stdout) process.stdout.write(stdout);
if (stderr) process.stderr.write(stderr);
console.log("Built deployable static site in dist/");
