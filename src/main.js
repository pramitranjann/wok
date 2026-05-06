import {
  BACKGROUND_STRIPE_SPEED,
  BASE_SCROLL_SPEED,
  CALIBRATION_PINCH_HOLD_MS,
  CALIBRATION_READY_MS,
  COUNTDOWN_STEP_MS,
  COUNTDOWN_STEPS,
  DISTANCE_SCALE,
  FIRST_RUN_HINT_DELAY_MS,
  FIXED_FRAME_MS,
  GAME_STATES,
  GRAVITY,
  HAND_LOST_THRESHOLD_MS,
  MAX_SCROLL_SPEED,
  RESULTS_PINCH_DELAY_MS,
  SPEED_RAMP_DISTANCE,
  TITLE_PINCH_HOLD_MS,
} from "./constants.js";
import { collectIngredients, makePlayerHitbox, rectsOverlap } from "./collision.js";
import { adjustIngredientLane, spawnIngredientPattern, updateIngredients } from "./ingredients.js";
import { updateFlight } from "./physics.js";
import { createPerfTracker, updatePerfTracker } from "./perf.js";
import { startDeathSequence, updateDeathSequence } from "./player.js";
import { maybeSpawnZapper, updateZappers, getSafeIngredientBand } from "./obstacles.js";
import { renderFrame } from "./render.js";
import { createAppState, setState } from "./states.js";
import { updateGestureInput } from "./gesture.js";
import { createVisionController, detectHands } from "./vision.js";
import { createWebcamVideo, normalizeCameraError, stopWebcamStream } from "./webcam.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const retryButton = document.getElementById("camera-retry");
const setBootMessage = globalThis.__setBootMessage ?? (() => {});
const hideBootStatus = globalThis.__hideBootStatus ?? (() => {});

const app = createAppState();
const perf = createPerfTracker();

let video = null;
let stream = null;
let visionController = null;
let animationFrameId = 0;
let previousTimeMs = 0;
let cameraInitInFlight = false;

retryButton.addEventListener("click", async () => {
  if (cameraInitInFlight) {
    return;
  }
  await initializeCameraAndVision();
});

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrameId);
  stopWebcamStream(stream);
});

initialize();

function initialize() {
  setBootMessage("Enable camera to play.");
  setState(app, GAME_STATES.LOADING, "Enable camera to play.");
  setCameraButton("Enable camera", true);
  animationFrameId = requestAnimationFrame(tick);
}

async function initializeCameraAndVision() {
  cameraInitInFlight = true;
  app.camera.loading = true;
  app.camera.error = null;
  app.camera.ready = false;
  app.statusMessage = "Loading camera...";
  retryButton.disabled = true;
  setCameraButton("Starting camera...", true);
  setBootMessage("Loading camera...");
  setState(app, GAME_STATES.LOADING, "Loading camera...");

  try {
    stopWebcamStream(stream);
    const webcam = await createWebcamVideo();
    video = webcam.video;
    stream = webcam.stream;
    visionController = await createVisionController();
    app.camera.ready = true;
    app.camera.loading = false;
    app.hand.lastSeenAt = performance.now();
    setCameraButton("Enable camera", false);
    setState(app, GAME_STATES.TITLE, "Pinch to start");
  } catch (error) {
    app.camera.loading = false;
    app.camera.ready = false;
    app.camera.error = normalizeCameraError(error);
    app.statusMessage = app.camera.error;
    setBootMessage(app.statusMessage);
    setCameraButton("Retry camera", true);
  } finally {
    retryButton.disabled = false;
    cameraInitInFlight = false;
  }
}

function setCameraButton(label, visible) {
  retryButton.textContent = label;
  retryButton.classList.toggle("hidden", !visible);
}

function tick(timestampMs) {
  const dtMs = Math.min(40, timestampMs - previousTimeMs || FIXED_FRAME_MS);
  const dtFrames = dtMs / FIXED_FRAME_MS;
  previousTimeMs = timestampMs;

  sampleVision(timestampMs, dtMs);
  updateStateMachine(timestampMs, dtMs, dtFrames);

  app.debug.fps = updatePerfTracker(perf, dtMs);
  renderFrame(ctx, app, video);
  hideBootStatus();
  animationFrameId = requestAnimationFrame(tick);
}

function sampleVision(timestampMs, dtMs) {
  const result = detectHands(visionController, video, timestampMs);
  if (result === undefined) {
    return;
  }
  const landmarks = result?.landmarks ?? null;
  const width = video?.videoWidth || canvas.width;
  const height = video?.videoHeight || canvas.height;

  updateGestureInput(app.input, landmarks, width, height, dtMs, timestampMs);

  if (app.input.handPresent) {
    app.hand.lastSeenAt = timestampMs;
  }
}

function updateStateMachine(timestampMs, dtMs, dtFrames) {
  app.world.backgroundOffset += BASE_SCROLL_SPEED * BACKGROUND_STRIPE_SPEED * dtFrames;
  app.world.groundOffset += app.world.scrollSpeed * dtFrames;

  if (app.state === GAME_STATES.LOADING) {
    return;
  }

  if (app.state === GAME_STATES.TITLE) {
    if (app.input.pinching && app.input.activeMs >= TITLE_PINCH_HOLD_MS) {
      setState(app, GAME_STATES.CALIBRATION, "Calibration");
    }
    return;
  }

  if (app.state === GAME_STATES.CALIBRATION) {
    updateCalibration(dtMs);
    return;
  }

  if (app.state === GAME_STATES.COUNTDOWN) {
    updateCountdown(dtMs);
    return;
  }

  if (app.state === GAME_STATES.PLAY) {
    updatePlay(timestampMs, dtMs, dtFrames);
    return;
  }

  if (app.state === GAME_STATES.DEAD) {
    const finished = updateDeathSequence(app.player, dtFrames, dtMs, GRAVITY);
    if (finished) {
      setState(app, GAME_STATES.RESULTS, "Results");
    }
    return;
  }

  if (app.state === GAME_STATES.RESULTS) {
    app.results.elapsedMs += dtMs;
    if (app.results.elapsedMs >= RESULTS_PINCH_DELAY_MS && app.input.justPinched) {
      setState(app, GAME_STATES.RETRY_PROMPT, "Pinch to go again");
    }
    return;
  }

  if (app.state === GAME_STATES.RETRY_PROMPT) {
    if (app.input.justPinched) {
      setState(app, GAME_STATES.COUNTDOWN, "Countdown");
    }
  }
}

function updateCalibration(dtMs) {
  if (!app.input.handPresent) {
    app.calibration.step = "show_hand";
    app.calibration.pinchHoldMs = 0;
    app.calibration.readyMs = 0;
    return;
  }

  if (app.calibration.step === "show_hand") {
    app.calibration.step = "pinch_hold";
    return;
  }

  if (app.calibration.step === "pinch_hold") {
    if (app.input.pinching) {
      app.calibration.pinchHoldMs += dtMs;
      if (app.calibration.pinchHoldMs >= CALIBRATION_PINCH_HOLD_MS) {
        app.calibration.step = "release";
      }
    } else {
      app.calibration.pinchHoldMs = 0;
    }
    return;
  }

  if (app.calibration.step === "release") {
    if (!app.input.pinching) {
      app.calibration.step = "ready";
      app.calibration.readyMs = 0;
    }
    return;
  }

  if (app.calibration.step === "ready") {
    app.calibration.readyMs += dtMs;
    if (app.calibration.readyMs >= CALIBRATION_READY_MS) {
      setState(app, GAME_STATES.COUNTDOWN, "Countdown");
    }
  }
}

function updateCountdown(dtMs) {
  app.countdown.elapsedMs += dtMs;
  const index = Math.min(
    COUNTDOWN_STEPS.length - 1,
    Math.floor(app.countdown.elapsedMs / COUNTDOWN_STEP_MS),
  );
  app.countdown.label = COUNTDOWN_STEPS[index];

  if (app.countdown.elapsedMs >= COUNTDOWN_STEPS.length * COUNTDOWN_STEP_MS) {
    setState(app, GAME_STATES.PLAY, "Play");
  }
}

function updatePlay(timestampMs, dtMs, dtFrames) {
  const handLostForMs = timestampMs - app.hand.lastSeenAt;

  if (handLostForMs > HAND_LOST_THRESHOLD_MS) {
    app.hand.lostPause = true;
  }

  if (app.hand.lostPause) {
    if (app.input.handPresent) {
      app.hand.resumeVisibleMs += dtMs;
      if (app.hand.resumeVisibleMs >= HAND_LOST_THRESHOLD_MS * 0.5) {
        app.hand.lostPause = false;
        app.hand.resumeVisibleMs = 0;
        app.hand.lastSeenAt = timestampMs;
      }
    } else {
      app.hand.resumeVisibleMs = 0;
    }
    return;
  }

  app.world.playTimeMs += dtMs;
  app.world.firstRunHint =
    app.world.playTimeMs >= FIRST_RUN_HINT_DELAY_MS && app.input.activeMs === 0 && app.world.distance < 160;

  updateFlight(app.player, app.input.pinching, dtFrames);
  const speedProgress = Math.min(1, app.world.distance / SPEED_RAMP_DISTANCE);
  app.world.scrollSpeed = BASE_SCROLL_SPEED + (MAX_SCROLL_SPEED - BASE_SCROLL_SPEED) * speedProgress;
  app.world.distance += app.world.scrollSpeed * dtFrames;
  app.world.meters = Math.floor(app.world.distance * DISTANCE_SCALE);

  const newZapper = maybeSpawnZapper(app);
  if (newZapper) {
    const lane = adjustIngredientLane(
      newZapper,
      getSafeIngredientBand(newZapper, app.world.nextPatternDirection),
    );
    spawnIngredientPattern(app, newZapper.x - 80, lane);
    app.world.nextPatternDirection *= -1;
  }

  app.obstacles = updateZappers(app.obstacles, app.world.scrollSpeed, dtFrames);
  app.ingredients = updateIngredients(app.ingredients, app.world.scrollSpeed, dtFrames);

  const playerBox = makePlayerHitbox(app.player);
  const collected = collectIngredients(playerBox, app.ingredients);
  app.run.ingredients += collected;

  for (const zapper of app.obstacles) {
    if (rectsOverlap(playerBox, zapper.aabb)) {
      startDeathSequence(app.player);
      setState(app, GAME_STATES.DEAD, "Dead");
      break;
    }
  }
}
