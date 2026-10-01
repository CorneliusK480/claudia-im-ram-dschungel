import { PLAYER_W, TITLE_CAM_SPEED, VIEW_W } from '../config';
import type { Player } from './player';
import type { World } from './world';

/** Keeps Claudia in the middle of the view, but never shows beyond the level edges. */
export function cameraX(player: Player, world: World): number {
  const wanted = player.x + PLAYER_W / 2 - VIEW_W / 2;
  return Math.max(0, Math.min(wanted, world.widthPx - VIEW_W));
}

/** On the title screen the camera moves right on its own and starts over at the end of the level. */
export function titleCameraX(t: number, world: World): number {
  return (t * TITLE_CAM_SPEED) % (world.widthPx - VIEW_W);
}
