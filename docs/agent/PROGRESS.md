# Progress Log — `wok.`

Use this file to reduce token usage across coding sessions. Update it at the end of every session so the next agent does not need to reread chat history.

## Current phase

Phase 0 — planning / repo setup

## Current status

- Full spec exists in `wok-spec.md`.
- Agent startup files exist:
  - `AGENTS.md`
  - `CLAUDE.md`
  - `docs/agent/SHARED_BRIEF.md`
  - phase briefs in `docs/agent/`
- Implementation not started yet unless updated below.

## Last completed work

- None yet.

## Files created / touched

- None yet.

## Known decisions

- Game title: `wok.` for now.
- Input: one-hand pinch.
- Tech: vanilla JS, Canvas 2D, MediaPipe Tasks Vision API, no build step.
- Phase 1 must prove flight feel before Phase 2 begins.
- Claude and Codex should not load the full spec by default.

## Open questions

- Is the `sling` codebase available in this repo, or should MediaPipe/pinch be rebuilt from scratch?
- Has the Figma mood board for Phase 3 been created?
- Which hosting folder should Vercel serve from if repo contains multiple games?

## Manual test notes

Add playtest findings here:

- Pinch responsiveness:
- Thrust/gravity feel:
- Obstacle fairness:
- Hand-lost pause reliability:
- FPS:
- Confusing UI moments:

## Tuning notes

Track tuning changes here:

| Value | Current | Notes |
|---|---:|---|
| GRAVITY | 0.45 | initial spec |
| THRUST | -0.8 | initial spec |
| TERMINAL_VELOCITY_DOWN | 9 | initial spec |
| TERMINAL_VELOCITY_UP | -7 | initial spec |
| PINCH_THRESHOLD | 45 | initial spec |
| PINCH_HYSTERESIS | 12 | initial spec |
