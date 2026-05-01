# Phase 2 — Full Systems with Placeholder Visuals

## Goal

Build the complete game loop while keeping visuals simple. The game should be ugly but feature-complete.

Only start this phase after Phase 1 has been playtested and the pinch flight feel is approved.

## In scope

- Three obstacle types: zappers, missiles, steam vents
- First-time obstacle callouts
- Three food-cart vehicles
- Vehicle pickup and eject overlays
- Missions system
- Rank progression
- Distance milestone flashes
- Difficulty curve
- Three-layer parallax placeholders
- Decorative shoppers that scatter
- Recipe wheel
- Score persistence in localStorage
- Results screen with sequenced stat reveal
- Retry prompt with best distance and next mission goal
- Webcam PIP with skeleton overlay
- Sound stubs
- Performance monitoring and visual auto-degrade

## Obstacle additions

### Missiles / scooters

Unlock from 500m.

- Warning icon at right edge before entry.
- Enters from right, moves left faster than world scroll.
- Tracks player Y only at spawn time, then locks trajectory.
- First-ever intro callout: “⚠ Incoming!”

### Steam vents

Unlock from 1000m.

- Anchored to ground or ceiling.
- Cycles inactive → warning → active → inactive.
- Collision only while active.
- First-ever intro callout: “⚠ Watch the steam”.

## Vehicle system

A vehicle token appears in the air. Collecting it clears on-screen obstacles, slows the world briefly, then swaps controls.

### Satay Cart

- Ground vehicle.
- Pinch to jump.
- Release to land.
- Faster scroll speed.

### Kuih Carrier

- Gravity flipper.
- Pinch to flip between floor and ceiling.

### Teh Tarik Pull

- Sine-wave motion.
- Pinch tightens wave.
- Release widens wave.

## Vehicle communication

On every pickup:

- Show vehicle name.
- Show one-line control hint.
- Examples: “Pinch to jump”, “Pinch to flip”, “Pinch to tighten”.

On vehicle hit:

- Destroy vehicle.
- Show “Ejected!”
- Give brief invincibility.
- Return to wok controls.

## Missions

Three active missions at a time.

Categories:

- distance
- ingredients
- near-miss
- vehicle
- height
- consecutive collection
- cumulative collection

Every completed mission is replaced. Every 3 completions triggers rank up.

Mission shape:

```js
{
  id: 'dist_500',
  type: 'distance',
  description: 'Travel 500m in a single run',
  target: 500,
  progress: 0,
  rank: 3,
  completed: false
}
```

Store active missions and rank in localStorage.

## Recipe wheel

Replaces Jetpack Joyride’s slot machine.

- Player earns recipe tokens during run.
- End of run: each token gives one spin.
- Wheel has 8 segments.
- Rewards: bonus ingredients, head start, recipe fragment, double ingredients, extra life.
- Recipes: Nasi Lemak, Char Kway Teow, Roti Canai, Satay, Laksa, Cendol, Mee Goreng, Apam Balik.
- Each recipe has 3 fragments.

## Results sequence

Reveal in order:

1. distance
2. new best label if applicable
3. ingredients count-up
4. completed missions
5. recipe tokens
6. CTA

CTA must always tell the player what pinch does next.

## Difficulty curve

Difficulty rises with distance by increasing:

- scroll speed
- obstacle rate
- obstacle variety
- obstacle combinations
- ingredient pattern complexity

Do not change:

- player physics
- hitbox sizes
- obstacle sizes
- ingredient value

The feeling should be “night market getting busier,” not unfair punishment.

## Performance

Sample FPS. If slow:

1. disable/reduce particles
2. reduce shoppers
3. disable parallax
4. simplify obstacle rendering

Never degrade input, collision, or state logic.

## Exit criteria

Phase 2 is done when:

- All obstacle types work.
- Vehicle controls are understandable and fun.
- Missions motivate replay.
- Recipe wheel works.
- Persistence works.
- Difficulty curve feels fair.
- FPS is stable.
- Communication layer covers every state and event.

Do not begin Phase 3 until this has been playtested.
