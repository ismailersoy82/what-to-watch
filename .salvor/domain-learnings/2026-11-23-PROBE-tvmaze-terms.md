- **ID:** DL:tvmaze-terms
- **Subject:** tvmaze, licensing, rate-limit, cors, sources
- **Claim:** TVmaze API needs no key, is CORS-enabled, allows ~20 calls / 10 s per IP (429 beyond), and its data is CC BY-SA — TVmaze must be credited with a link and ShareAlike respected.
- **Evidence date:** 2026-11-23
- **Status:** live
- **Contributed-by:** operator-approved

## Hypothesis
TVmaze can be called directly from a static GitHub Pages site without a key or proxy.

## Evidence
TVmaze API documentation (tvmaze.com/api, read 2026-11-23): all endpoints CORS-enabled; rate limit "at least 20 calls
every 10 seconds per IP", HTTP 429 when exceeded, back off and retry; licence CC BY-SA with attribution by linking back
(API URLs may be used); endpoints used: `/search/shows?q=`, `/search/people?q=`, `/people/:id/castcredits?embed=show`
(embed returns full show objects; `image` is `{medium, original}` or null).

## Verdict
Accepted. Implementation: `src/sources/tvmaze.js` (429 → "rate-limited" message), footer credit + per-item TVmaze link
in `src/index.html` / `src/app.js`. Field shapes beyond `image` are taken from TVmaze's public responses, encoded as
hand-written fixtures in `src/tests/fixtures/tvmaze.mjs` (not recorded live — the dev sandbox has no network).

## Cross-links
INFRA "External APIs"; DOMAIN_REF "Sources".
