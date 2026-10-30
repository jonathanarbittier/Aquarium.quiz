# Product image provenance audit

Audit date: 2026-10-30

## Current decision

The repository contains 29 local JPGs under `assets/products/`. Git history and file metadata do not identify their source, rights holder, or license. None of these files is approved for deployment, and the build intentionally excludes the entire `assets/products/` directory.

The application uses the per-product `approvedProductPhotos` registry in `assets/app.js`. A photograph is eligible only when its registry entry records an exact-model asset that has a documented display basis. One photograph is currently approved: Fluval FX6.

## Approved photograph

### Fluval FX6

- Local asset: `assets/product-photos/fluval-fx6.webp`
- Exact model: Fluval FX6 canister filter
- Source page: https://commons.wikimedia.org/wiki/File:Fluval_FX6_Canister_Filter.jpg
- Original source named by Commons: https://fishtanksociety.com/clean-fx6/
- Author / rights holder: Fish Tank Society
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0), https://creativecommons.org/licenses/by-sa/4.0/
- Retrieved: 2026-10-30
- Source format and dimensions: JPEG, 1024 × 768
- Source SHA-256: `f39f41f21bef5aa0d541f677267807d95493fea1f49ea8a5de1725b7a499fbbe`
- Local SHA-256: `0c9604229d85cffadcc8b049406f1c8913fd2d58e66642cbc2ad6e50541384f4`
- Visual inspection: accepted; the photograph clearly shows a complete, identifiable FX6 canister, lid, hose valves, and drain hose during maintenance. It is not packaging, a component-only view, or another FX-series model.
- Modifications: converted from JPEG to WebP at quality 82; no crop, compositing, or content changes; dimensions retained at 1024 × 768.
- Attribution: displayed beside the photograph and documented on `/photo-credits/`.
- Share-alike: the adapted WebP is distributed under CC BY-SA 4.0.

## Source review

- Fluval/Hagen: official terms state that site photographs and other content may not be reproduced or publicly displayed without prior written consent. No written consent is recorded.
- EHEIM: official legal information states that published images may not be reproduced or used in other electronic publications without express written consent. No written consent is recorded.
- Seachem: its product page offers model-specific downloads, but the site states that content use is limited to authorized distributors and sellers and to individuals for private use. TankPicks has no documented authorization.
- Aqueon: official terms limit downloaded material to personal, noncommercial use and require express written permission for public or commercial reuse.
- Aquarium Co-Op: official terms prohibit reproducing, copying, selling, reselling, or exploiting site content without express written permission.
- Penn-Plax: no public commercial-reuse grant or exact-model freely licensed photograph was located.
- Amazon: no approved Associates image integration or credentials are configured. Amazon program rules require images to be obtained through an approved program integration and prohibit storing or caching the image itself; the existing local JPGs therefore cannot be treated as approved Amazon assets.
- Wikimedia Commons: exact-model searches were performed for every rankable family. The FX6 photograph above was the only suitable commercially reusable exact-model result located. Attribution is allowed and now supplied.

## Uncleared rankable models

- Fluval AC20, AC30, AC50, AC70, and AC110 Power Filters
- Seachem Tidal 35, 55, 75, and 110
- Fluval C2, C3, and C4 Power Filters
- Fluval U3 Underwater Filter
- Fluval 107, 207, 307, and 407
- Fluval FX2 and FX4
- EHEIM Classic 1500XL 2260 and 2262
- Penn-Plax Cascade 700, 1000, 1200, and 1500
- Aqueon QuietFlow Canister 200
- Aquarium Co-Op Easy Flow Sponge Filter

The orphaned `cascadeMax.jpg` is also uncleared, but Cascade Max-Flow is not rankable because its manufacturer-confirmed upper capacity remains unavailable.

## Evidence required to approve a photograph

Each enabled model needs an exact-model source URL or original file, rights holder, written permission or applicable license, retrieval date, allowed uses, required attribution, and verified pixel dimensions. An approved Amazon integration instead needs the relevant Associate/Creators API credentials and exact ASIN mapping; Amazon image URLs must remain remote and be refreshed under the applicable program rules.
