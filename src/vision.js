import { HAND_LANDMARKER_OPTIONS, MEDIAPIPE_MODEL_URL, MEDIAPIPE_WASM_URL } from "./config.js";

export async function createVisionController() {
  const visionModule = await import(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/+esm"
  );
  const { FilesetResolver, HandLandmarker } = visionModule;
  const fileset = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
  const handLandmarker = await HandLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: MEDIAPIPE_MODEL_URL,
    },
    ...HAND_LANDMARKER_OPTIONS,
  });

  return {
    handLandmarker,
    lastVideoTime: -1,
  };
}

export function detectHands(controller, video, timestampMs) {
  if (!controller || !video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return undefined;
  }

  if (video.currentTime === controller.lastVideoTime) {
    return undefined;
  }

  controller.lastVideoTime = video.currentTime;
  return controller.handLandmarker.detectForVideo(video, timestampMs);
}
