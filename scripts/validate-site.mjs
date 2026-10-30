import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import vm from "node:vm";

const projectRoot = resolve(new URL("../", import.meta.url).pathname);
const root = resolve(projectRoot, process.argv[2] || ".");
const failures = [];
const htmlFiles = [];
const forbiddenPublicText = [
  "owner has not yet supplied",
  "owner identity",
  "business identity",
  "mailing address",
  "dedicated privacy contact",
  "usage permission is undocumented",
  "owner records a source and permission basis"
];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if ([".git", "node_modules", "artifacts"].includes(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) htmlFiles.push(path);
  }
}

function capture(html, pattern, label, file) {
  const match = html.match(pattern);
  if (!match) failures.push(`${relative(root, file)}: missing ${label}`);
  return match?.[1]?.trim() || "";
}

function publicPath(file) {
  const rel = relative(root, file).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/index\.html$/, "")}`;
}

function resolveInternal(url) {
  const pathname = new URL(url, "https://tankpicks.com").pathname;
  if (pathname === "/") return join(root, "index.html");
  const direct = join(root, pathname);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  return join(root, pathname, "index.html");
}

walk(root);
const seen = { title: new Map(), description: new Map(), canonical: new Map() };

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const phrase of forbiddenPublicText) {
    if (html.toLowerCase().includes(phrase)) failures.push(`${relative(root, file)}: contains public placeholder text: ${phrase}`);
  }
  const values = {
    title: capture(html, /<title>([^<]+)<\/title>/i, "title", file),
    description: capture(html, /<meta\s+name="description"\s+content="([^"]+)"/i, "meta description", file),
    canonical: capture(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i, "canonical", file)
  };
  for (const [type, value] of Object.entries(values)) {
    if (!value) continue;
    if (seen[type].has(value)) failures.push(`${relative(root, file)}: duplicate ${type} with ${seen[type].get(value)}`);
    seen[type].set(value, relative(root, file));
  }
  const expectedCanonical = `https://tankpicks.com${publicPath(file)}`;
  if (values.canonical && values.canonical !== expectedCanonical) failures.push(`${relative(root, file)}: canonical should be ${expectedCanonical}`);
  for (const property of ["og:image", "twitter:image"]) {
    const pattern = property === "og:image" ? /<meta\s+property="og:image"\s+content="([^"]+)"/i : /<meta\s+name="twitter:image"\s+content="([^"]+)"/i;
    const value = capture(html, pattern, property, file);
    if (value && !value.startsWith("https://tankpicks.com/")) failures.push(`${relative(root, file)}: ${property} is not absolute`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    if (!existsSync(resolveInternal(url))) failures.push(`${relative(root, file)}: missing internal target ${url}`);
  }
}

const css = readFileSync(join(root, "assets/styles.css"), "utf8");
let braceDepth = 0;
for (const char of css) {
  if (char === "{") braceDepth += 1;
  if (char === "}") braceDepth -= 1;
  if (braceDepth < 0) failures.push("assets/styles.css: closing brace before opening brace");
}
if (braceDepth !== 0) failures.push(`assets/styles.css: unbalanced braces (${braceDepth})`);
for (const match of css.matchAll(/url\("?([^"')]+)["']?\)/g)) {
  if (match[1].startsWith("data:")) continue;
  const asset = resolve(join(root, "assets"), match[1]);
  if (!existsSync(asset)) failures.push(`assets/styles.css: missing asset ${match[1]}`);
}

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const expectedUrls = htmlFiles.map(file => `https://tankpicks.com${publicPath(file)}`).sort();
if (JSON.stringify([...sitemapUrls].sort()) !== JSON.stringify(expectedUrls)) failures.push("sitemap.xml does not exactly match real indexable HTML pages");

const robots = readFileSync(join(root, "robots.txt"), "utf8");
if (!robots.includes("Sitemap: https://tankpicks.com/sitemap.xml")) failures.push("robots.txt does not reference the production sitemap");

const appCode = readFileSync(join(root, "assets/app.js"), "utf8");
if (existsSync(join(root, "assets/products"))) failures.push("Uncleared product photographs were copied into the deployable build");
const element = { addEventListener() {}, classList: { add() {}, remove() {}, toggle() {} }, dataset: {}, scrollIntoView() {}, focus() {}, setAttribute() {} };
const context = {
  window: { TANKPICKS_CONFIG: { affiliateLinksEnabled: false, amazonAssociateTag: "" } },
  document: { getElementById() { return element; }, body: { classList: { add() {}, remove() {} } } },
  URL,
  setTimeout() {},
  requestAnimationFrame() {},
  console
};
vm.createContext(context);
try {
  vm.runInContext(appCode, context);
  const scenarios = [
    { name: "20-gallon gentle freshwater", answers: { water: "fresh", gallons: 20, livestock: "gentle", stocking: "moderate", format: "any" }, minimum: 1 },
    { name: "75-gallon reef canister", answers: { water: "reef", gallons: 75, livestock: "ordinary", stocking: "moderate", format: "canister" }, minimum: 1 },
    { name: "350-gallon freshwater", answers: { water: "fresh", gallons: 350, livestock: "ordinary", stocking: "moderate", format: "any" }, minimum: 1 },
    { name: "401-gallon boundary", answers: { water: "fresh", gallons: 401, livestock: "ordinary", stocking: "moderate", format: "any" }, minimum: 0, maximum: 0 }
  ];
  for (const scenario of scenarios) {
    const result = vm.runInContext(`answers=${JSON.stringify(scenario.answers)};getMatches()`, context);
    if (result.products.length < scenario.minimum || (scenario.maximum !== undefined && result.products.length > scenario.maximum)) failures.push(`Quiz scenario failed: ${scenario.name}`);
    for (const product of result.products) {
      if (product.max < scenario.answers.gallons) failures.push(`Quiz scenario ${scenario.name} returned undersized ${product.name}`);
      if (!product.waters.includes(scenario.answers.water)) failures.push(`Quiz scenario ${scenario.name} returned incompatible ${product.name}`);
    }
  }
  if (appCode.includes("id:'cascadeMax'")) failures.push("Cascade Max-Flow remains rankable without a manufacturer-confirmed upper capacity");
  if (appCode.includes("productImageUsageEnabled")) failures.push("Product photos still use a global enable switch instead of per-product eligibility");
  if (!appCode.includes("approvedProductPhotos[p.id]")) failures.push("Product photo eligibility is not checked per product");
} catch (error) {
  failures.push(`Quiz validation error: ${error.message}`);
}

if (failures.length) {
  console.error(failures.map(item => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages, ${sitemapUrls.length} sitemap URLs, internal links, image paths, metadata, CSS, and 4 quiz scenarios.`);
