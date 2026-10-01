import { VIEW_W } from '../config';
import type { Theme } from '../level/types';
import type { World } from '../logic/world';

const TOP_EDGE = 6;

export function drawTerrain(ctx: CanvasRenderingContext2D, world: World, theme: Theme, camX: number): void {
  for (const r of world.solids) {
    const x = r.x - camX;
    if (x + r.w < 0 || x > VIEW_W) continue;
    ctx.fillStyle = theme.ground;
    ctx.fillRect(x, r.y, r.w, r.h);
    ctx.fillStyle = theme.top;
    ctx.fillRect(x, r.y, r.w, TOP_EDGE);
    // a darker line below the top edge for some depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(x, r.y + TOP_EDGE, r.w, 2);
  }
}
