import { FONT, TEXT_LIFE, TEXT_RISE } from '../config';
import type { Effects } from '../logic/effects';

/** Particles as small fading squares, floating texts rising and fading out. */
export function drawEffects(ctx: CanvasRenderingContext2D, effects: Effects, camX: number): void {
  for (const q of effects.particles) {
    ctx.globalAlpha = Math.min(1, q.life * 2);
    ctx.fillStyle = q.color;
    ctx.fillRect(q.x - camX, q.y, q.size, q.size);
  }

  ctx.font = `bold 15px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  for (const t of effects.texts) {
    const x = t.x - camX;
    // Every text rises TEXT_RISE · TEXT_LIFE px in total; longer-lived ones rise slower.
    const y = t.y - (t.t / t.life) * TEXT_RISE * TEXT_LIFE;
    ctx.globalAlpha = Math.max(0, 1 - t.t / t.life);
    ctx.fillStyle = '#000';
    ctx.fillText(t.text, x + 1, y + 1);
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, x, y);
  }
  ctx.globalAlpha = 1;
}
