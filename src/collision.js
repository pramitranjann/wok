import { INGREDIENT_PICKUP_PAD } from "./constants.js";

export function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function makePlayerHitbox(player) {
  return {
    x: player.x + 10,
    y: player.y + 12,
    w: 28,
    h: 40,
  };
}

export function collectIngredients(playerBox, ingredients) {
  let collected = 0;

  for (const ingredient of ingredients) {
    if (ingredient.collected) {
      continue;
    }

    const nearestX = Math.max(playerBox.x, Math.min(ingredient.x, playerBox.x + playerBox.w));
    const nearestY = Math.max(playerBox.y, Math.min(ingredient.y, playerBox.y + playerBox.h));
    const dx = ingredient.x - nearestX;
    const dy = ingredient.y - nearestY;
    const limit = ingredient.radius + INGREDIENT_PICKUP_PAD;
    if (dx * dx + dy * dy <= limit * limit) {
      ingredient.collected = true;
      collected += 1;
    }
  }

  return collected;
}
