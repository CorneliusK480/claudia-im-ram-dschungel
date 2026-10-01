import { GOAL_H, GOAL_W, PLAYER_H, PLAYER_W, ROWS, TILE } from '../config';
import type { LevelData } from '../level/types';
import type { Rect } from './rect';

export interface World {
  /** Everything Claudia cannot pass through: ground sections and platforms. */
  solids: Rect[];
  goalRect: Rect;
  widthPx: number;
  startPos: { x: number; y: number };
}

const GROUND_ROW = 15;

/** Turns level data into rectangles in pixels. Only the terrain is used in this slice. */
export function buildWorld(level: LevelData): World {
  const ground: Rect[] = level.ground.map(([from, to]) => ({
    x: from * TILE,
    y: GROUND_ROW * TILE,
    w: (to - from) * TILE,
    h: (ROWS - GROUND_ROW) * TILE,
  }));
  const plats: Rect[] = level.plats.map(([x, y, len]) => ({
    x: x * TILE,
    y: y * TILE,
    w: len * TILE,
    h: TILE,
  }));
  const [gx, gy] = level.goal;
  const [sx, sy] = level.start;
  return {
    solids: [...ground, ...plats],
    goalRect: { x: gx * TILE, y: (gy + 1) * TILE - GOAL_H, w: GOAL_W, h: GOAL_H },
    widthPx: level.width * TILE,
    // Centred in the start column, feet on the bottom of the start row.
    startPos: { x: sx * TILE + (TILE - PLAYER_W) / 2, y: (sy + 1) * TILE - PLAYER_H },
  };
}
