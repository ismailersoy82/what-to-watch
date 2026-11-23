# root (src/) — WhatToWatch browser app

Static HTML/CSS/vanilla JavaScript (ES modules), no build step, no framework. Entry point `src/index.html` (planned).
External systems: TVmaze API (series, no auth), TMDB API (films, user-supplied key). Storage: localStorage.

## Key Files
- `index.html` — app shell (planned)
- `store.js` — list model, localStorage persistence, JSON export/import (planned)
- `sources/` — TVmaze and TMDB adapters returning one normalised item shape (planned)
- `tests/` — Node `--test` unit tests for store and adapters with recorded fixtures (planned)

## Architecture Notes
- Never commit an API key, token or personal list data; the TMDB key lives only in the user's localStorage.
- Adapters normalise to one item shape so the list never depends on a provider's raw format.
- The app must work with no TMDB key (manual film entry) and offline for already-saved items.

## Build
- No build step. Build ID: `VERSION.md` → `ROOT:XX`, exposed to the UI by reading `VERSION.md`'s JSON header
  (never hardcoded).

For domain logic: see `.salvor/DOMAIN_REF.md`. For infra/ops: see `.salvor/INFRA.md`.
