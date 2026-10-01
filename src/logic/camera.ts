import { PLAYER_W, VIEW_W } from '../config';
import type { Player } from './player';
import type { World } from './world';

/** Keeps Claudia in the middle of the view, but never shows beyond the level edges. */
export function cameraX(player: Player, world: World): number {
  const wanted = player.x + PLAYER_W / 2 - VIEW_W / 2;
  return Math.max(0, Math.min(wanted, world.widthPx - VIEW_W));
}
