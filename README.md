# TankPicks Aquarium Filter Finder

TankPicks is a static aquarium-filter comparison site with a browser-based quiz and a crawlable guide library. Rankings use manufacturer-published specifications and quiz answers; the project does not claim hands-on product testing.

## Local development

```sh
npm run build
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`.

Run repository checks with:

```sh
npm run validate
```

The validator checks public HTML pages, unique metadata, canonicals, internal links, image paths, CSS structure, sitemap coverage, and representative quiz results.

## Build output

`npm run build` recreates `dist/`, copies the homepage and required static assets, then generates the supporting pages and `sitemap.xml` there. Vercel runs this command and serves `dist/` as configured in `vercel.json`.

Supporting-page source content lives in `scripts/generate-pages.mjs`. Update it, run the build, and use `npm run validate` to check the finished output. The generated `dist/` directory is intentionally not committed.

## Affiliate configuration

Affiliate tracking is disabled in `assets/config.js`. Do not enable it until an approved Amazon Associate ID is configured. When enabled with a valid tag, the result page adds the tag to Amazon searches and displays the configured Associate disclosure.

## Product image status

Product photographs are controlled by the per-product `approvedProductPhotos` registry in `assets/app.js`. Only add an entry after the exact model, source, and display permission are documented in `IMAGE-PROVENANCE.md`. Models without an approved entry use neutral filter-format illustrations.
