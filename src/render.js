import {
  BACKGROUND_STRIPE_COUNT,
  CANVAS_H,
  CANVAS_W,
  GROUND_H,
  GROUND_MARKER_COUNT,
  GROUND_Y,
  HAND_CONNECTIONS,
  PANEL_RADIUS,
  WEBCAM_PIP_H,
  WEBCAM_PIP_W,
  WEBCAM_TITLE_H,
  WEBCAM_TITLE_W,
} from "./constants.js";
import { drawHud } from "./hud.js";
import { drawOverlay } from "./overlays.js";

export function renderFrame(ctx, app, video) {
  drawBackground(ctx, app);
  drawGround(ctx, app);
  drawIngredients(ctx, app.ingredients);
  drawZappers(ctx, app.obstacles);
  drawPlayer(ctx, app.player);
  drawWebcamPanel(ctx, app, video);
  drawHud(ctx, app);
  drawOverlay(ctx, app);
}

function drawBackground(ctx, app) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  sky.addColorStop(0, "#102038");
  sky.addColorStop(0.55, "#0d1729");
  sky.addColorStop(1, "#08101a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  for (let index = 0; index < BACKGROUND_STRIPE_COUNT; index += 1) {
    const width = 46 + (index % 4) * 18;
    const height = 180 + (index % 3) * 56;
    const offset = (app.world.backgroundOffset * (1 + (index % 3) * 0.2) + index * 110) % (CANVAS_W + 220);
    const x = CANVAS_W - offset - 140;
    const y = 120 + (index % 5) * 62;
    ctx.fillStyle = index % 2 === 0 ? "rgba(31, 41, 55, 0.58)" : "rgba(17, 24, 39, 0.44)";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "rgba(251, 191, 36, 0.22)";
    ctx.fillRect(x + 10, y + 20, width - 20, 6);
  }
}

function drawGround(ctx, app) {
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(0, GROUND_Y, CANVAS_W, GROUND_H);
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, GROUND_Y - 14, CANVAS_W, 14);

  for (let index = 0; index < GROUND_MARKER_COUNT; index += 1) {
    const offset = (app.world.groundOffset + index * 92) % (CANVAS_W + 92);
    const x = CANVAS_W - offset;
    ctx.fillStyle = "rgba(250, 204, 21, 0.12)";
    ctx.fillRect(x, GROUND_Y + 18, 54, 8);
  }
}

function drawPlayer(ctx, player) {
  ctx.save();
  ctx.translate(player.x + 24, player.y + 32);
  ctx.rotate(player.rotation);

  if (player.hitFlashMs > 0) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(-32, -42, 64, 84);
  }

  if (player.flameActive && player.alive) {
    ctx.fillStyle = "#f97316";
    ctx.fillRect(-10, 34, 20, 32 + player.thrustBlend * 24);
  }

  ctx.fillStyle = "#facc15";
  ctx.fillRect(-24, -32, 48, 64);
  ctx.fillStyle = "#78350f";
  ctx.fillRect(-18, 8, 36, 10);
  ctx.restore();
}

function drawZappers(ctx, zappers) {
  for (const zapper of zappers) {
    const x1 = zapper.x - zapper.dx * 0.5;
    const y1 = zapper.y - zapper.dy * 0.5;
    const x2 = zapper.x + zapper.dx * 0.5;
    const y2 = zapper.y + zapper.dy * 0.5;

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = zapper.thickness;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = "#fca5a5";
    ctx.beginPath();
    ctx.arc(x1, y1, zapper.endCapRadius, 0, Math.PI * 2);
    ctx.arc(x2, y2, zapper.endCapRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawIngredients(ctx, ingredients) {
  ctx.fillStyle = "#4ade80";
  for (const ingredient of ingredients) {
    if (ingredient.collected) {
      continue;
    }
    ctx.beginPath();
    ctx.arc(ingredient.x, ingredient.y, ingredient.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWebcamPanel(ctx, app, video) {
  const isLarge = app.state === "TITLE" || app.state === "CALIBRATION";
  const width = isLarge ? WEBCAM_TITLE_W : WEBCAM_PIP_W;
  const height = isLarge ? WEBCAM_TITLE_H : WEBCAM_PIP_H;
  const x = isLarge ? CANVAS_W - width - 84 : CANVAS_W - width - 24;
  const y = isLarge ? 108 : CANVAS_H - height - 24;

  ctx.save();
  ctx.fillStyle = "rgba(4, 7, 13, 0.84)";
  roundedRect(ctx, x, y, width, height, PANEL_RADIUS);
  ctx.fill();
  ctx.clip();

  if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.save();
    roundedRect(ctx, x, y, width, height, PANEL_RADIUS);
    ctx.clip();
    drawHandSkeleton(ctx, app.input.landmarks, x, y, width, height);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(x, y, width, height);
  }

  ctx.restore();
  ctx.strokeStyle = "rgba(251, 191, 36, 0.24)";
  ctx.lineWidth = 2;
  roundedRect(ctx, x, y, width, height, PANEL_RADIUS);
  ctx.stroke();
}

function drawHandSkeleton(ctx, landmarks, x, y, w, h) {
  if (!landmarks) {
    return;
  }

  ctx.strokeStyle = "rgba(255, 248, 220, 0.85)";
  ctx.lineWidth = 2;

  for (const [from, to] of HAND_CONNECTIONS) {
    const start = landmarks[from];
    const end = landmarks[to];
    ctx.beginPath();
    ctx.moveTo(x + (1 - start.x) * w, y + start.y * h);
    ctx.lineTo(x + (1 - end.x) * w, y + end.y * h);
    ctx.stroke();
  }

  ctx.fillStyle = "#fef3c7";
  for (const point of landmarks) {
    ctx.beginPath();
    ctx.arc(x + (1 - point.x) * w, y + point.y * h, 3, 0, Math.PI * 2);
    ctx.fill();
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
