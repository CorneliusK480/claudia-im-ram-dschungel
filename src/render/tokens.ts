import { FONT, VIEW_W } from '../config';
import type { GameState } from '../logic/game';

const RADIUS = 9;

/** Green hexagons with a "T" that float up and down and seem to turn. */
export function drawTokens(ctx: CanvasRenderingContext2D, state: GameState, camX: number): void {
  const { time } = state;
  ctx.font = `bold 11px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  for (const t of state.tokens) {
    const x = t.x - camX;
    if (t.taken || x < -RADIUS || x > VIEW_W + RADIUS) continue;
    const bob = Math.sin(time * 4 + t.x * 0.05) * 3;
    const turn = Math.abs(Math.cos(time * 3 + t.x * 0.02));
    ctx.save();
    ctx.translate(x, t.y + bob);
    ctx.scale(0.35 + turn * 0.65, 1);
    ctx.fillStyle = state.level.theme.accent;
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3 + Math.PI / 6;
      ctx.lineTo(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS);
    }
    ctx.fill();
    ctx.fillStyle = '#0008';
    ctx.fillText('T', 0, 4);
    ctx.restore();
  }
}
