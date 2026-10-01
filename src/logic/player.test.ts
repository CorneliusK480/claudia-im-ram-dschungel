import { describe, expect, it } from 'vitest';
import { MAXFALL, STEP } from '../config';
import { loadLevel1 } from '../test/level1';
import { NO_INPUT, type InputState } from './input';
import { createPlayer, stepPlayer, type Player } from './player';
import { buildWorld } from './world';

const world = buildWorld(loadLevel1());
const GROUND_Y = 452; // y of Claudia standing on the ground
const PLAT11_Y = 11 * 32 - 28; // y of Claudia standing on a row-11 platform

const input = (over: Partial<InputState> = {}): InputState => ({ ...NO_INPUT, ...over });

function playerAt(x: number, y = GROUND_Y, over: Partial<Player> = {}): Player {
  return { ...createPlayer(world), x, y, ...over };
}

/** Runs n steps with the same input; calls `each` after every step. */
function run(p: Player, inp: InputState, n: number, each?: (p: Player, i: number) => void): Player {
  for (let i = 0; i < n; i++) {
    stepPlayer(p, inp, world, STEP);
    each?.(p, i);
  }
  return p;
}

/** Runs until Claudia stands on something again (max 300 steps). */
function untilLanded(p: Player, inp: InputState, each?: (p: Player) => void): Player {
  for (let i = 0; i < 300; i++) {
    stepPlayer(p, inp, world, STEP);
    each?.(p);
    if (p.onGround) return p;
  }
  throw new Error('never landed');
}

/** Highest point of a jump from the ground, in pixels above the ground. */
function jumpHeight(held: boolean): number {
  const p = playerAt(200);
  let top = p.y;
  stepPlayer(p, input({ jumpPressed: true, jumpHeld: held }), world, STEP);
  top = Math.min(top, p.y);
  untilLanded(p, input({ jumpHeld: held }), (q) => (top = Math.min(top, q.y)));
  return GROUND_Y - top;
}

/** Runs right from `x` and jumps (key held) once Claudia's right side reaches `jumpAt`. */
function runAndJump(x: number, y: number, jumpAt: number, steps = 200): Player {
  const p = playerAt(x, y);
  let jumped = false;
  for (let i = 0; i < steps; i++) {
    const press = !jumped && p.x + 22 >= jumpAt;
    if (press) jumped = true;
    stepPlayer(p, input({ right: true, jumpHeld: jumped, jumpPressed: press }), world, STEP);
    if (jumped && p.onGround && i > 5) return p;
  }
  return p;
}

describe('walking', () => {
  it('reaches full speed after 7 steps and stops 7 steps after release', () => {
    const p = playerAt(200);
    run(p, input({ right: true }), 7);
    expect(p.vx).toBe(270);
    expect(p.facing).toBe(1);
    run(p, input(), 7);
    expect(p.vx).toBe(0);
  });

  it('looks left when walking left', () => {
    const p = run(playerAt(200), input({ left: true }), 3);
    expect(p.facing).toBe(-1);
    expect(p.vx).toBeLessThan(0);
  });

  it('brakes with left + right like without input', () => {
    const both = run(playerAt(200, GROUND_Y, { vx: 270 }), input({ left: true, right: true }), 4);
    const none = run(playerAt(200, GROUND_Y, { vx: 270 }), input(), 4);
    expect(both.vx).toBe(none.vx);
    expect(both.x).toBe(none.x);
  });
});

describe('jumping', () => {
  it('full jump (key held) is a bit more than 4 tiles high', () => {
    const h = jumpHeight(true);
    expect(h).toBeGreaterThanOrEqual(133);
    expect(h).toBeLessThanOrEqual(143);
  });

  it('short tap (pressed and released in the same step) is a small hop', () => {
    const h = jumpHeight(false);
    expect(h).toBeGreaterThanOrEqual(18);
    expect(h).toBeLessThanOrEqual(28);
  });

  /** Walks right off the first ground edge, then waits `after` steps and presses jump. */
  function coyoteJump(after: number): boolean {
    const p = playerAt(860, GROUND_Y, { vx: 270 });
    while (p.onGround) stepPlayer(p, input({ right: true }), world, STEP);
    run(p, input({ right: true }), after - 1);
    stepPlayer(p, input({ right: true, jumpPressed: true, jumpHeld: true }), world, STEP);
    return p.vy < 0;
  }

  it('coyote time: jumping 3 steps (0.05 s) after leaving an edge still works', () => {
    expect(coyoteJump(3)).toBe(true);
  });

  it('coyote time: 9 steps (0.15 s) after leaving an edge it does not', () => {
    expect(coyoteJump(9)).toBe(false);
  });

  /** Drops Claudia onto the ground; jump is pressed `before` steps before landing. */
  function bufferedJump(before: number): boolean {
    const fall = playerAt(200, GROUND_Y - 200, { onGround: false });
    let landStep = 0;
    while (!fall.onGround) {
      stepPlayer(fall, input(), world, STEP);
      landStep++;
    }
    const p = playerAt(200, GROUND_Y - 200, { onGround: false });
    for (let i = 1; i <= landStep + 1; i++) {
      const press = i === landStep - before;
      stepPlayer(p, input({ jumpPressed: press, jumpHeld: press }), world, STEP);
    }
    return p.vy < 0;
  }

  it('jump buffer: pressing 6 steps (0.1 s) before landing jumps on landing', () => {
    expect(bufferedJump(6)).toBe(true);
  });

  it('jump buffer: pressing 12 steps (0.2 s) before landing does not', () => {
    expect(bufferedJump(12)).toBe(false);
  });

  it('holding the key after landing does not jump again', () => {
    const p = playerAt(200);
    stepPlayer(p, input({ jumpPressed: true, jumpHeld: true }), world, STEP);
    untilLanded(p, input({ jumpHeld: true }));
    run(p, input({ jumpHeld: true }), 60, (q) => {
      expect(q.onGround).toBe(true);
      expect(q.y).toBe(GROUND_Y);
    });
  });

  it('never falls faster than 950 px/s', () => {
    const p = playerAt(940, 300, { onGround: false }); // above the first pit
    run(p, input(), 120, (q) => expect(q.vy).toBeLessThanOrEqual(MAXFALL));
    expect(p.vy).toBe(MAXFALL);
  });
});

describe('solid platforms', () => {
  it('bumps the head when jumping from below and falls back', () => {
    const p = playerAt(340); // under [9, 11, 4]: x 288–416, bottom at 384
    stepPlayer(p, input({ jumpPressed: true, jumpHeld: true }), world, STEP);
    untilLanded(p, input({ jumpHeld: true }), (q) => expect(q.y).toBeGreaterThanOrEqual(384));
    expect(p.y).toBe(GROUND_Y);
  });

  it('stops at the side of a platform while at its height', () => {
    // [9, 11, 4] spans y 352–384. Once Claudia is fully below it, she may walk underneath.
    const p = playerAt(9 * 32 - 22, 360, { onGround: false, vy: -300 });
    let checked = 0;
    untilLanded(p, input({ right: true, jumpHeld: true }), (q) => {
      if (q.y + 28 > 352 && q.y < 384) {
        expect(q.x + 22).toBeLessThanOrEqual(9 * 32);
        checked++;
      }
    });
    expect(checked).toBeGreaterThan(10);
  });

  it.each([9, 36, 51, 65, 92, 107])(
    'lands on the row-11 platform at column %i when jumping up right next to it',
    (col) => {
      const p = runAndJump(col * 32 - 48, GROUND_Y, 0);
      expect(p.y).toBe(PLAT11_Y);
      expect(p.x + 22).toBeGreaterThan(col * 32);
    },
  );

  it.each([
    [9, 4, 17],
    [36, 3, 43],
    [65, 4, 72],
    [92, 4, 99],
  ])('reaches the row-8 platform from the row-11 platform at column %i', (from, len, to) => {
    const right = (from + len) * 32;
    const p = runAndJump(from * 32 + 4, PLAT11_Y, right - 2);
    expect(p.y).toBe(8 * 32 - 28);
    expect(p.x + 22).toBeGreaterThan(to * 32);
  });

  it.each([
    [896, 1024],
    [1856, 1984],
    [2688, 2816],
  ])('clears the pit from x %i to %i with a run-up', (edge, nextGround) => {
    const p = runAndJump(edge - 200, GROUND_Y, edge - 2);
    expect(p.y).toBe(GROUND_Y);
    expect(p.x).toBeGreaterThanOrEqual(nextGround);
  });
});

describe('level edges', () => {
  it('stops at x = 0 on the left', () => {
    const p = run(playerAt(69), input({ left: true }), 60);
    expect(p.x).toBe(0);
  });

  it('stops at 130 · 32 − 22 on the right', () => {
    const p = run(playerAt(4100), input({ right: true }), 60);
    expect(p.x).toBe(130 * 32 - 22);
  });
});
