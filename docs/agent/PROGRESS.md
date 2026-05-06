# Progress Log — `wok.`

Use this file to reduce token usage across coding sessions. Update it at the end of every session so the next agent does not need to reread chat history.

## Current phase

Phase 1 — core flight + obstacles

## Current status

- First playable Phase 1 scaffold now exists.
- Browser app is static-host ready: `index.html`, `styles.css`, and modular ES modules under `src/`.
- Core loop implemented:
  - webcam boot + explicit enable / retry camera control
  - MediaPipe Hand Landmarker setup via CDN bundle
  - pinch detection with hysteresis
  - required state chain through `RETRY_PROMPT`
  - calibration overlay flow
  - countdown into play
  - vertical burner flight with soft thrust ramp
  - scrolling background / ground placeholders
  - zapper spawn + movement
  - ingredient pattern spawn + collection
  - hand-lost pause overlay
  - death tumble / slide sequence
  - results and retry loop
  - webcam panel with hand skeleton overlay
- Not yet playtested end-to-end on an actual camera session.
- Deployment hardening added for remote hosting:
  - explicit user-triggered camera startup
  - clearer secure-context / permission / missing-camera error messages
  - boot overlay now remains visible until camera startup succeeds
  - clicking the boot overlay or canvas can also trigger camera startup

## Last completed work

- Bootstrapped the Phase 1 game from an empty repo.
- Chose a mechanics-first module split aligned with the shared brief.
- Wired the first playable state machine and placeholder rendering pass.
- Eased Phase 1 difficulty after first playtest feedback: slower speed curve, later first zapper, wider obstacle spacing, shorter early zappers, and stronger upward control.
- Hardened camera startup for deployed environments like Vercel by moving to an explicit enable-camera action instead of auto-requesting on page load.
- Tuned control and readability after more playtest feedback: reduced upward rocket effect, raised obstacle/ingredient lanes, and added a burner meter to the HUD.
- After another round of feedback, reduced vertical burst again and moved the burner/fuel meter to a larger right-side HUD position.

## Files created / touched

- `index.html`
- `styles.css`
- `src/constants.js`
- `src/config.js`
- `src/states.js`
- `src/gesture.js`
- `src/webcam.js`
- `src/vision.js`
- `src/player.js`
- `src/physics.js`
- `src/obstacles.js`
- `src/ingredients.js`
- `src/collision.js`
- `src/perf.js`
- `src/hud.js`
- `src/overlays.js`
- `src/render.js`
- `src/main.js`
- `docs/agent/PROGRESS.md`

## Known decisions

- Game title: `wok.` for now.
- Input: one-hand pinch.
- Tech: vanilla JS, Canvas 2D, MediaPipe Tasks Vision API, no build step.
- Phase 1 must prove flight feel before Phase 2 begins.
- Claude and Codex should not load the full spec by default.
- Burner thrust uses a short ramp-in / ramp-out rather than binary on/off, to match the Phase 1 feel guidance.

## Open questions

- Is the `sling` codebase available anywhere for parity-checking pinch behavior?
- Has the Figma mood board for Phase 3 been created?
- Which hosting folder should Vercel serve from if repo contains multiple games?
- Do we want a keyboard-only local debug flag for non-camera testing, or should this stay camera-only?

## Manual test notes

Add playtest findings here:

- Pinch responsiveness: pending
- Thrust/gravity feel: pending
- Obstacle fairness: first player feedback said the build was too difficult; eased the early game and obstacle cadence
- Obstacle/ingredient placement: some patterns and hazards were sitting too close to the ground; raised their lane ranges
- Hand-lost pause reliability: pending
- FPS: pending
- Confusing UI moments: pending

## Tuning notes

Track tuning changes here:

| Value | Current | Notes |
|---|---:|---|
| GRAVITY | 0.44 | firmer fall to further reduce floaty upward burst |
| THRUST | -0.66 | reduced lift again after more playtest feedback |
| TERMINAL_VELOCITY_DOWN | 8 | slightly softer drop speed |
| TERMINAL_VELOCITY_UP | -5.2 | much lower ceiling on upward burst speed |
| PINCH_THRESHOLD | 45 | initial spec |
| PINCH_HYSTERESIS | 12 | initial spec |
| BASE_SCROLL_SPEED | 3.4 | lowered opening pace |
| MAX_SCROLL_SPEED | 7.2 | softened top-end difficulty |
| SPEED_RAMP_DISTANCE | 9000 | much slower speed ramp |
| PLAYER_THRUST_RAMP_UP | 0.11 | softer burner pickup for finer altitude control |
| PLAYER_THRUST_RAMP_DOWN | 0.09 | smoother burner decay after release |
| ZAPPER_FIRST_SPAWN_DISTANCE | 760 | larger opening grace window |
| ZAPPER_MIN_SPACING_EASY | 520 | easier early obstacle cadence |
| ZAPPER_MAX_SPACING_EASY | 760 | easier early obstacle cadence |
| ZAPPER_MIN_SPACING_HARD | 360 | later-game cadence floor |
| ZAPPER_MAX_SPACING_HARD | 560 | later-game cadence ceiling |
| ZAPPER_MIN_LENGTH_EASY | 140 | shorter early hazards |
| ZAPPER_MAX_LENGTH_EASY | 210 | shorter early hazards |
| ZAPPER_COLLISION_PAD | 6 | more forgiving hitbox |
| ZAPPER_MIN_CENTER_Y | 130 | raised lower obstacle band |
| ZAPPER_MAX_CENTER_Y | 430 | removed very low hazard placements |
| INGREDIENT_MIN_Y | 150 | keeps ingredient lanes away from the floor |
| INGREDIENT_MAX_Y | 510 | keeps ingredient lanes above the ground strip |
