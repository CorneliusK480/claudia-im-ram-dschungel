import { BUG_H, BUG_W, VIEW_W } from '../config';
import type { GameState } from '../logic/game';
import type { Pet } from '../logic/pets';

const FULL = Math.PI * 2;

/** Red parcel with a yellow ribbon and bow, origin in the middle. */
function gift(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#e53935';
  ctx.fillRect(-10, -7, 20, 15);
  ctx.fillStyle = '#b71c1c';
  ctx.fillRect(-11, -9, 22, 4);
  ctx.fillStyle = '#ffd84a';
  ctx.fillRect(-2, -9, 4, 17);
  ctx.fillRect(-10, -1, 20, 3);
  ctx.beginPath();
  ctx.ellipse(-4, -11, 4, 2.5, -0.5, 0, FULL);
  ctx.ellipse(4, -11, 4, 2.5, 0.5, 0, FULL);
  ctx.fill();
}

/** Two pairs of colourful wings that beat, dark body, looking right. */
function butterfly(ctx: CanvasRenderingContext2D, t: number): void {
  const beat = Math.max(0.15, Math.abs(Math.sin(t * 20)));
  ctx.save();
  ctx.scale(beat, 1);
  for (const side of [-1, 1]) {
    ctx.fillStyle = '#ff6fd8';
    ctx.beginPath();
    ctx.ellipse(side * 6, -4, 7, 6, side * 0.4, 0, FULL);
    ctx.fill();
    ctx.fillStyle = '#a66bff';
    ctx.beginPath();
    ctx.ellipse(side * 5, 5, 5, 4, -side * 0.4, 0, FULL);
    ctx.fill();
    ctx.fillStyle = '#ffd84a';
    ctx.beginPath();
    ctx.arc(side * 6, -4, 2, 0, FULL);
    ctx.fill();
  }
  ctx.restore();
  ctx.fillStyle = '#2a1a2a';
  ctx.fillRect(-1.5, -8, 3, 16);
  ctx.strokeStyle = '#2a1a2a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(-3, -13);
  ctx.moveTo(0, -8);
  ctx.lineTo(3, -13);
  ctx.stroke();
}

/** Yellow rubber duck, head and beak on the right. */
function duck(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#ffd84a';
  ctx.beginPath();
  ctx.ellipse(-2, 3, 10, 6, 0, 0, FULL);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(5, -4, 5, 0, FULL);
  ctx.fill();
  ctx.fillStyle = '#e8b830';
  ctx.beginPath();
  ctx.ellipse(-4, 2, 5, 3, 0.3, 0, FULL);
  ctx.fill();
  ctx.fillStyle = '#ff8c1a';
  ctx.beginPath();
  ctx.moveTo(9, -5);
  ctx.lineTo(14, -3);
  ctx.lineTo(9, -1);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.fillRect(5, -6, 2, 2);
}

/** Brown cookie with chocolate chips. */
function cookie(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#c68642';
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, FULL);
  ctx.fill();
  ctx.fillStyle = '#4a2a14';
  for (const [x, y] of [[-4, -3], [3, -5], [4, 2], [-2, 4], [0, 0]]) {
    ctx.beginPath();
    ctx.arc(x, y, 1.6, 0, FULL);
    ctx.fill();
  }
}

function drawPet(ctx: CanvasRenderingContext2D, p: Pet): void {
  if (p.kind === 'gift') gift(ctx);
  else if (p.kind === 'butterfly') butterfly(ctx, p.t);
  else if (p.kind === 'duck') duck(ctx);
  else cookie(ctx);
}

/** Pets, about as big as a bug, turned around their middle and looking where the bug walked. */
export function drawPets(ctx: CanvasRenderingContext2D, state: GameState, camX: number): void {
  for (const p of state.pets) {
    // the butterfly sways from side to side
    const sway = p.kind === 'butterfly' ? Math.sin(p.t * 6) * 8 : 0;
    const x = p.x - camX + sway;
    if (x + BUG_W + 10 < 0 || x - 10 > VIEW_W) continue;
    ctx.save();
    ctx.translate(x + BUG_W / 2, p.y + BUG_H / 2);
    ctx.rotate(p.angle);
    ctx.scale(p.facing, 1);
    drawPet(ctx, p);
    ctx.restore();
  }
}
