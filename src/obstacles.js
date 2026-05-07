import {
  CANVAS_W,
  OBSTACLE_DIFFICULTY_RAMP_DISTANCE,
  ZAPPER_COLLISION_PAD,
  ZAPPER_END_CAP_RADIUS,
  ZAPPER_GATE_BOTTOM,
  ZAPPER_GATE_SAFE_Y,
  ZAPPER_GATE_TOP,
  ZAPPER_LANE_LOW,
  ZAPPER_LANE_MID,
  ZAPPER_LANE_TOP,
  ZAPPER_MAX_LENGTH_EASY,
  ZAPPER_MAX_LENGTH_HARD,
  ZAPPER_MAX_SPACING_EASY,
  ZAPPER_MAX_SPACING_HARD,
  ZAPPER_MIN_LENGTH_EASY,
  ZAPPER_MIN_LENGTH_HARD,
  ZAPPER_MIN_SPACING_EASY,
  ZAPPER_MIN_SPACING_HARD,
  ZAPPER_THICKNESS,
} from "./constants.js";

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function degreesToRadians(value) {
  return (value * Math.PI) / 180;
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function getDifficultyProgress(distance) {
  return Math.min(1, distance / OBSTACLE_DIFFICULTY_RAMP_DISTANCE);
}

function pickOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createZapper(angleDeg, centerY, length, x) {
  const angle = degreesToRadians(angleDeg);
  const dx = Math.cos(angle) * length;
  const dy = Math.sin(angle) * length;

  const halfWidth = Math.max(Math.abs(dx), ZAPPER_THICKNESS) * 0.5 + ZAPPER_COLLISION_PAD;
  const halfHeight = Math.max(Math.abs(dy), ZAPPER_THICKNESS) * 0.5 + ZAPPER_COLLISION_PAD;

  return {
    x,
    y: centerY,
    angle,
    angleDeg,
    length,
    dx,
    dy,
    thickness: ZAPPER_THICKNESS,
    endCapRadius: ZAPPER_END_CAP_RADIUS,
    aabb: {
      x: x - halfWidth,
      y: centerY - halfHeight,
      w: halfWidth * 2,
      h: halfHeight * 2,
    },
  };
}

function createFormation(distance) {
  const progress = getDifficultyProgress(distance);
  const length = randomBetween(
    lerp(ZAPPER_MIN_LENGTH_EASY, ZAPPER_MIN_LENGTH_HARD, progress),
    lerp(ZAPPER_MAX_LENGTH_EASY, ZAPPER_MAX_LENGTH_HARD, progress),
  );
  const x = CANVAS_W + length + 60;

  const easyFormations = [
    () => ({
      zappers: [createZapper(0, ZAPPER_LANE_TOP, length, x)],
      safeLaneY: ZAPPER_LANE_LOW,
    }),
    () => ({
      zappers: [createZapper(0, ZAPPER_LANE_LOW, length, x)],
      safeLaneY: ZAPPER_LANE_TOP,
    }),
    () => ({
      zappers: [createZapper(90, 220, length * 0.86, x)],
      safeLaneY: ZAPPER_LANE_LOW,
    }),
    () => ({
      zappers: [createZapper(90, 380, length * 0.86, x)],
      safeLaneY: ZAPPER_LANE_TOP,
    }),
    () => ({
      zappers: [
        createZapper(0, ZAPPER_GATE_TOP, length * 0.9, x),
        createZapper(0, ZAPPER_GATE_BOTTOM, length * 0.9, x),
      ],
      safeLaneY: ZAPPER_GATE_SAFE_Y,
    }),
  ];

  const advancedFormations = [
    () => ({
      zappers: [createZapper(45, 220, length, x)],
      safeLaneY: ZAPPER_LANE_LOW,
    }),
    () => ({
      zappers: [createZapper(135, 380, length, x)],
      safeLaneY: ZAPPER_LANE_TOP,
    }),
    () => ({
      zappers: [
        createZapper(0, ZAPPER_GATE_TOP + 20, length * 0.92, x),
        createZapper(0, ZAPPER_GATE_BOTTOM - 20, length * 0.92, x),
      ],
      safeLaneY: ZAPPER_GATE_SAFE_Y,
    }),
  ];

  const formationFactory =
    progress < 0.6 ? pickOne(easyFormations) : pickOne([...easyFormations, ...advancedFormations]);
  return formationFactory();
}

export function updateZappers(zappers, scrollSpeed, dtFrames) {
  const next = [];

  for (const zapper of zappers) {
    zapper.x -= scrollSpeed * dtFrames;
    zapper.aabb.x -= scrollSpeed * dtFrames;

    if (zapper.x + zapper.length > 0) {
      next.push(zapper);
    }
  }

  return next;
}

export function maybeSpawnZapper(app) {
  if (app.world.distance < app.world.nextZapperDistance) {
    return null;
  }

  const progress = getDifficultyProgress(app.world.distance);
  const formation = createFormation(app.world.distance);
  app.world.nextZapperDistance += randomBetween(
    lerp(ZAPPER_MIN_SPACING_EASY, ZAPPER_MIN_SPACING_HARD, progress),
    lerp(ZAPPER_MAX_SPACING_EASY, ZAPPER_MAX_SPACING_HARD, progress),
  );
  app.obstacles.push(...formation.zappers);
  return formation;
}
