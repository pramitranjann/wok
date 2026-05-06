import {
  CANVAS_W,
  HUD_BURNER_H,
  HUD_BURNER_W,
  HUD_CAPSULE_H,
  HUD_CAPSULE_W,
  HUD_PADDING,
} from "./constants.js";

export function drawHud(ctx, app) {
  ctx.save();
  ctx.font = "700 22px Trebuchet MS";
  ctx.textBaseline = "top";

  drawCapsule(ctx, HUD_PADDING, HUD_PADDING, `DIST ${String(app.world.meters).padStart(4, "0")}m`);
  drawCapsule(ctx, HUD_PADDING, HUD_PADDING + 54, `ING ${String(app.run.ingredients).padStart(2, "0")}`);
  drawCapsule(ctx, HUD_PADDING, HUD_PADDING + 108, `FPS ${String(app.debug.fps).padStart(2, "0")}`);
  drawBurnerMeter(ctx, app, CANVAS_W - HUD_BURNER_W - HUD_PADDING, HUD_PADDING);

  if (app.state === "PLAY" && app.world.firstRunHint) {
    drawHint(ctx, "Pinch to fly ↑");
  }

  ctx.restore();
}

function drawCapsule(ctx, x, y, label) {
  ctx.fillStyle = "rgba(6, 14, 22, 0.8)";
  ctx.strokeStyle = "rgba(254, 240, 138, 0.24)";
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, HUD_CAPSULE_W, HUD_CAPSULE_H, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fef3c7";
  ctx.fillText(label, x + 16, y + 9);
}

function drawBurnerMeter(ctx, app, x, y) {
  ctx.fillStyle = "rgba(6, 14, 22, 0.82)";
  ctx.strokeStyle = "rgba(249, 115, 22, 0.35)";
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, HUD_BURNER_W, HUD_BURNER_H, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fef3c7";
  ctx.font = "700 20px Trebuchet MS";
  ctx.fillText("FUEL FLOW", x + 18, y + 12);

  const trackX = x + 18;
  const trackY = y + 40;
  const trackW = HUD_BURNER_W - 36;
  const trackH = 16;
  const fillW = Math.max(0, Math.min(trackW, trackW * app.player.thrustBlend));

  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  roundRect(ctx, trackX, trackY, trackW, trackH, 999);
  ctx.fill();

  ctx.fillStyle = app.player.thrustBlend > 0.02 ? "#f97316" : "rgba(148, 163, 184, 0.3)";
  roundRect(ctx, trackX, trackY, fillW, trackH, 999);
  ctx.fill();

  ctx.fillStyle = "#fed7aa";
  ctx.font = "700 16px Trebuchet MS";
  ctx.fillText(app.input.pinching ? "LIVE" : "IDLE", x + HUD_BURNER_W - 64, y + 12);
}

function drawHint(ctx, label) {
  const width = 260;
  const height = 48;
  const x = 510;
  const y = 80;

  ctx.fillStyle = "rgba(249, 115, 22, 0.9)";
  roundRect(ctx, x, y, width, height, 16);
  ctx.fill();
  ctx.fillStyle = "#fff7ed";
  ctx.textAlign = "center";
  ctx.fillText(label, x + width / 2, y + 11);
  ctx.textAlign = "left";
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
