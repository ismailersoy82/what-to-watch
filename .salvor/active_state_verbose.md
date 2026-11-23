# WhatToWatch Active State — VERBOSE ARCHIVE

L2 cache. Detailed but CURATED deep history of reasoning, rejected hypotheses, and condensed evidence pruned from L1.
Update trigger: immediately after every L1 update. Summarize command output — keep evidence, conclusions, and
commit/test/issue IDs, not raw dumps. Rotation: when this file exceeds ~1,500 lines, or at each release milestone,
condense the oldest resolved sections into brief summaries (keep durable conclusions, drop noise). Never persist
secrets, credentials, PII, or unredacted logs here (RULES §9) — redact before writing.

---

## 2026-11-23 — Project initialized
Initial Salvor scaffold: hub-and-spoke CLAUDE.md, L1/L2 cache, RULES.md §0–§10 (+§11 branch flow), VERSION.md (per-component build counters: ROOT), three capture classes.

Setup answers: project `WhatToWatch`; one component `root` (code in `src/`, static HTML/CSS/vanilla JS); paired paths: none; Strict defaults: YES. Mode: CORE — Serena and GitNexus absent, no MCP responding. Repo empty at setup.

Project intent: personal film + series watchlist. Data in the browser (localStorage) with JSON export/import backup. Series metadata from TVmaze (no key); film metadata from TMDB with an API key the user enters in the app and that is stored only in their browser — never in the repo (RULES §9). Second Salvor field-trial project (first: ismailersoy82/salary-calculator, Core mode) — compare setup and Strict ceremony.

## 2026-11-23 — feat/watchlist-core
- Scope (operator): film + series, browser storage + JSON backup, auto metadata; added actor search. Actor → series
  via TVmaze in this branch; actor → films needs TMDB (next branch).
- Built: config.js (APP_NAME, STORAGE_KEY, EXPORT_FORMAT, STATUSES), store.js (pure add/update/remove/filter,
  export/import merge, safe load/save), sources/tvmaze.js (normalise, searchShows, searchPeople, personShows), app.js
  (TR UI, three modes: Dizi ara / Oyuncu ara / Elle ekle; film hint until TMDB), style.css (light/dark,
  `[hidden]{display:none!important}` from the start), root index.html → src/. Build label read from VERSION.md header.
- Tests: 7/7 node (store + adapter with hand-written fixtures incl. 429/404). Playwright (360/320/1280, TVmaze mocked
  by route): add → badge, status+rating persist across reload, actor → 2 series with roles, manual film, export →
  clear storage → import (2 added), 0 overflow, 0 console errors.
- Captures: DEC:backup-merge-newest-wins, DL:tvmaze-terms (operator-approved).
- Field-trial note: the [hidden] CSS rule was applied pre-emptively because of LF:css-display-overrides-hidden in the
  sibling repo — but that knowledge came from this agent's session memory, not from Salvor (brains are per-repo; a
  fresh agent here would not know it). Cross-repo learning is outside Salvor's model today.
- Brain Reconcile (RULES §0.6/§10.2, pre-PR): origin/dev = b07d4d3 = merge base → no incoming brain changes; nothing to reconcile.
