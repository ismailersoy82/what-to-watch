# root (src/) — WhatToWatch browser app

Static HTML/CSS/vanilla JavaScript (ES modules), no build step, no framework. Entry point `src/index.html` (root `index.html` redirects there).
External systems: TVmaze API (series, no auth), TMDB API (films, user-supplied key). Storage: localStorage.

## Key Files
- `index.html` / `app.js` / `style.css` — TR UI: search modes (Dizi ara / Oyuncu ara / Elle ekle), list with
  status/rating/notes, filters, backup buttons, TVmaze credit
- `config.js` — APP_NAME, STORAGE_KEY, EXPORT_FORMAT, STATUSES (single source)
- `store.js` — pure list model + localStorage + backup merge (`DEC:backup-merge-newest-wins`)
- `sources/tvmaze.js` — series search, people search, person → series (`DL:tvmaze-terms`)
- `tests/` — `node --test src/tests/*.test.mjs`; `fixtures/tvmaze.mjs` hand-written in TVmaze's response shape

## Architecture Notes
- Never commit an API key, token or personal list data; the TMDB key lives only in the user's localStorage.
- Adapters normalise to one item shape so the list never depends on a provider's raw format.
- The app must work with no TMDB key (manual film entry) and offline for already-saved items.

## Build
- No build step. Build ID: `VERSION.md` → `ROOT:XX`, exposed to the UI by reading `VERSION.md`'s JSON header
  (never hardcoded).

For domain logic: see `.salvor/DOMAIN_REF.md`. For infra/ops: see `.salvor/INFRA.md`.
