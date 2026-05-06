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
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  const items = [];

  if (pattern === "line") {
    for (let index = 0; index < INGREDIENT_PATTERN_COUNT; index += 1) {
      items.push(createIngredient(anchorX + index * INGREDIENT_PATTERN_SPACING, targetY));
    }
  }

  if (pattern === "arc") {
    for (let index = 0; index < INGREDIENT_PATTERN_COUNT; index += 1) {
      const normalized = index / (INGREDIENT_PATTERN_COUNT - 1);
      const y = targetY - Math.sin(normalized * Math.PI) * INGREDIENT_ARC_HEIGHT;
      items.push(createIngredient(anchorX + index * INGREDIENT_PATTERN_SPACING, y));
    }
  }

  if (pattern === "zigzag") {
    for (let index = 0; index < INGREDIENT_PATTERN_COUNT; index += 1) {
      const y = targetY + (index % 2 === 0 ? -INGREDIENT_ZIGZAG_STEP : INGREDIENT_ZIGZAG_STEP);
      items.push(createIngredient(anchorX + index * INGREDIENT_PATTERN_SPACING, y));
    }
  }

  if (pattern === "grid") {
    for (let row = 0; row < INGREDIENT_PATTERN_GRID_ROWS; row += 1) {
      for (let col = 0; col < INGREDIENT_PATTERN_GRID_COLS; col += 1) {
        items.push(
          createIngredient(
            anchorX + col * INGREDIENT_PATTERN_SPACING,
            targetY + (row - 0.5) * INGREDIENT_ZIGZAG_STEP,
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
