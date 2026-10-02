import { FONT, VIEW_W } from '../config';
import type { Banner } from '../logic/banner';

/** Dark bar at the top in the middle, as wide as the text; fades out at the end. */
export function drawBanner(ctx: CanvasRenderingContext2D, banner: Banner): void {
  ctx.globalAlpha = Math.min(1, banner.time * 3);
  ctx.font = `bold 17px ${FONT}`;
  const w = ctx.measureText(banner.text).width + 30;
  ctx.fillStyle = '#000c';
  ctx.beginPath();
  ctx.roundRect(VIEW_W / 2 - w / 2, 128, w, 32, 8);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = banner.color;
  ctx.fillText(banner.text, VIEW_W / 2, 150);
  ctx.globalAlpha = 1;
}
