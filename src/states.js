import {
  BASE_SCROLL_SPEED,
  GAME_STATES,
  GROUND_Y,
  PLAYER_H,
  PLAYER_START_X,
  PLAYER_START_Y,
  ZAPPER_FIRST_SPAWN_DISTANCE,
} from "./constants.js";

export function createAppState() {
  return {
    state: GAME_STATES.LOADING,
    previousState: null,
    statusMessage: "Loading camera...",
    camera: {
      loading: true,
      ready: false,
      error: null,
    },
    input: {
      handPresent: false,
      pinching: false,
      justPinched: false,
      justReleased: false,
      pinchDistance: Infinity,
      landmarks: null,
      startedPinchAt: null,
      activeMs: 0,
      releaseMs: 0,
    },
    calibration: {
      step: "show_hand",
      pinchHoldMs: 0,
      readyMs: 0,
    },
    countdown: {
      elapsedMs: 0,
      label: "3",
    },
    world: {
      distance: 0,
      meters: 0,
      scrollSpeed: BASE_SCROLL_SPEED,
      firstRunHint: false,
      playTimeMs: 0,
      backgroundOffset: 0,
      groundOffset: 0,
      nextZapperDistance: ZAPPER_FIRST_SPAWN_DISTANCE,
      nextPatternDirection: 1,
    },
    run: {
      ingredients: 0,
      bestDistance: 0,
      lastDistance: 0,
    },
    player: {
      x: PLAYER_START_X,
      y: PLAYER_START_Y,
      vy: 0,
      vx: 0,
      thrustBlend: 0,
      flameActive: false,
      pose: "running",
      alive: true,
      grounded: true,
      rotation: 0,
      deathMs: 0,
      deathMode: "none",
      hitFlashMs: 0,
    },
    hand: {
      lastSeenAt: 0,
      lostPause: false,
      resumeVisibleMs: 0,
    },
    obstacles: [],
    ingredients: [],
    effects: {
      flashMs: 0,
    },
    results: {
      elapsedMs: 0,
    },
    debug: {
      fps: 0,
    },
  };
}

export function setState(app, nextState, statusMessage = "") {
  app.previousState = app.state;
  app.state = nextState;
  if (statusMessage) {
    app.statusMessage = statusMessage;
  }
  if (nextState === GAME_STATES.CALIBRATION) {
    app.calibration.step = "show_hand";
    app.calibration.pinchHoldMs = 0;
    app.calibration.readyMs = 0;
  }
  if (nextState === GAME_STATES.COUNTDOWN) {
    app.countdown.elapsedMs = 0;
    app.countdown.label = "3";
    resetRun(app);
  }
  if (nextState === GAME_STATES.RESULTS) {
    app.results.elapsedMs = 0;
    app.run.lastDistance = app.world.meters;
    app.run.bestDistance = Math.max(app.run.bestDistance, app.run.lastDistance);
  }
}

export function resetRun(app) {
  app.world.distance = 0;
  app.world.meters = 0;
  app.world.scrollSpeed = BASE_SCROLL_SPEED;
  app.world.firstRunHint = false;
  app.world.playTimeMs = 0;
  app.world.nextZapperDistance = ZAPPER_FIRST_SPAWN_DISTANCE;
  app.obstacles.length = 0;
  app.ingredients.length = 0;
  app.run.ingredients = 0;
  app.player.x = PLAYER_START_X;
  app.player.y = PLAYER_START_Y;
  app.player.vy = 0;
  app.player.vx = 0;
  app.player.thrustBlend = 0;
  app.player.flameActive = false;
  app.player.pose = "running";
  app.player.alive = true;
  app.player.grounded = true;
  app.player.rotation = 0;
  app.player.deathMs = 0;
  app.player.deathMode = "none";
  app.player.hitFlashMs = 0;
  app.effects.flashMs = 0;
  app.hand.lostPause = false;
  app.hand.resumeVisibleMs = 0;
}

export function isPlayerOnGround(player) {
  return player.y >= GROUND_Y - PLAYER_H;
}
