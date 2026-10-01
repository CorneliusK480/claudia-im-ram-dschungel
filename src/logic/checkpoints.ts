import { CHECKPOINT_SPAWN_X, PLAYER_H, PLAYER_W, TILE } from '../config';
import type { LevelData } from '../level/types';
import type { Player } from './player';

/** Checkpoints stand on the ground, in row 14. */
const CHECKPOINT_ROW = 14;

export interface Checkpoint {
  col: number;
  active: boolean;
}

export function buildCheckpoints(level: LevelData): Checkpoint[] {
  return level.saves.map((col) => ({ col, active: false }));
}

/** Only horizontal: touching the 32 px wide column at any height counts, also when jumping over it. */
export function touchesCheckpoint(player: Player, cp: Checkpoint): boolean {
  const left = cp.col * TILE;
  return player.x < left + TILE && player.x + PLAYER_W > left;
}

/** Where Claudia respawns after this checkpoint: standing on the ground. */
export function spawnOf(cp: Checkpoint): { x: number; y: number } {
  return { x: cp.col * TILE + CHECKPOINT_SPAWN_X, y: (CHECKPOINT_ROW + 1) * TILE - PLAYER_H };
}
