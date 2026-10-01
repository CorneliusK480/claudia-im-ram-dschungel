import { PLAYER_W } from '../config';
import type { Player } from '../logic/player';

const BODY = '#e8e4da';
const SHADE = '#b9b4a8';
const VISOR = '#10241a';
const EYE = '#3cff9a';

/** Claudia as a small robot around the 22 × 28 hitbox, mirrored by `facing`. */
export function drawClaudia(ctx: CanvasRenderingContext2D, player: Player, camX: number): void {
  const px = Math.round(player.x - camX);
  const py = Math.round(player.y);

  ctx.save();
  ctx.translate(px + PLAYER_W / 2, py);
  ctx.scale(player.facing, 1);
  ctx.translate(-PLAYER_W / 2, 0);

  // antenna
  ctx.fillStyle = SHADE;
  ctx.fillRect(10, -3, 2, 5);
  ctx.fillStyle = EYE;
  ctx.fillRect(9, -5, 4, 3);

  // head with visor and eyes (eyes sit towards the front)
  ctx.fillStyle = BODY;
  ctx.fillRect(2, 2, 18, 12);
  ctx.fillStyle = VISOR;
  ctx.fillRect(4, 5, 15, 6);
  ctx.fillStyle = EYE;
  ctx.fillRect(10, 6, 2, 4);
  ctx.fillRect(15, 6, 2, 4);

  // body with a small light
  ctx.fillStyle = BODY;
  ctx.fillRect(4, 14, 14, 9);
  ctx.fillStyle = SHADE;
  ctx.fillRect(4, 21, 14, 2);
  ctx.fillStyle = EYE;
  ctx.fillRect(12, 16, 3, 3);
  // arm
  ctx.fillStyle = SHADE;
  ctx.fillRect(1, 15, 3, 6);

  // legs: standing, walking (alternating) or jumping (pulled up)
  ctx.fillStyle = SHADE;
  if (!player.onGround) {
    ctx.fillRect(5, 23, 4, 3);
    ctx.fillRect(13, 23, 4, 3);
  } else if (Math.abs(player.vx) > 1) {
    const step = Math.floor(player.x / 8) % 2 === 0;
    ctx.fillRect(step ? 4 : 6, 23, 4, step ? 5 : 4);
    ctx.fillRect(step ? 14 : 12, 23, 4, step ? 4 : 5);
  } else {
    ctx.fillRect(5, 23, 4, 5);
    ctx.fillRect(13, 23, 4, 5);
  }

  ctx.restore();
}
