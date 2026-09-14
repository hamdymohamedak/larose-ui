# Cross-framework behavioral parity matrix

Canonical checklist for skill §18 — every component should eventually have matching
observable behavior across React, Vue, and Svelte.

## Files

- `matrix.json` — generated checklist (`pnpm generate:parity-matrix`)
- Validate with `pnpm check:parity-matrix`

## Status values

| Status | Meaning |
|--------|---------|
| `pass` | Verified (tests / shared logic / known fixed) |
| `partial` | Some frameworks or behaviors covered |
| `unverified` | Exported on all three; behavior not yet proven |
| `fail` | Missing on a required framework or known broken |
| `n/a` | Intentional adapter asymmetry |

## Behaviors tracked

initialState, openClose, keyboard, focus, accessibility, controlledState,
uncontrolledState, events, motion, portal, visual

Contracts in `../components` remain the API source of truth. This matrix tracks
**behavioral** parity, not prop type sampling.
