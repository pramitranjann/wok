# Phase 1 — Core Flight + Obstacles

## Goal

Prove the core mechanic: **pinch-to-fly feels responsive and fun in an endless runner.**

This phase ships an ugly but playable game. Do not polish visuals. Do not build full systems yet.

## In scope

- Webcam + MediaPipe hand tracking, copied/adapted from `sling`
- One-hand pinch detection
- Player fixed on X axis, moving only vertically
- Pinch = thrust upward
- Release = gravity downward
- Flame appears while pinching
- Ground running when player is at floor level
- Simple scrolling background
- Zapper obstacles only
- Ingredient circles in basic patterns
- Collision detection
- Death sequence: hit flash → tumble → slide → stop → results
- Distance counter
- Ingredient counter
- Webcam PIP in lower corner
- Hand-lost pause overlay
- Restart via pinch after results
- 60fps loop target
- Full communication layer from the first playable build

## Out of scope

- Missiles
- Steam vents
- Vehicles / food carts
- Missions
- Recipe wheel logic beyond placeholder routing
- Parallax art
- Shoppers
- Sound beyond optional stubs
- Final visual design

## Required state chain

```txt
LOADING → TITLE → CALIBRATION → COUNTDOWN → PLAY → DEAD → RESULTS → RETRY_PROMPT → COUNTDOWN
```

`RECIPE_WHEEL` can be stubbed or skipped in Phase 1 if no tokens exist, but the state structure should allow adding it later.

## Communication requirements

### LOADING
Show logo/title and “Loading camera...” with pulsing indicator.

If camera fails, show “Camera access needed to play” and a retry control.

### TITLE
Show title `wok.`. Show live webcam feed + hand skeleton if available. Prompt: “Pinch to start”.

### CALIBRATION
Sequential overlay:

1. “Show your hand”
2. “Pinch and hold” for sustained pinch
3. “Release”
4. “You’re ready”

If hand is lost, return to step 1.

### COUNTDOWN
Show `3 → 2 → 1 → GO!` before gameplay begins.

### PLAY
Show distance, ingredients, and webcam PIP. If no pinch in first 2 seconds on first run, show “Pinch to fly ↑”. If hand lost for more than threshold, pause and show “Hand lost — show your hand to continue.”

### DEAD
Do not cut instantly. Show hit flash, tumble, slide, stop, then overlay.

### RESULTS
Reveal distance, ingredients, and CTA in sequence. CTA must say what pinch will do next.

### RETRY_PROMPT
Show “Pinch to go again”, best distance, and optional next goal.

## Physics feel

The original feel is not instant lift. Burner thrust should feel like gas ignition: tiny delay, then steady lift. Release should feel like cutting gas: graceful arc down, not instant drop.

Core update logic:

```js
if (pinching && player.alive) {
  player.vy += THRUST;
  player.vy = Math.max(player.vy, TERMINAL_VELOCITY_UP);
  flame.active = true;
} else {
  player.vy += GRAVITY;
  player.vy = Math.min(player.vy, TERMINAL_VELOCITY_DOWN);
  flame.active = false;
}

player.y += player.vy;
```

Clamp to ceiling and ground. At ground, velocity becomes 0 and state becomes `running`; otherwise state is `flying`.

## Starting constants

Put all tuning values in `src/constants.js`. No magic numbers in modules.

Important values:

```js
CANVAS_W: 1280
CANVAS_H: 720
GROUND_Y: 660
CEILING_Y: 40
PLAYER_W: 48
PLAYER_H: 64
PLAYER_START_X: 180
GRAVITY: 0.45
THRUST: -0.8
TERMINAL_VELOCITY_DOWN: 9
TERMINAL_VELOCITY_UP: -7
BASE_SCROLL_SPEED: 4
MAX_SCROLL_SPEED: 10
SPEED_RAMP_DISTANCE: 5000
PINCH_THRESHOLD: 45
PINCH_HYSTERESIS: 12
MEDIAPIPE_MAX_HANDS: 1
HAND_LOST_THRESHOLD_MS: 500
```

## Zappers

- Spawn offscreen right.
- Scroll left with world.
- Angles allowed: 0°, 45°, 90°, 135°.
- Must leave a passable gap.
- Phase 1 collision can be forgiving AABB; upgrade later if needed.

## Ingredients

- Small collectible circles.
- Cosmetic type not required yet.
- Spawn in simple line, arc, grid, or zigzag patterns.
- Avoid spawning directly inside obstacles.
- On collect: increment counter and remove.

## Exit criteria

Phase 1 is done when:

- Pinch-to-fly is responsive.
- Dodging zappers is playable and fun.
- Collecting ingredients works.
- Death and restart loop works.
- All states communicate clearly.
- Hand-lost pause works.
- FPS stays above 50 on a normal laptop.

Do not begin Phase 2 until this has been playtested.
