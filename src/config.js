import { MEDIAPIPE_MAX_HANDS } from "./constants.js";

export const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";

export const MEDIAPIPE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export const CAMERA_CONSTRAINTS = {
  audio: false,
  video: {
    facingMode: "user",
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 60 },
  },
};

export const HAND_LANDMARKER_OPTIONS = {
  runningMode: "VIDEO",
  numHands: MEDIAPIPE_MAX_HANDS,
  minHandDetectionConfidence: 0.45,
  minHandPresenceConfidence: 0.45,
  minTrackingConfidence: 0.45,
};
