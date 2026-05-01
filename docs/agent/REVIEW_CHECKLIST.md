# Review Checklist — `wok.`

Use this before ending a coding session or asking another agent to continue.

## Mechanics

- [ ] Pinch input maps cleanly to burner on/off.
- [ ] Player only moves vertically.
- [ ] Player clamps correctly to ground and ceiling.
- [ ] Player physics values come from `constants.js`.
- [ ] World objects scroll left while player X stays fixed.
- [ ] Collision feels forgiving enough.
- [ ] Death sequence is not an instant cut.

## Communication

- [ ] Loading state explains camera setup.
- [ ] Title screen shows pinch-to-start.
- [ ] Calibration teaches hand → pinch → release.
- [ ] Countdown gives player time before run starts.
- [ ] Hand-lost overlay pauses play.
- [ ] Results screen has clear CTA.
- [ ] Retry prompt is explicit.
- [ ] No state transition is silent.

## Architecture

- [ ] No framework or build step added.
- [ ] Modules match the expected structure.
- [ ] Constants contain all tunables.
- [ ] Rendering is separated from state/game logic.
- [ ] MediaPipe code is isolated in `vision.js` / `gesture.js`.
- [ ] localStorage keys are named consistently.

## Token hygiene

- [ ] `PROGRESS.md` is updated.
- [ ] New decisions are added to the closest relevant doc.
- [ ] The full spec was only opened if needed.
- [ ] Session notes are concise and actionable.

## Phase gate

- [ ] Current phase exit criteria are met.
- [ ] Playtest notes are recorded.
- [ ] Next phase is not started prematurely.
