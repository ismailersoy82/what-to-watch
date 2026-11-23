# WhatToWatch
### CURRENT STATE (L1 Cache)
@.salvor/active_state.md

> For deep historical context, architecture logs, or context recovery: `.salvor/active_state_verbose.md`

## Project Overview
WhatToWatch is a personal film and series watchlist that runs entirely in the browser (static site on GitHub Pages).
Users search a title, add it to their list, and track status, rating and notes; data lives in the browser's
localStorage with JSON export/import as the backup and the way to move between devices. Series metadata comes from
TVmaze (no key); film metadata from TMDB using an API key the user enters in the app. The dominant non-obvious
constraint: **no secret ever enters the repository** — the TMDB key is user-supplied and stored only client-side, and
the app must stay usable (manual entry) without it.

## Architecture

| Component | Stack | Spoke |
|-----------|-------|-------|
| root | Static HTML/CSS/vanilla JS (ES modules) in `src/` | @src/CLAUDE.md |

## Documentation Map

| Document | Purpose | When to Read |
|----------|---------|-------------|
| `.salvor/DOMAIN_REF.md` | Domain logic, business rules, learned failures | Changing core logic |
| `.salvor/INFRA.md` | Running, env vars, deployment, external APIs | Changing infra/deployment/APIs |
| `.salvor/DEFERRED_TODOS.md` | Deferred findings (out-of-scope, not yet fixed) | Before starting related work |
| `.salvor/decisions/` | Design decisions + load-bearing invariants (why it's this way, what must stay) | Before changing/refactoring anything non-trivial |
| `src/CLAUDE.md` | App architecture and key files | Working in src/ |

## APP_NAME
Configurable via `APP_NAME`; default `WhatToWatch`. With Strict defaults enabled (RULES §4.4) never hardcode it —
read it from one constant in `src/config.js`.

### SYSTEM DIRECTIVE: TWO-TIER MEMORY MANAGEMENT
You maintain two memory ledgers: `.salvor/active_state.md` (L1 Cache — Concise) and `.salvor/active_state_verbose.md`
(L2 Cache — Deep Memory).

**L1 — active_state.md (Concise)**
- **Role:** Primary context for every session. Auto-loaded via `@` import (Claude Code) or read first (other CLIs).
- **Content:** Final confirmed logic, active deltas vs published behavior, infra status, and "Learned Failures."
- **Constraints:** MAXIMUM 50 LINES. Dense technical shorthand; non-standard abbreviations optimal for token density.
- **Update Trigger:** After every confirmed resolution, milestone, or architectural shift.

**L2 — active_state_verbose.md (Deep Archive)**
- **Role:** Curated repository for reasoning, condensed logs, evidence, and rejected hypotheses.
- **Update Trigger:** Immediately after updating L1 — offload the nuance pruned from L1.
- **Constraint:** Detailed but CURATED, never a raw dump — summarize command output; keep evidence, conclusions, and
  commit/test/issue IDs. Rotate: past ~1,500 lines, or at each release milestone, condense the oldest resolved sections
  into brief summaries (keep durable conclusions, drop noise). Do NOT read unless explicitly instructed or during
  Context Recovery (RULES §1).

**Execution Rules:**
- Routine L1/L2 operational-state maintenance is automatic — do not ask permission for these writes. Salvor may update
  concise operational state as work progresses. It must ask before promoting a decision, domain learning, learned
  failure, or deferred finding into the repository's durable shared engineering record.
- On any major learning or infra nuance: update L1 instantly with shorthand and L2 with detail.
- NEVER persist secrets, credentials, PII, or unredacted logs to any memory file (RULES §9). Redact before writing.

### SYSTEM DIRECTIVE: THREE CAPTURE CLASSES (user-gated)
You self-identify knowledge worth persisting durably and ask me, verbatim, before persisting it. Three capture classes
(see `RULES.md` §2 and §7):
1. **Decision / Domain Learning** — a discovery, decision, or design invariant + its *why*. Two subtypes: for a
   deliberate **Design Decision or load-bearing invariant**, ask `"Record this as a design decision? (yes/no)"` →
   `.salvor/decisions/` (with its Invariant & Coupling); for an empirical **Domain Learning**, ask
   `"Save this as a domain learning? (yes/no)"` → `.salvor/domain-learnings/`.
2. **Learned Failure (`LF:<slug>`)** (a structural failure mode) → registered in `.salvor/DOMAIN_REF.md` as part of the above.
3. **Deferred Finding** (an out-of-scope finding surfaced mid-task) → `"Log this to .salvor/DEFERRED_TODOS.md? (yes/no)"`

