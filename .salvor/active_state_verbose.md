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
