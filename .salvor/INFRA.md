# WhatToWatch Infrastructure

Operational reference: running locally, deployment, env vars, external APIs, observability.

## Local
Static site, no build step. Serve the repo root over HTTP (`python3 -m http.server 8000`) and open `http://localhost:8000/`.

## Deployment
GitHub Pages from `main` (to be enabled by the operator). Branch flow feature → dev → main (RULES §11). No secrets in the repo.

## Env vars
None. The TMDB API key is user-supplied at runtime and kept in the browser's localStorage only.

## External APIs
- TVmaze API — series search/details, no auth, ~20 requests / 10 s per IP.
- TMDB API — film search/details, user-supplied key (v3 key or v4 read token), stored client-side only.

## Observability
None (no analytics by design).
