# Product image provenance audit

Audit date: 2026-10-30

## Current decision

The repository contains 29 local JPGs under `assets/products/`. Git history and file metadata do not identify their source, rights holder, or license. None of these files is approved for deployment, and the build intentionally excludes the entire `assets/products/` directory.

The application uses the per-product `approvedProductPhotos` registry in `assets/app.js`. A photograph is eligible only when its registry entry records an exact-model asset that has a documented display basis. The registry is currently empty.

## Source review

- Fluval/Hagen: official terms state that site photographs and other content may not be reproduced or publicly displayed without prior written consent. No written consent is recorded.
- EHEIM: official legal information states that published images may not be reproduced or used in other electronic publications without express written consent. No written consent is recorded.
- Seachem, Penn-Plax, Aqueon, and Aquarium Co-Op: no public product-image reuse grant was located for the exact catalog models.
- Amazon: no approved Associates image integration or credentials are configured. Amazon program rules require images to be obtained through an approved program integration and prohibit storing or caching the image itself; the existing local JPGs therefore cannot be treated as approved Amazon assets.
- A Wikimedia Commons photograph depicting an FX6 was located under CC BY-SA 4.0. It is not used because that license requires public attribution and license notice, which is outside the requested interface treatment.

## Uncleared rankable models

- Fluval AC20, AC30, AC50, AC70, and AC110 Power Filters
- Seachem Tidal 35, 55, 75, and 110
- Fluval C2, C3, and C4 Power Filters
- Fluval U3 Underwater Filter
- Fluval 107, 207, 307, and 407
- Fluval FX2, FX4, and FX6
- EHEIM Classic 1500XL 2260 and 2262
- Penn-Plax Cascade 700, 1000, 1200, and 1500
- Aqueon QuietFlow Canister 200
- Aquarium Co-Op Easy Flow Sponge Filter

The orphaned `cascadeMax.jpg` is also uncleared, but Cascade Max-Flow is not rankable because its manufacturer-confirmed upper capacity remains unavailable.

## Evidence required to approve a photograph

Each enabled model needs an exact-model source URL or original file, rights holder, written permission or applicable license, retrieval date, allowed uses, required attribution, and verified pixel dimensions. An approved Amazon integration instead needs the relevant Associate/Creators API credentials and exact ASIN mapping; Amazon image URLs must remain remote and be refreshed under the applicable program rules.
