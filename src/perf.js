export function createPerfTracker() {
  return {
    frameCount: 0,
    elapsedMs: 0,
    fps: 0,
  };
}

export function updatePerfTracker(perf, dtMs) {
  perf.frameCount += 1;
  perf.elapsedMs += dtMs;

  if (perf.elapsedMs >= 500) {
    perf.fps = Math.round((perf.frameCount * 1000) / perf.elapsedMs);
    perf.frameCount = 0;
    perf.elapsedMs = 0;
  }

  return perf.fps;
}
