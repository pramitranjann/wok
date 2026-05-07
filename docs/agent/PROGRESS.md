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
- Fixed the burner meter rendering regression by switching the fill/track to a path-safe bar renderer and reduced vertical burst again.
- Replaced the burner-output meter with a real fuel-remaining mechanic: fuel now drains while pinching, recharges while released, and the HUD shows remaining percentage.
- Tightened obstacle collision and updated copy so hazard deaths no longer read like fuel depletion.
- Updated the reserve HUD to show the actual tank value (`current/100`) instead of a percentage only.
- Reworked zapper spawning toward Jetpack Joyride-style readability: curated lane-based formations, fewer early diagonals, and more spacing between obstacle groups.
- Changed the run loop to three lives with mid-run recovery, and made reserve depletion cut burner thrust immediately instead of allowing extra lift from leftover thrust decay.
- Removed reserve as a gameplay constraint and removed its HUD panel so the run now matches Jetpack Joyride more closely: unlimited burner control, hazards, and three lives.
- Adjusted life-loss recovery so a hazard no longer soft-resets the run: the same session now continues in-place with the collided zapper removed and a short invulnerability window.
- Tightened life-loss recovery again so non-final hits preserve the current motion feel instead of snapping the wok into a recovery pose.
- Moved non-final life-loss feedback out of a separate play banner and into a pulsing HUD lives capsule so the run reads as one continuous screen.
- Reworked the HUD lives capsule from a small numeric readout to three explicit life pips so each life loss is obvious without introducing a new screen.
- Made ingredient runs more collectible by favoring simpler early patterns, shrinking vertical swings, enlarging pickups, and spawning ingredient groups earlier ahead of hazards.
- Reduced camera/vision load by sampling hand detection at about 30 Hz and lowering default camera capture resolution so FPS stays closer to the intended feel.

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
- Obstacle readability: shifted from fully random zappers to curated formations with intentional safe lanes
- Obstacle/ingredient placement: some patterns and hazards were sitting too close to the ground; raised their lane ranges, then made ingredient patterns flatter and easier to meet on the safe lane
- Collision fairness: tightened the player hitbox after feedback that obstacle hits were reading too large
- Hand-lost pause reliability: pending
- FPS: player reported drops to ~24; reduced camera resolution and vision sampling rate to cut MediaPipe load
- Confusing UI moments: three lives now carry the recovery loop; reserve UI/mechanic removed to avoid mixed signals, and non-final hits now signal through HUD with visible life pips instead of a banner-like pseudo-screen

## Tuning notes

Track tuning changes here:

| Value | Current | Notes |
|---|---:|---|
| GRAVITY | 0.35 | current fall strength |
| THRUST | -0.56 | reduced lift again after HUD/control regression pass |
| TERMINAL_VELOCITY_DOWN | 8 | slightly softer drop speed |
| TERMINAL_VELOCITY_UP | -4.5 | lower ceiling on upward burst speed again |
| PINCH_THRESHOLD | 45 | initial spec |
| PINCH_HYSTERESIS | 12 | initial spec |
| BASE_SCROLL_SPEED | 3.4 | lowered opening pace |
| MAX_SCROLL_SPEED | 7.2 | softened top-end difficulty |
| SPEED_RAMP_DISTANCE | 9000 | much slower speed ramp |
| PLAYER_THRUST_RAMP_UP | 0.12 | current burner pickup speed |
| PLAYER_THRUST_RAMP_DOWN | 0.08 | smooth burner decay after release |
| PLAYER_LIVES_MAX | 3 | allows two recoveries before final death |
| PLAYER_RESPAWN_INVULNERABLE_MS | 1050 | short grace window after losing a life |
| PLAYER_RESPAWN_ZAPPER_GAP | 520 | clears space before the next hazard after a life loss |
| ZAPPER_FIRST_SPAWN_DISTANCE | 760 | larger opening grace window |
| ZAPPER_MIN_SPACING_EASY | 640 | more time to read early formations |
| ZAPPER_MAX_SPACING_EASY | 900 | more time to read early formations |
| ZAPPER_MIN_SPACING_HARD | 440 | later-game cadence floor |
| ZAPPER_MAX_SPACING_HARD | 680 | later-game cadence ceiling |
| ZAPPER_MIN_LENGTH_EASY | 140 | shorter early hazards |
| ZAPPER_MAX_LENGTH_EASY | 210 | shorter early hazards |
| ZAPPER_COLLISION_PAD | 6 | more forgiving hitbox |
| ZAPPER_MIN_CENTER_Y | 130 | raised lower obstacle band |
| ZAPPER_MAX_CENTER_Y | 430 | removed very low hazard placements |
| VISION_SAMPLE_MS | 33 | caps hand inference near 30 Hz instead of every render frame |
| INGREDIENT_RADIUS | 12 | larger pickups for easier collection |
| INGREDIENT_PATTERN_SPACING | 34 | tighter groups are easier to sweep through |
| INGREDIENT_ARC_HEIGHT | 30 | flatter arcs keep pickups closer to the intended lane |
| INGREDIENT_ZIGZAG_STEP | 18 | gentler zigzags reduce forced vertical movement |
| INGREDIENT_PATTERN_COUNT | 5 | shorter runs are easier to complete |
| INGREDIENT_PATTERN_GRID_COLS | 3 | smaller grids are less punishing |
| INGREDIENT_PICKUP_PAD | 12 | more forgiving collection radius |
| INGREDIENT_MIN_Y | 150 | keeps ingredient lanes away from the floor |
| INGREDIENT_MAX_Y | 510 | keeps ingredient lanes above the ground strip |
