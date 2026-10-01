import { describe, expect, it } from 'vitest';
import { STEP } from '../config';
import { loadLevel1 } from '../test/level1';
import { fixedRandom } from '../test/random';
import { texts } from '../texts';
import { burst } from './effects';
import { createGame, stepGame, type GameState } from './game';
import { NO_INPUT, type InputState } from './input';

const level = loadLevel1();
const input = (over: Partial<InputState> = {}): InputState => ({ ...NO_INPUT, ...over });
const ENTER = input({ enterPressed: true });
const ALL_KEYS = input({ left: true, right: true, jumpPressed: true, jumpHeld: true });

function step(state: GameState, inp = input(), n = 1): GameState {
  for (let i = 0; i < n; i++) state = stepGame(state, inp, STEP);
  return state;
}

/** Puts Claudia above the third pit (columns 84–87), falling. */
function putIntoPit(state: GameState): GameState {
  Object.assign(state.player, { x: 2740, y: 470, vx: 0, vy: 0, onGround: false });
  return state;
}

/** A game with Claudia falling into the third pit. */
function fallingIntoPit(random = fixedRandom([0.5])): GameState {
  const state = putIntoPit(createGame(level, random));
  state.camX = 2270;
  return state;
}

/** Runs until Claudia has died. */
function untilDying(state: GameState): GameState {
  for (let i = 0; i < 300 && state.mode === 'playing'; i++) state = step(state);
  expect(state.mode).toBe('dying');
  return state;
}

/** Runs the death sequence to its end without input. */
const endOfDeath = (state: GameState) => step(state, input(), 192);

describe('falling into a pit', () => {
  it('dies in the step in which the top edge is below 584 px, not before', () => {
    let state = fallingIntoPit();
    let belowPicture = false;
    while (state.mode === 'playing') {
      state = step(state);
      if (state.mode === 'playing') {
        expect(state.player.y).toBeLessThanOrEqual(584);
        if (state.player.y > 544) belowPicture = true;
      }
    }
    expect(belowPicture).toBe(true);
    expect(state.mode).toBe('dying');
    expect(state.player.y).toBeGreaterThan(584);
  });

  it('takes a life at once, shakes and bursts into 30 particles inside the picture', () => {
    const state = untilDying(fallingIntoPit());
    expect(state.lives).toBe(2);
    expect(state.effects.shake).toBe(0.3);
    expect(state.effects.particles).toHaveLength(30);
    for (const q of state.effects.particles) {
      expect(q.y).toBeLessThanOrEqual(534);
      expect(q.color).toBe('#D97757');
    }
  });

  it('picks the death message by chance', () => {
    expect(texts.deathMessages).toContain(untilDying(fallingIntoPit(Math.random)).deathMessage);
    // 0.5 · 9 messages → index 4
    expect(untilDying(fallingIntoPit()).deathMessage).toBe('Out of Memory!');
  });

  it('does not protect with invulnerability', () => {
    const state = fallingIntoPit();
    state.player.invulnerable = 1.5;
    expect(untilDying(state).lives).toBe(2);
  });
});

describe('death sequence', () => {
  it('respawns at the start after 192 steps (3.2 s), standing still and invulnerable', () => {
    let state = untilDying(fallingIntoPit());
    state = step(state, input(), 191);
    expect(state.mode).toBe('dying');
    state = step(state);
    expect(state.mode).toBe('playing');
    expect(state.player).toMatchObject({ x: 69, y: 452, vx: 0, vy: 0, facing: 1, invulnerable: 1.5 });
    expect(state.camX).toBe(0);
  });

  it('ENTER ends it from 0.7 s (step 42) on, not earlier', () => {
    let state = untilDying(fallingIntoPit());
    state = step(state, input(), 40);
    state = step(state, ENTER);
    expect(state.mode).toBe('dying');
    state = step(state, ENTER);
    expect(state.mode).toBe('playing');
    expect(state.player.x).toBe(69);
  });

  it('the jump key does not end it', () => {
    let state = untilDying(fallingIntoPit());
    state = step(state, input({ jumpPressed: true, jumpHeld: true }), 191);
    expect(state.mode).toBe('dying');
  });

  it('keeps the camera still and ignores the controls', () => {
    let state = untilDying(fallingIntoPit());
    const camX = state.camX;
    const { x, y } = state.player;
    expect(camX).toBeGreaterThan(0);
    for (let i = 0; i < 191; i++) {
      state = step(state, ALL_KEYS);
      expect(state.camX).toBe(camX);
      expect(state.player.x).toBe(x);
      expect(state.player.y).toBe(y);
    }
  });

  it('keeps score and token count, and brings the collected tokens back', () => {
    let state = fallingIntoPit();
    state.score = 120;
    state.tokenCount = 12;
    state.tokens[0].taken = true;
    state = endOfDeath(untilDying(state));
    expect(state.mode).toBe('playing');
    expect(state.score).toBe(120);
    expect(state.tokenCount).toBe(12);
    expect(state.tokens).toHaveLength(49);
    expect(state.tokens.every((t) => !t.taken)).toBe(true);
  });

  it('lets particles fly on and stops the shaking after 18 steps', () => {
    let state = untilDying(fallingIntoPit());
    const { x, y } = state.effects.particles[0];
    state = step(state, input(), 18);
    expect(state.effects.shake).toBe(0);
    expect(state.effects.particles[0].x).not.toBe(x);
    expect(state.effects.particles[0].y).not.toBe(y);
  });
});

describe('checkpoint', () => {
  /** Claudia jumping over column 64 at y 300. */
  function jumpingOverCheckpoint(): GameState {
    const state = createGame(level, fixedRandom([0.5]));
    Object.assign(state.player, { x: 64 * 32, y: 300, vy: -100, onGround: false });
    return step(state);
  }

  it('is activated in a jump over it, with "Autosave..." and a new spawn point', () => {
    const state = jumpingOverCheckpoint();
    expect(state.checkpoints[0].active).toBe(true);
    expect(state.effects.texts.map((t) => t.text)).toEqual(['Autosave...']);
    expect(state.spawn).toEqual({ x: 2053, y: 452 });
  });

  it('is activated only once', () => {
    const state = step(jumpingOverCheckpoint());
    expect(state.effects.texts).toHaveLength(1);
  });

  it('is not activated while Claudia is still left of the column', () => {
    const state = createGame(level);
    Object.assign(state.player, { x: 64 * 32 - 22 - 1, y: 300, onGround: false });
    expect(step(state).checkpoints[0].active).toBe(false);
  });

  it('is where Claudia respawns after a death', () => {
    let state = putIntoPit(jumpingOverCheckpoint());
    state = endOfDeath(untilDying(state));
    expect(state.mode).toBe('playing');
    expect(state.player.x).toBe(2053);
    expect(state.player.y).toBe(452);
    expect(state.camX).toBe(2053 + 11 - 480);
  });
});

describe('game over', () => {
  /** Dies three times; returns the state at the start of the game over screen. */
  function gameOver(): GameState {
    let state = createGame(level, fixedRandom([0.5]));
    state.score = 230;
    state.tokenCount = 23;
    state.tokens[0].taken = true;
    state.checkpoints[0].active = true;
    state.bugs[0].alive = false;
    for (let life = 2; life >= 0; life--) {
      state = untilDying(putIntoPit(state));
      expect(state.lives).toBe(life);
      state = endOfDeath(state);
    }
    expect(state.mode).toBe('gameOver');
    return state;
  }

  it('comes after the death sequence of the last life', () => {
    gameOver();
  });

  it('ENTER works only from 1.2 s (step 72) on and starts level 1 anew', () => {
    let state = step(gameOver(), input(), 70);
    state = step(state, ENTER);
    expect(state.mode).toBe('gameOver');
    state = step(state, ENTER);
    expect(state.mode).toBe('playing');
    expect(state.lives).toBe(3);
    expect(state.score).toBe(0);
    expect(state.tokenCount).toBe(0);
    expect(state.tokens).toHaveLength(49);
    expect(state.tokens.every((t) => !t.taken)).toBe(true);
    expect(state.checkpoints[0].active).toBe(false);
    expect(state.bugs).toHaveLength(7);
    expect(state.bugs.every((b) => b.alive)).toBe(true);
    expect(state.bugs[0].x).toBe(708);
    expect(state.spawn).toEqual({ x: 69, y: 452 });
    expect(state.player.x).toBe(69);
    expect(state.player.y).toBe(452);
    expect(state.camX).toBe(0);
  });

  it('other keys do nothing, also after 1.2 s', () => {
    const state = step(gameOver(), ALL_KEYS, 200);
    expect(state.mode).toBe('gameOver');
    expect(state.score).toBe(230);
  });

  it('stops the bugs', () => {
    const state = gameOver();
    const xs = state.bugs.map((b) => b.x);
    step(state, input(), 30);
    expect(state.bugs.map((b) => b.x)).toEqual(xs);
  });

  it('stops the particles', () => {
    const state = gameOver();
    burst(state.effects, state.random, 100, 100, '#fff', 4);
    const before = structuredClone(state.effects);
    step(state, input(), 30);
    expect(state.effects).toEqual(before);
  });
});

describe('bugs', () => {
  /** Claudia falling onto the first bug (x 708, y 462), her feet 5 px above it. */
  function fallingOnBug(over: Partial<GameState['player']> = {}): GameState {
    const state = createGame(level, fixedRandom([0.5]));
    Object.assign(state.player, { x: 709, y: 462 - 28 - 5, vy: 600, onGround: false, ...over });
    return state;
  }

  /** Claudia standing on the ground just left of the first bug, which walks into her. */
  function bugWalksIntoClaudia(): GameState {
    const state = createGame(level, fixedRandom([0.5]));
    Object.assign(state.player, { x: 708 - 22 - 0.5, y: 452, onGround: true });
    return state;
  }

  it('landing on a bug defeats it: +100, 14 pink particles, a message, and Claudia bounces off', () => {
    const state = step(fallingOnBug());
    expect(state.mode).toBe('playing');
    expect(state.bugs[0].alive).toBe(false);
    expect(state.score).toBe(100);
    expect(state.effects.particles).toHaveLength(14);
    expect(state.effects.particles.every((q) => q.color === '#ff5a8a')).toBe(true);
    expect(state.effects.texts).toHaveLength(1);
    expect(texts.bugMessages).toContain(state.effects.texts[0].text);
    expect(state.effects.shake).toBe(0);
    expect(state.player.vy).toBeLessThan(0);
    expect(state.player.onGround).toBe(false);
  });

  it('bounces with 663 px/s with the jump key held', () => {
    const state = step(fallingOnBug(), input({ jumpHeld: true }));
    expect(state.player.vy).toBeCloseTo(-663);
  });

  it('bounces with 429 px/s without the key, cut to 328 px/s in the next step', () => {
    let state = step(fallingOnBug());
    expect(state.player.vy).toBeCloseTo(-429);
    state = step(state);
    expect(Math.abs(state.player.vy - (-328 + 2100 / 60))).toBeLessThanOrEqual(1);
  });

  it('a bug walking into Claudia from the side costs a life', () => {
    const state = step(bugWalksIntoClaudia());
    expect(state.mode).toBe('dying');
    expect(state.lives).toBe(2);
    expect(state.bugs[0].alive).toBe(true);
  });

  it('a touch from the side does nothing while Claudia is invulnerable', () => {
    const state = bugWalksIntoClaudia();
    state.player.invulnerable = 1;
    step(state, input(), 5);
    expect(state.mode).toBe('playing');
    expect(state.lives).toBe(3);
  });

  it('landing on a bug works while Claudia is invulnerable', () => {
    const state = step(fallingOnBug({ invulnerable: 1 }));
    expect(state.bugs[0].alive).toBe(false);
    expect(state.score).toBe(100);
  });

  it('landing on two bugs at once defeats both, without dying', () => {
    const state = fallingOnBug();
    Object.assign(state.bugs[1], { x: 712, y: 462 });
    step(state);
    expect(state.mode).toBe('playing');
    expect(state.bugs[0].alive).toBe(false);
    expect(state.bugs[1].alive).toBe(false);
    expect(state.score).toBe(200);
  });

  it('landing on one bug while touching a second one from the side: the first is defeated, no death', () => {
    const state = fallingOnBug();
    Object.assign(state.bugs[1], { x: 700, y: 430 }); // at body height
    step(state);
    expect(state.mode).toBe('playing');
    expect(state.lives).toBe(3);
    expect(state.bugs[0].alive).toBe(false);
    expect(state.bugs[1].alive).toBe(true);
    expect(state.score).toBe(100);
  });

  it('a defeated bug neither counts as landing nor hurts and vanishes after 36 steps', () => {
    let state = fallingOnBug();
    state.bugs[0].alive = false;
    state = step(state);
    expect(state.mode).toBe('playing');
    expect(state.score).toBe(0);
    expect(state.player.vy).toBeGreaterThan(0);
    state = step(state, input(), 35);
    expect(state.bugs[0].deadTime).toBeCloseTo(0.6);
  });

  it('after a death all bugs are back at their start, also defeated ones', () => {
    let state = fallingIntoPit();
    state.bugs[0].alive = false;
    state.bugs[1].x = 1500;
    state = endOfDeath(untilDying(state));
    expect(state.mode).toBe('playing');
    expect(state.bugs.every((b) => b.alive && b.vx === -60)).toBe(true);
    expect(state.bugs[0].x).toBe(708);
    expect(state.bugs[1].x).toBe(40 * 32 + 4);
  });

  it('bugs walk on during the death sequence', () => {
    let state = untilDying(fallingIntoPit());
    const x = state.bugs[0].x;
    state = step(state, input(), 30);
    expect(state.bugs[0].x).not.toBe(x);
  });

  it('bugs stand still once the level is won', () => {
    const state = createGame(level);
    state.mode = 'won';
    step(state, input(), 30);
    expect(state.bugs[0].x).toBe(708);
  });
});

describe('reaching the goal', () => {
  function touchingGoalWithFeet(): GameState {
    const state = createGame(level);
    // Terminal: x 4000–4048, y 416–480. Claudia rising, only her feet reach into it.
    Object.assign(state.player, { x: 3990, y: 392, vy: -100, onGround: false });
    return step(state);
  }

  it('is won when only the feet touch the terminal in a jump', () => {
    const state = touchingGoalWithFeet();
    expect(state.mode).toBe('won');
    expect(state.player.y + 28).toBeGreaterThan(416);
    expect(state.player.y).toBeLessThan(416);
  });

  it('does not move Claudia any more once won', () => {
    let state = touchingGoalWithFeet();
    const { x, y } = state.player;
    state = step(state, ALL_KEYS, 30);
    expect(state.mode).toBe('won');
    expect(state.player.x).toBe(x);
    expect(state.player.y).toBe(y);
  });

  it('ENTER while playing changes nothing', () => {
    const withEnter = step(createGame(level), ENTER, 10);
    const without = step(createGame(level), input(), 10);
    expect(withEnter.mode).toBe('playing');
    expect(withEnter).toEqual(without);
  });

  it('ENTER after winning starts level 1 again at the start, with score, tokens and lives reset', () => {
    let state = touchingGoalWithFeet();
    state.camX = 3200;
    state.score = 500;
    state.tokenCount = 40;
    state.lives = 1;
    state.tokens[0].taken = true;
    state = step(state, ENTER);
    expect(state.mode).toBe('playing');
    expect(state.player.x).toBe(69);
    expect(state.player.y).toBe(452);
    expect(state.camX).toBe(0);
    expect(state.score).toBe(0);
    expect(state.tokenCount).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.tokens[0].taken).toBe(false);
  });
});
