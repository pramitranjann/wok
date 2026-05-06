import {
  CEILING_Y,
  FLAME_THRESHOLD,
  GRAVITY,
  GROUND_Y,
  PLAYER_H,
  PLAYER_THRUST_RAMP_DOWN,
  PLAYER_THRUST_RAMP_UP,
  TERMINAL_VELOCITY_DOWN,
  TERMINAL_VELOCITY_UP,
  THRUST,
} from "./constants.js";

export function updateFlight(player, isPinching, dtFrames) {
  if (isPinching) {
    player.thrustBlend = Math.min(1, player.thrustBlend + PLAYER_THRUST_RAMP_UP * dtFrames);
  } else {
    player.thrustBlend = Math.max(0, player.thrustBlend - PLAYER_THRUST_RAMP_DOWN * dtFrames);
  }

  player.vy += GRAVITY * dtFrames;
  player.vy += THRUST * player.thrustBlend * dtFrames;
  player.vy = Math.max(TERMINAL_VELOCITY_UP, Math.min(TERMINAL_VELOCITY_DOWN, player.vy));
  player.y += player.vy * dtFrames;
  player.flameActive = player.thrustBlend >= FLAME_THRESHOLD;

  const floorY = GROUND_Y - PLAYER_H;
  if (player.y >= floorY) {
    player.y = floorY;
    player.vy = 0;
    player.grounded = true;
    player.pose = "running";
    player.rotation = 0;
  } else if (player.y <= CEILING_Y) {
    player.y = CEILING_Y;
    player.vy = 0;
    player.grounded = false;
    player.pose = "flying";
  } else {
    player.grounded = false;
    player.pose = "flying";
    player.rotation = Math.max(-0.28, Math.min(0.34, player.vy * 0.045));
  }
}

export { GRAVITY };
