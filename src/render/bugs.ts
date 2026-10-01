import { BUG_H, BUG_W, EPS, SQUASH_TIME, VIEW_W } from '../config';
import type { GameState } from '../logic/game';

const FULL = Math.PI * 2;
const COLORS = { leg: '#2a0a1a', body: '#c2185b', line: '#7a0f3a', spot: '#ff6fa5', head: '#3a0a24' };

/** Beetle shape, head on the left, origin at the bottom centre. */
function bugShape(ctx: CanvasRenderingContext2D, legPhase: number): void {
  const leg = Math.sin(legPhase) * 2;
  ctx.strokeStyle = COLORS.leg;
  ctx.lineWidth = 2;
  for (let k = -1; k <= 1; k++) {
    ctx.beginPath();
    ctx.moveTo(k * 6, -6);
    ctx.lineTo(k * 7 + (k ? leg : -leg), 0);
    ctx.stroke();
  }
  ctx.fillStyle = COLORS.body;
  ctx.beginPath();
  ctx.ellipse(2, -9, 11, 8, 0, 0, FULL);
  ctx.fill();
  ctx.strokeStyle = COLORS.line;
  ctx.beginPath();
  ctx.moveTo(2, -17);
  ctx.lineTo(2, -1);
  ctx.stroke();
  ctx.fillStyle = COLORS.spot;
  ctx.beginPath();
  ctx.arc(-1, -12, 2, 0, FULL);
  ctx.arc(6, -8, 2, 0, FULL);
  ctx.fill();
  ctx.fillStyle = COLORS.head;
  ctx.beginPath();
  ctx.arc(-10, -8, 5, 0, FULL);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(-13, -10, 3, 3);
  // feelers
  ctx.strokeStyle = COLORS.head;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-12, -12);
  ctx.lineTo(-16, -18);
  ctx.moveTo(-9, -12);
  ctx.lineTo(-10, -19);
  ctx.stroke();
}

/** Walking bugs look where they go. Defeated bugs are squashed flat and vanish after 0.6 s. */
export function drawBugs(ctx: CanvasRenderingContext2D, state: GameState, camX: number): void {
  for (const b of state.bugs) {
    if (!b.alive && b.deadTime >= SQUASH_TIME - EPS) continue;
    const x = b.x - camX;
    if (x + BUG_W + 10 < 0 || x - 10 > VIEW_W) continue;
    const squash = b.alive ? 1 : Math.max(0.15, 1 - b.deadTime * 4);
    ctx.save();
    ctx.translate(x + BUG_W / 2, b.y + BUG_H);
    ctx.scale(b.vx > 0 ? -1 : 1, squash);
    bugShape(ctx, state.time * 18 + b.x);
    ctx.restore();
  }
}
