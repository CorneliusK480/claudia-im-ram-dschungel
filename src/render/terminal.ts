import { FONT, VIEW_W } from '../config';
import type { Theme } from '../level/types';
import type { World } from '../logic/world';
import { texts } from '../texts';
import { withAlpha } from './color';

/** The OUTPUT terminal: a small computer case with a dark screen. Shows ✓ once the level is done. */
export function drawTerminal(
  ctx: CanvasRenderingContext2D, world: World, theme: Theme, camX: number, done: boolean,
): void {
  const { x: gx, y, w, h } = world.goalRect;
  const x = gx - camX;
  if (x + w < 0 || x > VIEW_W) return;

  // glow
  ctx.fillStyle = withAlpha(theme.accent, 0.15);
  ctx.fillRect(x - 4, y - 4, w + 8, h + 4);
  // case
  ctx.fillStyle = '#2a332e';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
  // screen
  ctx.fillStyle = '#031a0e';
  ctx.fillRect(x + 6, y + 6, w - 12, 30);
  ctx.fillStyle = theme.accent;
  ctx.font = `bold 14px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(done ? '✓' : '>_', x + 10, y + 21);
  // label
  ctx.font = `bold 9px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(texts.terminalLabel, x + w / 2, y + 46);
  // feet
  ctx.fillStyle = '#1a201d';
  ctx.fillRect(x + 6, y + h - 8, w - 12, 4);
}
