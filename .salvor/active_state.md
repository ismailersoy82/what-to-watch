# WhatToWatch Active State — ROOT:01 (2026-11-23)
## Architecture: single static component (src/: HTML/CSS/vanilla JS); no backend; data in localStorage + JSON export/import
## Pipeline: search title → TVmaze (series) / TMDB (films, user key) → add to list → status/rating/notes → export backup
## DEPLOYED: not yet (GitHub Pages from main planned)
## BRANCH feat/watchlist-core (ROOT:pending): src/{index.html,app.js,store.js,config.js,style.css,sources/tvmaze.js}; series search + actor→series (TVmaze), manual add (film/series), status/rating/notes, filters, JSON backup merge (DEC:backup-merge-newest-wins); 7/7 unit tests; Playwright 360/320/1280 w/ mocked TVmaze: 0 overflow, 0 errors
## Current Delta to Published Logic: none — scaffold only
## LEARNED FAILURES: none yet
## Open: PR feat/watchlist-core → dev (operator merges); next feat/tmdb (film search + actor→films, key in settings); Pages on main after first dev→main promotion
## Last Brain Audit: 2026-11-23 (interval 3d — RULES §10.3)
