import {
  HAND_LANDMARK_INDEX,
  PINCH_HYSTERESIS,
  PINCH_THRESHOLD,
} from "./constants.js";

function distancePx(a, b, width, height) {
  const dx = (a.x - b.x) * width;
  const dy = (a.y - b.y) * height;
  return Math.hypot(dx, dy);
}

export function updateGestureInput(input, handLandmarks, frameWidth, frameHeight, dtMs, nowMs) {
  const wasPinching = input.pinching;

  if (!handLandmarks || handLandmarks.length === 0) {
    input.handPresent = false;
    input.pinching = false;
    input.justPinched = false;
    input.justReleased = wasPinching;
    input.pinchDistance = Infinity;
    input.landmarks = null;
    input.activeMs = 0;
    input.releaseMs += dtMs;
    input.startedPinchAt = null;
    return input;
  }

  const landmarks = handLandmarks[0];
  const pinchDistance = distancePx(
    landmarks[HAND_LANDMARK_INDEX.THUMB_TIP],
    landmarks[HAND_LANDMARK_INDEX.INDEX_FINGER_TIP],
    frameWidth,
    frameHeight,
  );

  const nextPinching = input.pinching
    ? pinchDistance <= PINCH_THRESHOLD + PINCH_HYSTERESIS
    : pinchDistance <= PINCH_THRESHOLD;

  input.handPresent = true;
  input.pinchDistance = pinchDistance;
  input.landmarks = landmarks;
  input.pinching = nextPinching;
  input.justPinched = !wasPinching && nextPinching;
  input.justReleased = wasPinching && !nextPinching;

  if (nextPinching) {
    input.activeMs += dtMs;
    input.releaseMs = 0;
    input.startedPinchAt ??= nowMs;
  } else {
    input.activeMs = 0;
    input.releaseMs += dtMs;
    input.startedPinchAt = null;
  }

  return input;
}
