# Shared Brief — `wok.`

## One-line concept

**A night-market endless runner. Pinch to fire the burner. Fly the wok.**

The player is a street-food chef riding a wok strapped to a gas burner. Pinch thumb + index finger on webcam to fire the burner and rise. Release to fall. Dodge night-market hazards, collect ingredients, ride food carts, complete missions, and spin a recipe wheel after each run.

## Product family

- `bowl` = Fruit Ninja sibling
- `sling` = Angry Birds sibling
- `wok.` = Jetpack Joyride sibling
- Shared tech: MediaPipe Tasks Vision API and pinch detection from `sling`

## World

Late-evening Malaysian night market. Side-scrolling street corridor with stalls on both sides, parallax depth, tungsten bulbs, neon signage, steam, wet pavement reflections, market chatter, cooking sounds, motorbike energy.

The game should feel warm, loose, lively, and specific — not generic “Asian,” not cyberpunk, not sterile arcade sci-fi.

## Core input

Only one hand is needed.

- Pinch = burner on = player rises
- Release = burner off = player falls
- Hand lost during play for more than threshold = pause and show recovery overlay

Gesture functions copied from `sling`:

```js
isPinching(): boolean
getPinchDistance(): number
```

## Tech stack

- Vanilla JavaScript
- ES modules
- No framework
- No bundler/build step
- HTML5 Canvas 2D
- MediaPipe Tasks Vision API via CDN, not legacy `@mediapipe/hands`
- Web Audio API
- Static hosting / Vercel-ready

## Target repo structure

```txt
wok/
├── index.html
├── styles.css
├── assets/
│   ├── ingredients/
│   ├── obstacles/
│   ├── vehicles/
│   ├── backgrounds/
│   └── sounds/
├── src/
│   ├── main.js
│   ├── constants.js
│   ├── config.js
│   ├── vision.js
│   ├── gesture.js
│   ├── player.js
│   ├── flame.js
│   ├── scrolling.js
│   ├── obstacles.js
│   ├── ingredients.js
│   ├── vehicles.js
│   ├── missions.js
│   ├── shoppers.js
│   ├── collision.js
│   ├── physics.js
│   ├── render.js
│   ├── particles.js
│   ├── hud.js
│   ├── audio.js
│   ├── states.js
│   ├── overlays.js
│   ├── recipe-wheel.js
│   ├── webcam.js
│   └── perf.js
└── docs/agent/
```

## Required state machine

```txt
LOADING → TITLE → CALIBRATION → COUNTDOWN → PLAY → DEAD → RESULTS → RECIPE_WHEEL → RETRY_PROMPT → COUNTDOWN → PLAY
```

Every state transition needs visible communication.

## Visual placeholder policy

Phase 1 and Phase 2 use simple geometry only. Do not make visual-polish decisions early.

| Element | Placeholder |
|---|---|
| Player | yellow rectangle |
| Flame | orange rectangle below player |
| Zappers | red bars with end caps |
| Missiles | dark rectangle + triangle nose |
| Steam | blue/white pulsing rectangle |
| Ingredients | small green circles |
| Vehicle token | spinning white circle |
| Shoppers | small gray rectangles |
| Ground | dark gray strip |
| Background | dark blue fill |

## Permanent anti-patterns

Do not add:

- sterile lab / sci-fi aesthetic
- chibi/cartoon character style
- cyberpunk/synthwave palette
- dark serious tone
- cluttered HUD
- slot machine end screen
- microtransaction/store UI
- paper lanterns, lucky cats, dragon motifs, or generic “Asian” decoration

## Phase discipline

Phase 1 = core flight and communication layer.  
Phase 2 = full systems with placeholders.  
Phase 3 = final art, motion, sound, and Figma-driven polish.

Do not skip ahead.
