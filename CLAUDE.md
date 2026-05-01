# CLAUDE.md — Claude Code startup context for `wok.`

This repo is **wok.**, a webcam-controlled night-market endless runner. The player pinches fingers to fire a gas burner under a wok, flying upward through a Malaysian pasar malam. Release pinch and gravity pulls the player down.

## Token-saving loading rule

Do **not** read the full `wok-spec.md` unless necessary. Start every session with:

1. `docs/agent/SHARED_BRIEF.md`
2. `docs/agent/PROGRESS.md`
3. The current phase file:
   - Mechanics: `docs/agent/PHASE_1_CORE.md`
   - Systems: `docs/agent/PHASE_2_SYSTEMS.md`
   - Visual/sound polish: `docs/agent/PHASE_3_CREATIVE.md`

Only open `wok-spec.md` for deeper details when a decision is unclear.

## Claude Code role

Claude Code owns **implementation polish, refactors, UI clarity, motion, feel, and Phase 3 creative execution**.

For Phase 1 and Phase 2, preserve the mechanics-first approach. Do not over-style placeholders. For Phase 3, apply the final visual language from Figma/assets once the mood board is locked.

## Design direction

The world is a Malaysian night market at 10pm:

- Deep indigo sky, tungsten bulbs, wet pavement, warm steam, food-stall chaos.
- Neon exists, but it is not cyberpunk or synthwave.
- The flame is the visual hero.
- The tone is warm, alive, and slightly chaotic — never sterile or serious.

Avoid:

- sterile lab / sci-fi
- chibi/cartoon character language
- generic “Asian” decoration
- paper lanterns, lucky cats, dragons
- dark moody seriousness
- cluttered HUDs
- microtransaction/store patterns

## Implementation rules

- Vanilla JavaScript only.
- No build step.
- Canvas 2D.
- MediaPipe Tasks Vision API via CDN.
- Web Audio API.
- All tuning values in `src/constants.js`.
- Keep logic modular.
- Keep placeholder visuals simple until Phase 3.

## Player communication rule

Never leave the player confused. Every state transition needs clear visible text or feedback. Required state chain:

`LOADING → TITLE → CALIBRATION → COUNTDOWN → PLAY → DEAD → RESULTS → RECIPE_WHEEL → RETRY_PROMPT → COUNTDOWN`

During play, banners and milestone flashes are non-blocking. Hand-lost overlay pauses gameplay. Results and retry prompts block until pinch input.

## Session wrap-up

Before ending a session:

1. Update `docs/agent/PROGRESS.md`.
2. Mention which phase is now active.
3. List files changed.
4. List what should be tested manually.
5. Leave tuning notes for the next session.

