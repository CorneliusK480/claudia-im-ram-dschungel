import { SCORE_COLOR, TILE, VIEW_W } from '../config';
import type { GameState } from '../logic/game';

const INACTIVE = '#4a5a7a';
const ROW_Y = 14 * TILE;

/** Checkpoints as floppy disks: grey, yellow once activated. */
export function drawCheckpoints(ctx: CanvasRenderingContext2D, state: GameState, camX: number): void {
  for (const cp of state.checkpoints) {
    const x = cp.col * TILE + 6 - camX;
    const y = ROW_Y + 8;
    if (x + 20 < 0 || x > VIEW_W) continue;
    ctx.fillStyle = cp.active ? SCORE_COLOR : INACTIVE;
    ctx.fillRect(x, y, 20, 22);
    // metal slider with its hole
    ctx.fillStyle = '#ddd';
    ctx.fillRect(x + 4, y, 12, 7);
    ctx.fillStyle = '#222';
    ctx.fillRect(x + 11, y + 1, 3, 5);
    // label
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 3, y + 11, 14, 9);
  }
}
