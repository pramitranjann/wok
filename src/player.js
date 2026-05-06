import {
  DEATH_FLASH_MS,
  DEATH_SLIDE_DECEL,
  DEATH_TUMBLE_MS,
  GROUND_Y,
  PLAYER_DEATH_VX,
  PLAYER_DEATH_VY,
  PLAYER_H,
  PLAYER_MAX_ROTATION,
  PLAYER_ROTATION_SPEED,
} from "./constants.js";

export function startDeathSequence(player) {
  player.alive = false;
  player.deathMs = 0;
  player.deathMode = "flash";
  player.hitFlashMs = DEATH_FLASH_MS;
  player.vx = PLAYER_DEATH_VX;
  player.vy = PLAYER_DEATH_VY;
}

export function updateDeathSequence(player, dtFrames, dtMs, gravity) {
  player.deathMs += dtMs;
  player.hitFlashMs = Math.max(0, player.hitFlashMs - dtMs);

  if (player.deathMs <= DEATH_FLASH_MS) {
    player.deathMode = "flash";
    return false;
  }

  if (player.deathMs <= DEATH_FLASH_MS + DEATH_TUMBLE_MS) {
    player.deathMode = "tumble";
    player.vy += gravity * dtFrames;
    player.y += player.vy * dtFrames;
    player.rotation = Math.min(player.rotation + PLAYER_ROTATION_SPEED * dtFrames, PLAYER_MAX_ROTATION);
    const floorY = GROUND_Y - PLAYER_H;
    if (player.y >= floorY) {
      player.y = floorY;
      player.vy = 0;
    }
    return false;
  }

  player.deathMode = "slide";
  player.y = GROUND_Y - PLAYER_H;
  player.vy = 0;
  player.vx = Math.max(0, player.vx - DEATH_SLIDE_DECEL * dtFrames);
  player.x += player.vx * dtFrames;
  player.rotation = PLAYER_MAX_ROTATION;

  if (player.vx === 0) {
    player.deathMode = "stop";
    return true;
  }

  return false;
}
