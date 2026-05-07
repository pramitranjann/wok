import { HUD_CAPSULE_H, HUD_CAPSULE_W, HUD_PADDING } from "./constants.js";

export function drawHud(ctx, app) {
  ctx.save();
  ctx.font = "700 22px Trebuchet MS";
  ctx.textBaseline = "top";

  drawCapsule(ctx, HUD_PADDING, HUD_PADDING, `DIST ${String(app.world.meters).padStart(4, "0")}m`);
  drawCapsule(ctx, HUD_PADDING, HUD_PADDING + 54, `ING ${String(app.run.ingredients).padStart(2, "0")}`);
  drawCapsule(ctx, HUD_PADDING, HUD_PADDING + 108, `FPS ${String(app.debug.fps).padStart(2, "0")}`);
  drawLivesCapsule(ctx, app, HUD_PADDING, HUD_PADDING + 162);

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

function drawLivesCapsule(ctx, app, x, y) {
  const lives = Number.isFinite(app.run.livesLeft) ? app.run.livesLeft : 3;
  const isRecovering = app.effects.bannerMs > 0;
  const pulse = isRecovering ? 0.4 + 0.6 * Math.sin(app.effects.bannerMs * 0.02) ** 2 : 0;

  ctx.fillStyle = isRecovering ? `rgba(127, 29, 29, ${0.56 + pulse * 0.14})` : "rgba(6, 14, 22, 0.8)";
  ctx.strokeStyle = isRecovering
    ? `rgba(248, 113, 113, ${0.42 + pulse * 0.4})`
    : "rgba(254, 240, 138, 0.24)";
  ctx.lineWidth = isRecovering ? 3 : 2;
  roundRect(ctx, x, y, HUD_CAPSULE_W, HUD_CAPSULE_H, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fef3c7";
  ctx.fillText("LIVES", x + 16, y + 9);

  const pipRadius = 8;
  const pipGap = 24;
  const pipsStartX = x + 116;
  const pipY = y + 20;

  for (let index = 0; index < 3; index += 1) {
    const pipX = pipsStartX + index * pipGap;
    const active = index < lives;
    ctx.beginPath();
    ctx.arc(pipX, pipY, pipRadius, 0, Math.PI * 2);
    ctx.fillStyle = active
      ? isRecovering
        ? `rgba(248, 113, 113, ${0.78 + pulse * 0.18})`
        : "#f97316"
      : "rgba(255, 255, 255, 0.14)";
    ctx.fill();
    if (active) {
      ctx.strokeStyle = "rgba(255, 237, 213, 0.84)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  if (isRecovering) {
    ctx.fillStyle = "rgba(254, 202, 202, 0.92)";
    ctx.font = "700 11px Trebuchet MS";
    ctx.fillText("-1", x + 154, y + 7);
    ctx.font = "700 22px Trebuchet MS";
  }
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
