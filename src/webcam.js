import { CAMERA_CONSTRAINTS } from "./config.js";

export async function createWebcamVideo() {
  if (!window.isSecureContext) {
    throw new Error("Camera requires HTTPS or localhost.");
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("This browser does not expose camera access.");
  }

  const video = document.createElement("video");
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;

  const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
  video.srcObject = stream;

  await new Promise((resolve) => {
    video.onloadedmetadata = async () => {
      await video.play();
      resolve();
    };
  });

  return { video, stream };
}

export function normalizeCameraError(error) {
  if (!(error instanceof Error)) {
    return "Camera access failed.";
  }

  if (error.name === "NotAllowedError" || error.name === "SecurityError") {
    return "Camera permission was blocked. Allow camera access and try again.";
  }

  if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
    return "No camera was found for this browser.";
  }

  if (error.name === "NotReadableError" || error.name === "TrackStartError") {
    return "The camera is busy in another app or tab.";
  }

  return error.message;
}

export function stopWebcamStream(stream) {
  if (!stream) {
    return;
  }

  for (const track of stream.getTracks()) {
    track.stop();
  }
}
