import { CAMERA_CONSTRAINTS } from "./config.js";

export async function createWebcamVideo() {
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

export function stopWebcamStream(stream) {
  if (!stream) {
    return;
  }

  for (const track of stream.getTracks()) {
    track.stop();
  }
}
