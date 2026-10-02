import {
  ACC, COYOTE, EPS, FRICTION, GRAV, JUMP, JUMP_BUFFER, JUMP_CUT, MAXFALL,
  PLAYER_H, PLAYER_W, SPEED,
} from '../config';
import type { InputState } from './input';
import { overlaps } from './rect';
import type { World } from './world';

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  /** 1 = looks right, -1 = looks left */
  facing: 1 | -1;
  /** Time left in which a jump is still allowed after leaving the ground. */
  coyote: number;
  /** Time left in which an early jump press is still remembered. */
  jumpBuffer: number;
  /** Time left in which bugs cannot hurt Claudia (after respawning). */
  invulnerable: number;
}

export function createPlayer(world: World, at = world.startPos): Player {
  return {
    x: at.x,
    y: at.y,
    vx: 0,
    vy: 0,
    onGround: true,
    facing: 1,
    coyote: 0,
    jumpBuffer: 0,
    invulnerable: 0,
  };
}

/** One physics step. Changes `player` in place. The order of the steps matters. Returns true if Claudia jumped. */
export function stepPlayer(player: Player, input: InputState, world: World, dt: number): boolean {
  const p = player;

  // 1. Horizontal: accelerate or brake (same on the ground and in the air)
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (dir !== 0) {
    p.vx = Math.max(-SPEED, Math.min(SPEED, p.vx + dir * ACC * dt));
    p.facing = dir > 0 ? 1 : -1;
  } else {
    const brake = FRICTION * dt;
    p.vx = Math.abs(p.vx) <= brake ? 0 : p.vx - Math.sign(p.vx) * brake;
  }

  // 2. Timers for coyote time and jump buffer
  p.coyote = p.onGround ? COYOTE : p.coyote - dt;
  p.jumpBuffer = input.jumpPressed ? JUMP_BUFFER : p.jumpBuffer - dt;
  p.invulnerable = Math.max(0, p.invulnerable - dt);

  // 3. Jump
  const jumped = p.jumpBuffer > EPS && p.coyote > EPS;
  if (jumped) {
    p.vy = -JUMP;
    p.jumpBuffer = 0;
    p.coyote = 0;
    p.onGround = false;
  }

  // 4. Variable jump height: releasing the key cuts the upward speed
  if (!input.jumpHeld && p.vy < -JUMP_CUT * JUMP) p.vy = -JUMP_CUT * JUMP;

  // 5. Gravity
  p.vy = Math.min(p.vy + GRAV * dt, MAXFALL);

  // 6. Move horizontally, stop at solids, then at the invisible level walls
  p.x += p.vx * dt;
  for (const s of world.solids) {
    if (!overlaps(rectOf(p), s)) continue;
    p.x = p.vx > 0 ? s.x - PLAYER_W : s.x + s.w;
    p.vx = 0;
  }
  if (p.x < 0) {
    p.x = 0;
    p.vx = 0;
  } else if (p.x > world.widthPx - PLAYER_W) {
    p.x = world.widthPx - PLAYER_W;
    p.vx = 0;
  }

  // 7. Move vertically: land on top or bump the head from below
  p.onGround = false;
  p.y += p.vy * dt;
  for (const s of world.solids) {
    if (!overlaps(rectOf(p), s)) continue;
    if (p.vy > 0) {
      p.y = s.y - PLAYER_H;
      p.onGround = true;
    } else {
      p.y = s.y + s.h;
    }
    p.vy = 0;
  }
  return jumped;
}

export function rectOf(p: Player) {
  return { x: p.x, y: p.y, w: PLAYER_W, h: PLAYER_H };
}
