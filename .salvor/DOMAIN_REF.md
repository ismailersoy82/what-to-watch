# WhatToWatch Domain Reference

Authoritative current-truth for domain logic. Artifacts in `.salvor/domain-learnings/` are frozen audit trails; this file is
what's currently true.

## Sections

### Item model (src/store.js)
`{ id: "<source>:<id>", kind: series|film, title, year, image, genres[], url, source, status: want|watching|done,
rating: null|1–10, notes, addedAt, updatedAt }`. Sources: `tvmaze:` (series), `manual:` (user-entered), `tmdb:` (planned).
Backups merge by id, newest `updatedAt` wins (`DEC:backup-merge-newest-wins`).

### Sources
- TVmaze: no key, CORS, ~20 calls/10 s, CC BY-SA → credit + link (`DL:tvmaze-terms`). Actor → series via
  `/search/people` + `/people/:id/castcredits?embed=show` (one entry per show, all character names).
- TMDB (planned): films and actor → films; user-supplied key, browser-only.

## Learned Failures (LF:)
[One entry per failure mode, headed `### LF:<kebab-slug> (YYYY-MM-DD)`, opening with the structured header — Subject /
Claim / Evidence date / Status (RULES §10.1) — then root cause, fix sites, and a cross-link to the dated artifact in
`.salvor/domain-learnings/`. Update existing entries when a v1 fix is upgraded to v2 (RULES §6.9). Never two
contradictory `Status: live` entries — resolve per RULES §10.4.]
