- **ID:** DEC:backup-merge-newest-wins
- **Subject:** store, backup, import, sync
- **Claim:** Importing a backup merges into the current list by item id; the copy with the later `updatedAt` wins; invalid rows are skipped and counted; nothing is deleted.
- **Evidence date:** 2026-11-23
- **Status:** live
- **Contributed-by:** operator-approved

## Context
Lists live in each browser's localStorage. The JSON backup is both the safety copy and the only way to move a list
between devices (phone ↔ computer).

## Decision
`src/store.js` `importJson(state, text)`: validate `app` and `format`; for each row with id, title and a valid
status, keep the newer of (existing, incoming) by ISO `updatedAt`; skip the rest; return `{added, updated, skipped}`,
shown to the user. Every edit (`updateItem`) stamps `updatedAt`.

## Rationale
Two-way manual sync without a server: export on device A, import on B, edit, export back — no item is lost silently,
and the most recent edit survives.

## Invariant
Import never removes items and never overwrites a newer copy. Any new mutating operation must stamp `updatedAt`, or
merges will silently prefer stale copies. Backups from a newer `EXPORT_FORMAT` are refused, not guessed.

## Coupling / blast radius
`src/store.js` (`addItem`, `updateItem`, `exportJson`, `importJson`), `src/config.js` (`EXPORT_FORMAT`), `src/app.js`
(import/export buttons), tests in `src/tests/store.test.mjs`. Deletions do not propagate between devices (known
limitation — would need tombstones).

## Alternatives rejected
- Replace the whole list on import — one wrong file wipes the list.
- Ask per conflict — tedious on a phone for a personal watchlist.
