import {
  INGREDIENT_ARC_HEIGHT,
  INGREDIENT_AVOIDANCE_Y,
  INGREDIENT_MAX_Y,
  INGREDIENT_MIN_Y,
  INGREDIENT_PATTERN_COUNT,
  INGREDIENT_PATTERN_GRID_COLS,
  INGREDIENT_PATTERN_GRID_ROWS,
  INGREDIENT_PATTERN_SPACING,
  INGREDIENT_RADIUS,
  INGREDIENT_ZIGZAG_STEP,
} from "./constants.js";

const PATTERNS = ["line", "arc", "zigzag", "grid"];

function createIngredient(x, y) {
  return {
    x,
    y,
    radius: INGREDIENT_RADIUS,
    collected: false,
  };
}

export function spawnIngredientPattern(app, anchorX, targetY) {
  const progress = Math.min(1, app.world.distance / 5000);
  const patternPool =
    progress < 0.35 ? ["line", "arc", "line"] : progress < 0.7 ? ["line", "arc", "zigzag"] : PATTERNS;
  const pattern = patternPool[Math.floor(Math.random() * patternPool.length)];
  const items = [];
  const laneY = Math.max(INGREDIENT_MIN_Y + 20, Math.min(INGREDIENT_MAX_Y - 20, targetY));

  if (pattern === "line") {
    for (let index = 0; index < INGREDIENT_PATTERN_COUNT; index += 1) {
      items.push(createIngredient(anchorX + index * INGREDIENT_PATTERN_SPACING, laneY));
    }
  }

  if (pattern === "arc") {
    for (let index = 0; index < INGREDIENT_PATTERN_COUNT; index += 1) {
      const normalized = index / (INGREDIENT_PATTERN_COUNT - 1);
      const y = laneY - Math.sin(normalized * Math.PI) * INGREDIENT_ARC_HEIGHT;
      items.push(createIngredient(anchorX + index * INGREDIENT_PATTERN_SPACING, y));
    }
  }

  if (pattern === "zigzag") {
    for (let index = 0; index < INGREDIENT_PATTERN_COUNT; index += 1) {
      const y = laneY + (index % 2 === 0 ? -INGREDIENT_ZIGZAG_STEP : INGREDIENT_ZIGZAG_STEP);
      items.push(createIngredient(anchorX + index * INGREDIENT_PATTERN_SPACING, y));
    }
  }

  if (pattern === "grid") {
    for (let row = 0; row < INGREDIENT_PATTERN_GRID_ROWS; row += 1) {
      for (let col = 0; col < INGREDIENT_PATTERN_GRID_COLS; col += 1) {
        items.push(
          createIngredient(
            anchorX + col * INGREDIENT_PATTERN_SPACING,
            laneY + (row - 0.5) * INGREDIENT_ZIGZAG_STEP,
          ),
        );
      }
    }
  }

  app.ingredients.push(...items);
}

export function adjustIngredientLane(zapper, requestedY) {
  let lane = requestedY;

  if (Math.abs(zapper.y - requestedY) < INGREDIENT_AVOIDANCE_Y) {
    lane = requestedY < zapper.y ? requestedY - INGREDIENT_AVOIDANCE_Y : requestedY + INGREDIENT_AVOIDANCE_Y;
  }

  return Math.max(INGREDIENT_MIN_Y, Math.min(INGREDIENT_MAX_Y, lane));
}

export function updateIngredients(ingredients, scrollSpeed, dtFrames) {
  const next = [];

  for (const ingredient of ingredients) {
    ingredient.x -= scrollSpeed * dtFrames;
    if (!ingredient.collected && ingredient.x + ingredient.radius > 0) {
      next.push(ingredient);
    }
  }

  return next;
}
