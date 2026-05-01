# AGENTS.md — Codex startup context for `wok.`

This repo is a browser game called **wok.**: a Malaysian night-market endless runner inspired by Jetpack Joyride. The player pinches fingers on webcam to fire a burner under a wok, rising while pinching and falling when released.

## Token-saving loading rule

Do **not** load the full `wok-spec.md` by default. Start with:

1. `docs/agent/SHARED_BRIEF.md`
2. `docs/agent/PROGRESS.md`
3. The current phase file:
   - Phase 1: `docs/agent/PHASE_1_CORE.md`
   - Phase 2: `docs/agent/PHASE_2_SYSTEMS.md`
   - Phase 3: `docs/agent/PHASE_3_CREATIVE.md`

Only open `wok-spec.md` when a requirement is unclear, missing, or disputed.

## Build role

Codex owns **mechanics-first implementation**.

- Build a functional game before polishing visuals.
- Prioritize reliable input, responsive physics, clear state transitions, and stable 60fps gameplay.
- Use placeholder visuals until Phase 3.
- Do not invent new systems unless requested.
- Do not skip phases.

## Non-negotiables

- Vanilla JavaScript only.
- No framework.
- No build step.
- HTML5 Canvas 2D for rendering.
- MediaPipe Tasks Vision API via CDN.
- Web Audio API for sound.
- Static hosting compatible with Vercel.
- All magic numbers live in `src/constants.js`.
- Game logic must stay modular, matching the file structure in `docs/agent/SHARED_BRIEF.md`.

## Phase gate rule

Phase 1 must ship and be playtested before Phase 2 starts. Phase 2 must ship and be playtested before Phase 3 starts.

When asked to build, first identify the current phase from `docs/agent/PROGRESS.md`. If progress is unclear, inspect the repo briefly and update `PROGRESS.md` with what exists.

## Communication layer rule

The player must always know what is happening, what just happened, and what to do next. Every state transition needs an overlay, prompt, banner, or visible confirmation.

Required state chain:

`LOADING → TITLE → CALIBRATION → COUNTDOWN → PLAY → DEAD → RESULTS → RECIPE_WHEEL → RETRY_PROMPT → COUNTDOWN`

Phase 1 must already include the communication layer, even with placeholder visuals.

## Output behavior

At the end of each coding session:

1. Summarize what changed.
2. List files touched.
3. List how to run/test.
4. Update `docs/agent/PROGRESS.md`.
5. Note any unresolved issues or tuning values.

