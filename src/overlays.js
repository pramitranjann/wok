import {
  CALIBRATION_PINCH_HOLD_MS,
  CANVAS_H,
  CANVAS_W,
  COUNTDOWN_STEP_MS,
  GAME_STATES,
  HAND_LOST_THRESHOLD_MS,
  PANEL_RADIUS,
  RESULTS_PINCH_DELAY_MS,
} from "./constants.js";

export function drawOverlay(ctx, app) {
  if (app.state === GAME_STATES.PLAY && !app.hand.lostPause) {
    return;
  }

  if (app.hand.lostPause) {
    drawCenteredPanel(ctx, "Hand lost", "Show your hand to continue.");
    return;
  }

  switch (app.state) {
    case GAME_STATES.LOADING:
      drawCenteredPanel(ctx, "wok.", app.camera.error ?? app.statusMessage);
      break;
    case GAME_STATES.TITLE:
      drawSidePanel(ctx, "wok.", "Pinch to start");
      break;
    case GAME_STATES.CALIBRATION:
      drawCalibration(ctx, app);
      break;
    case GAME_STATES.COUNTDOWN:
      drawCountdown(ctx, app);
      break;
    case GAME_STATES.DEAD:
      drawDead(ctx);
      break;
    case GAME_STATES.RESULTS:
      drawResults(ctx, app);
      break;
    case GAME_STATES.RETRY_PROMPT:
      drawRetry(ctx, app);
      break;
    default:
      break;
  }
}

function drawCenteredPanel(ctx, title, subtitle) {
  const width = 480;
  const height = 210;
  const x = (CANVAS_W - width) / 2;
  const y = (CANVAS_H - height) / 2;

  ctx.save();
  ctx.fillStyle = "rgba(3, 7, 14, 0.82)";
  roundedRect(ctx, x, y, width, height, PANEL_RADIUS);
  ctx.fill();
  ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#fef3c7";
  ctx.textAlign = "center";
  ctx.font = "700 52px Trebuchet MS";
  ctx.fillText(title, CANVAS_W / 2, y + 74);
  ctx.font = "600 24px Trebuchet MS";
  wrapText(ctx, subtitle, CANVAS_W / 2, y + 122, width - 80, 30);
  ctx.restore();
}

function drawSidePanel(ctx, title, subtitle) {
  ctx.save();
  ctx.fillStyle = "rgba(3, 7, 14, 0.76)";
  roundedRect(ctx, 88, 108, 330, 182, PANEL_RADIUS);
  ctx.fill();
  ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#fef3c7";
  ctx.textAlign = "left";
  ctx.font = "700 56px Trebuchet MS";
  ctx.fillText(title, 124, 180);
  ctx.font = "600 26px Trebuchet MS";
  ctx.fillText(subtitle, 124, 230);
  ctx.restore();
}

function drawCalibration(ctx, app) {
  const step = app.calibration.step;
  let title = "Show your hand";
  let subtitle = "Keep your hand inside the camera frame.";

  if (step === "pinch_hold") {
    title = "Pinch and hold";
    subtitle = `Hold the pinch for ${Math.ceil(
      (CALIBRATION_PINCH_HOLD_MS - app.calibration.pinchHoldMs) / 100,
    ) / 10}s`;
  }

  if (step === "release") {
    title = "Release";
    subtitle = "Open your fingers to finish calibration.";
  }

  if (step === "ready") {
    title = "You're ready";
    subtitle = "Next: countdown.";
  }

  drawCenteredPanel(ctx, title, subtitle);
}

function drawCountdown(ctx, app) {
  ctx.save();
  ctx.fillStyle = "rgba(4, 9, 16, 0.45)";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = "center";
  ctx.fillStyle = "#fef3c7";
  ctx.font = "700 132px Trebuchet MS";
  ctx.fillText(app.countdown.label, CANVAS_W / 2, CANVAS_H / 2 + 28);
  ctx.font = "600 28px Trebuchet MS";
  ctx.fillText("Get ready to pinch", CANVAS_W / 2, CANVAS_H / 2 + 92);
  ctx.restore();
}

function drawDead(ctx) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  ctx.font = "700 46px Trebuchet MS";
  ctx.fillText("Burner wiped out", CANVAS_W / 2, 132);
  ctx.restore();
}

function drawResults(ctx, app) {
  drawCenteredPanel(
    ctx,
    `Distance ${app.run.lastDistance}m`,
    app.results.elapsedMs >= RESULTS_PINCH_DELAY_MS
      ? `Ingredients ${app.run.ingredients}  •  Pinch to continue`
      : `Ingredients ${app.run.ingredients}`,
  );
}

function drawRetry(ctx, app) {
  drawCenteredPanel(
    ctx,
    "Pinch to go again",
    `Best ${app.run.bestDistance}m  •  Last ${app.run.lastDistance}m`,
  );
}

function wrapText(ctx, text, centerX, startY, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let y = startY;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth) {
      ctx.fillText(line, centerX, y);
      line = word;
      y += lineHeight;
    } else {
      line = candidate;
    }
  }

  if (line) {
    ctx.fillText(line, centerX, y);
  }
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
