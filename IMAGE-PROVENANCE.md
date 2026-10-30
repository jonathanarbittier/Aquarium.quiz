# Product image provenance audit

Audit date: 2026-10-29

The repository contains 29 local product JPGs under `assets/products/`. Git history records when they were added and later compressed, but it contains no source URLs, license files, purchase receipts, permission emails, or attribution records for any of them. File metadata does not establish a rights holder.

Because provenance is undocumented:

- Every file in `assets/products/*.jpg` is flagged **permission not documented**.
- It is not possible from repository evidence to identify which files, if any, were downloaded from Amazon. Any image obtained from an Amazon product page must be treated as Amazon-derived and must not be assumed licensed for independent reuse.
- Public accessibility of an image is not evidence of reuse permission.
- `assets/config.js` keeps `productImageUsageEnabled: false`, so the live interface uses the repository’s generic filter-format SVG illustrations instead.

## Files requiring source and permission records

`107.jpg`, `207.jpg`, `307.jpg`, `407.jpg`, `ac110.jpg`, `ac20.jpg`, `ac30.jpg`, `ac50.jpg`, `ac70.jpg`, `aqueon200.jpg`, `c2.jpg`, `c3.jpg`, `c4.jpg`, `cascade1000.jpg`, `cascade1200.jpg`, `cascade1500.jpg`, `cascade700.jpg`, `cascadeMax.jpg`, `eheim2260.jpg`, `eheim2262.jpg`, `fx2.jpg`, `fx4.jpg`, `fx6.jpg`, `sponge.jpg`, `tidal110.jpg`, `tidal35.jpg`, `tidal55.jpg`, `tidal75.jpg`, `u3.jpg`.

For each image the owner wants to enable, record the original source URL, rights holder, permission/license basis, retrieval date, allowed uses, and any required attribution. Enable product photos only after every displayed file has a documented basis.
