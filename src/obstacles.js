import {
  CANVAS_W,
  CEILING_Y,
  GROUND_Y,
  OBSTACLE_DIFFICULTY_RAMP_DISTANCE,
  ZAPPER_ALLOWED_ANGLES,
  ZAPPER_COLLISION_PAD,
  ZAPPER_END_CAP_RADIUS,
  ZAPPER_MAX_CENTER_Y,
  ZAPPER_MAX_LENGTH_EASY,
  ZAPPER_MAX_LENGTH_HARD,
  ZAPPER_MAX_SPACING_EASY,
  ZAPPER_MAX_SPACING_HARD,
  ZAPPER_MIN_CENTER_Y,
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

export function createZapper(distance) {
  const progress = getDifficultyProgress(distance);
  const angleDeg = ZAPPER_ALLOWED_ANGLES[Math.floor(Math.random() * ZAPPER_ALLOWED_ANGLES.length)];
  const angle = degreesToRadians(angleDeg);
  const length = randomBetween(
    lerp(ZAPPER_MIN_LENGTH_EASY, ZAPPER_MIN_LENGTH_HARD, progress),
    lerp(ZAPPER_MAX_LENGTH_EASY, ZAPPER_MAX_LENGTH_HARD, progress),
  );
  const y = randomBetween(ZAPPER_MIN_CENTER_Y, ZAPPER_MAX_CENTER_Y);
  const x = CANVAS_W + length;
  const dx = Math.cos(angle) * length;
  const dy = Math.sin(angle) * length;

  const halfWidth = Math.max(Math.abs(dx), ZAPPER_THICKNESS) * 0.5 + ZAPPER_COLLISION_PAD;
  const halfHeight = Math.max(Math.abs(dy), ZAPPER_THICKNESS) * 0.5 + ZAPPER_COLLISION_PAD;

  return {
    x,
    y,
    angle,
    angleDeg,
    length,
    dx,
    dy,
    thickness: ZAPPER_THICKNESS,
    endCapRadius: ZAPPER_END_CAP_RADIUS,
    aabb: {
      x: x - halfWidth,
      y: y - halfHeight,
      w: halfWidth * 2,
      h: halfHeight * 2,
    },
  };
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
  const zapper = createZapper(app.world.distance);
  app.world.nextZapperDistance += randomBetween(
    lerp(ZAPPER_MIN_SPACING_EASY, ZAPPER_MIN_SPACING_HARD, progress),
    lerp(ZAPPER_MAX_SPACING_EASY, ZAPPER_MAX_SPACING_HARD, progress),
  );
  app.obstacles.push(zapper);
  return zapper;
}

export function getSafeIngredientBand(zapper, direction) {
  const bias = direction > 0 ? -1 : 1;
  const candidate = zapper.y + bias * 150;
  return Math.max(CEILING_Y + 60, Math.min(GROUND_Y - 80, candidate));
}
