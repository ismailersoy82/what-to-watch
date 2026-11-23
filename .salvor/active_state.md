# WhatToWatch Active State — ROOT:02 (2026-11-23)
## Architecture: single static component (src/: HTML/CSS/vanilla JS); no backend; data in localStorage + JSON export/import
## Pipeline: search title → TVmaze (series) / TMDB (films, user key) → add to list → status/rating/notes → export backup
## DEPLOYED: not yet (GitHub Pages from main planned)
## ON dev (ROOT:02, PR #1 merged 752dde8, branch deleted): src/{index.html,app.js,store.js,config.js,style.css,sources/tvmaze.js}; series search + actor→series (TVmaze), manual add (film/series), status/rating/notes, filters, JSON backup merge (DEC:backup-merge-newest-wins); 7/7 unit tests; Playwright 360/320/1280 w/ mocked TVmaze: 0 overflow, 0 errors
## Current Delta to Published Logic: none — scaffold only
## LEARNED FAILURES: none yet
## Open: promote dev → main + enable Pages (operator); next feat/tmdb (film search + actor→films, key in settings); Pages on main after first dev→main promotion
## Last Brain Audit: 2026-11-23 (interval 3d — RULES §10.3)
