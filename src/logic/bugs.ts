import {
  BUG_H, BUG_LOST_Y, BUG_SPEED, BUG_W, GRAV, MAXFALL, PLAYER_H, STOMP_DEPTH, TILE,
} from '../config';
import type { LevelData } from '../level/types';
import type { Player } from './player';
import { overlaps, type Rect } from './rect';
import type { World } from './world';

export interface Bug {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
  /** Seconds since it was defeated, drives the squashing. */
  deadTime: number;
}

/** Bugs stand on the bottom of their tile and start walking to the left. */
export function buildBugs(level: LevelData): Bug[] {
  return level.bugs.map(([c, r]) => ({
    x: c * TILE + 4,
    y: (r + 1) * TILE - BUG_H,
    vx: -BUG_SPEED,
    vy: 0,
    alive: true,
    deadTime: 0,
  }));
}

export function bugRect(bug: Bug): Rect {
  return { x: bug.x, y: bug.y, w: BUG_W, h: BUG_H };
}

const inside = (x: number, y: number, r: Rect) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;

/** Walks until a wall, the level edge or an edge in the ground, then turns around. Changes `bug` in place. */
export function stepBug(bug: Bug, world: World, dt: number): void {
  bug.vy = Math.min(bug.vy + GRAV * dt, MAXFALL);

  // Horizontal: turn around at solids and at the level edges
  bug.x += bug.vx * dt;
  for (const s of world.solids) {
    if (!overlaps(bugRect(bug), s)) continue;
    bug.x = bug.vx > 0 ? s.x - BUG_W : s.x + s.w;
    bug.vx = -bug.vx;
  }
  if (bug.x < 0) {
    bug.x = 0;
    bug.vx = Math.abs(bug.vx);
  } else if (bug.x > world.widthPx - BUG_W) {
    bug.x = world.widthPx - BUG_W;
    bug.vx = -Math.abs(bug.vx);
  }

  // Vertical: land on top or bump from below
  let landed = false;
  bug.y += bug.vy * dt;
  for (const s of world.solids) {
    if (!overlaps(bugRect(bug), s)) continue;
    if (bug.vy > 0) {
      bug.y = s.y - BUG_H;
      landed = true;
    } else {
      bug.y = s.y + s.h;
    }
    bug.vy = 0;
  }

  // On the ground: turn around if there is nothing to stand on just ahead
  if (landed) {
    const aheadX = bug.vx > 0 ? bug.x + BUG_W + 1 : bug.x - 1;
    const belowY = bug.y + BUG_H + 2;
    if (!world.solids.some((s) => inside(aheadX, belowY, s))) bug.vx = -bug.vx;
  }

  if (bug.y > BUG_LOST_Y) bug.alive = false;
}

/** Landing on the bug from above, as opposed to running into it from the side. */
export function isStomp(player: Player, bug: Bug): boolean {
  return player.vy > 0 && player.y + PLAYER_H - bug.y < STOMP_DEPTH;
}
