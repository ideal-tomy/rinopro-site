# Phase 2 Chunk Map (2026-04-16)

## Source
- `.next/build-manifest.json` `rootMainFiles`
- `next experimental-analyze --no-mangling --output`
- `.next/static/chunks` size scan

## Root Main (Initial) Chunks
- `static/chunks/0p0gjbj1_.a52.js` - 203,387 bytes
- `static/chunks/0-ey3wj7fa2v1.js` - 137,477 bytes
- `static/chunks/08.vh83cqgbk3.js` - 44,017 bytes
- `static/chunks/0bc_ekfqju81-.js` - 31,379 bytes
- `static/chunks/0s4ag~o7j~3fu.js` - 24,142 bytes

## Signals from Analyzer/Chunk Scan
- `@radix-ui/react-dialog` signatures were found in multiple emitted chunks.
- `lucide-react` signatures were found in multiple emitted chunks.
- Heavy root main JS is concentrated in two top shared chunks (`0p0...` / `0-ey...`).

## Priority Decision
1. Remove icon-library imports from always-mounted UI (`Header`, `Chat FAB`, `Sheet close`).
2. Keep `MobileNav` dynamic and only mount on user action.
3. Re-run Lighthouse and compare `main-thread work`, `TBT`, `JS execution`.
