# Codex prompt — start Phase 1

Use this when starting the first implementation session.

```txt
We are building `wok.`, a vanilla JS Canvas endless runner controlled by webcam pinch.

Read only these files first:
- AGENTS.md
- docs/agent/SHARED_BRIEF.md
- docs/agent/PROGRESS.md
- docs/agent/PHASE_1_CORE.md

Do not load the full wok-spec.md unless a requirement is unclear.

Task: implement Phase 1 only. Build the smallest playable version: MediaPipe webcam setup, one-hand pinch detection, player vertical physics, flame while pinching, scrolling world, zapper obstacles, ingredient circles, collision, death sequence, distance/ingredient HUD, hand-lost pause, and visible overlays for every state transition.

Use vanilla JavaScript, ES modules, Canvas 2D, no build step. Put all tunable values in src/constants.js. Use placeholder shapes only. At the end, update docs/agent/PROGRESS.md with what works, files touched, test steps, and tuning notes.
```
