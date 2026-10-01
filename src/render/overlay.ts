import { FONT, VIEW_H, VIEW_W } from '../config';
import type { Theme } from '../level/types';
import { texts } from '../texts';

/** Half-transparent layer with the "task done" message. */
export function drawGoalOverlay(ctx: CanvasRenderingContext2D, theme: Theme): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.accent;
  ctx.font = `bold 34px ${FONT}`;
  ctx.fillText(texts.goalTitle, VIEW_W / 2, VIEW_H / 2 - 20);
  ctx.fillStyle = '#e8e4da';
  ctx.font = `18px ${FONT}`;
  ctx.fillText(texts.goalHint, VIEW_W / 2, VIEW_H / 2 + 28);
}
