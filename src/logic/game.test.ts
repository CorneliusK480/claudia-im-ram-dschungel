import { describe, expect, it } from 'vitest';
import { STEP } from '../config';
import { playingGame } from '../test/game';
import { loadLevel1 } from '../test/level1';
import { fixedRandom } from '../test/random';
import { texts } from '../texts';
import { burst } from './effects';
import { createGame, musicFor, pauseGame, startLevel, stepGame, timeBonus, type GameState } from './game';
import { NO_INPUT, type InputState } from './input';

const level = loadLevel1();
const input = (over: Partial<InputState> = {}): InputState => ({ ...NO_INPUT, ...over });
const ENTER = input({ enterPressed: true });
const PAUSE = input({ pausePressed: true });
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
  const state = putIntoPit(playingGame(random));
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
    const state = playingGame(fixedRandom([0.5]));
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
    const state = playingGame();
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
  function gameOver(highscore = 0): GameState {
    let state = playingGame(fixedRandom([0.5]));
    state.highscore = highscore;
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

  /** Waits until keys work (step 72 is the first). */
  const afterLock = (state: GameState) => step(state, input(), 71);

  it('comes after the death sequence of the last life', () => {
    gameOver();
  });

  it('raises the highscore to the full score if it is higher, else keeps it', () => {
    expect(gameOver().highscore).toBe(230);
    expect(gameOver(5000).highscore).toBe(5000);
  });

  it('ENTER and P work only from 1.2 s (step 72) on', () => {
    for (const key of [ENTER, PAUSE]) {
      let state = step(gameOver(), input(), 70);
      state = step(state, key);
      expect(state.mode).toBe('gameOver');
      state = step(state, key);
      expect(state.mode).not.toBe('gameOver');
    }
  });

  it('ENTER or jump start the same level anew with intro, 3 lives, score 0 and tokens 0', () => {
    for (const key of [ENTER, input({ jumpPressed: true, jumpHeld: true })]) {
      let state = afterLock(gameOver());
      state = step(state, key);
      expect(state.mode).toBe('intro');
      expect(state.lives).toBe(3);
      expect(state.score).toBe(0);
      expect(state.tokenCount).toBe(0);
      expect(state.highscore).toBe(230);
      expect(state.levelTime).toBe(0);
      expect(state.tokens).toHaveLength(49);
      expect(state.tokens.every((t) => !t.taken)).toBe(true);
      expect(state.checkpoints[0].active).toBe(false);
      expect(state.bugs).toHaveLength(7);
      expect(state.bugs.every((b) => b.alive)).toBe(true);
      expect(state.bugs[0].x).toBe(708);
      expect(state.spawn).toEqual({ x: 69, y: 452 });
      expect(state.player).toMatchObject({ x: 69, y: 452 });
      expect(state.camX).toBe(0);
    }
  });

  it('P or ESC lead to the title, keeping the highscore; a new start begins at 0', () => {
    let state = step(afterLock(gameOver()), PAUSE);
    expect(state.mode).toBe('title');
    expect(state.highscore).toBe(230);
    state = step(state, ENTER);
    expect(state.mode).toBe('intro');
    expect(state.score).toBe(0);
    expect(state.tokenCount).toBe(0);
  });

  it('other keys do nothing, also after 1.2 s', () => {
    const state = step(gameOver(), input({ left: true, right: true, jumpHeld: true }), 200);
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
    const state = playingGame(fixedRandom([0.5]));
    Object.assign(state.player, { x: 709, y: 462 - 28 - 5, vy: 600, onGround: false, ...over });
    return state;
  }

  /** Claudia standing on the ground just left of the first bug, which walks into her. */
  function bugWalksIntoClaudia(): GameState {
    const state = playingGame(fixedRandom([0.5]));
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

  it('bugs walk on once the level is won, Claudia does not move', () => {
    const state = playingGame();
    state.mode = 'won';
    const { x, y } = state.player;
    step(state, input({ right: true }), 30);
    expect(state.bugs[0].x).toBeLessThan(708);
    expect(state.player).toMatchObject({ x, y });
  });
});

describe('reaching the goal', () => {
  function touchingGoalWithFeet(): GameState {
    const state = playingGame();
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
    const withEnter = step(playingGame(), ENTER, 10);
    const without = step(playingGame(), input(), 10);
    expect(withEnter.mode).toBe('playing');
    expect(withEnter).toEqual(without);
  });

  it('gives 500 points plus the time bonus and 40 particles in the accent colour', () => {
    const state = playingGame();
    state.score = 120;
    state.levelTime = 100.5;
    Object.assign(state.player, { x: 3990, y: 392, vy: -100, onGround: false });
    step(state);
    expect(state.mode).toBe('won');
    expect(state.goalBonus).toBe(697);
    expect(state.score).toBe(120 + 500 + 697);
    expect(state.effects.particles).toHaveLength(40);
    expect(state.effects.particles.every((q) => q.color === level.theme.accent)).toBe(true);
  });

  it('ENTER or jump work only from 1.2 s (step 72) on and lead to the title with a fresh game', () => {
    for (const key of [ENTER, input({ jumpPressed: true, jumpHeld: true })]) {
      let state = touchingGoalWithFeet();
      const score = state.score;
      expect(score).toBeGreaterThan(500);
      state.tokenCount = 40;
      state.lives = 1;
      state = step(state, key, 71);
      expect(state.mode).toBe('won');
      state = step(state, key);
      expect(state.mode).toBe('title');
      expect(state.score).toBe(0);
      expect(state.tokenCount).toBe(0);
      expect(state.lives).toBe(3);
      expect(state.highscore).toBe(score);
    }
  });

  it('keeps a higher old highscore', () => {
    let state = touchingGoalWithFeet();
    state.highscore = 99999;
    state = step(state, ENTER, 72);
    expect(state.mode).toBe('title');
    expect(state.highscore).toBe(99999);
  });
});

describe('title screen', () => {
  const title = () => createGame(level, fixedRandom([0.5]));

  it('createGame starts on the title with 3 lives, score 0, tokens 0 and the camera at 0', () => {
    const state = title();
    expect(state.mode).toBe('title');
    expect(state.lives).toBe(3);
    expect(state.score).toBe(0);
    expect(state.tokenCount).toBe(0);
    expect(state.camX).toBe(0);
  });

  it('moves the camera 60 px/s and starts over after 3200 px', () => {
    let state = step(title(), input(), 60);
    expect(state.camX).toBeCloseTo(60);
    state = step(state, input(), 3150);
    expect(state.camX).toBeCloseTo(10);
  });

  it('bugs stand still, animation time goes on', () => {
    const state = step(title(), input(), 60);
    expect(state.bugs[0].x).toBe(708);
    expect(state.time).toBeCloseTo(1);
  });

  it('ENTER or the jump key starts the intro with a fresh game', () => {
    for (const key of [ENTER, input({ jumpPressed: true, jumpHeld: true })]) {
      const state = step(title(), key);
      expect(state.mode).toBe('intro');
      expect(state.score).toBe(0);
      expect(state.tokenCount).toBe(0);
      expect(state.lives).toBe(3);
      expect(state.checkpoints[0].active).toBe(false);
    }
  });

  it('stays without a key or with ← and →', () => {
    expect(step(title(), input(), 30).mode).toBe('title');
    expect(step(title(), input({ left: true, right: true }), 30).mode).toBe('title');
  });
});

describe('level intro', () => {
  const intro = () => startLevel(createGame(level, fixedRandom([0.5])), 0, 0);

  it('switches to playing after 150 steps (2.5 s), not before', () => {
    let state = step(intro(), input(), 149);
    expect(state.mode).toBe('intro');
    state = step(state);
    expect(state.mode).toBe('playing');
  });

  it('bugs walk, Claudia stays at the start, also with the arrow keys held', () => {
    const state = step(intro(), input({ left: true, right: true }), 100);
    expect(state.bugs[0].x).toBeLessThan(708);
    expect(state.player).toMatchObject({ x: 69, y: 452 });
  });

  it('ENTER or jump before 0.4 s (step 23) changes nothing, from step 24 on it starts playing', () => {
    for (const key of [ENTER, input({ jumpPressed: true, jumpHeld: true })]) {
      let state = step(intro(), input(), 22);
      state = step(state, key);
      expect(state.mode).toBe('intro');
      state = step(state, key);
      expect(state.mode).toBe('playing');
    }
  });

  it('the key that skips the intro does not make Claudia jump', () => {
    let state = step(intro(), input(), 23);
    state = step(state, input({ jumpPressed: true, jumpHeld: true }));
    expect(state.mode).toBe('playing');
    expect(state.player).toMatchObject({ vy: 0, onGround: true });
    state = step(state, input({ jumpHeld: true }));
    expect(state.player).toMatchObject({ vy: 0, onGround: true });
  });
});

describe('pause', () => {
  /** Playing, Claudia running right, a few particles in the air. */
  function running(): GameState {
    const state = step(playingGame(fixedRandom([0.5])), input({ right: true }), 30);
    burst(state.effects, state.random, 300, 300, '#fff', 4);
    return state;
  }

  /** Everything that must stand still in the pause. */
  const frozen = (s: GameState) => structuredClone({
    player: s.player, bugs: s.bugs, effects: s.effects, camX: s.camX, levelTime: s.levelTime,
  });

  it('P pauses; nothing moves in that step and 60 steps after, only the animation time goes on', () => {
    let state = running();
    const before = frozen(state);
    const time = state.time;
    state = step(state, { ...PAUSE, right: true });
    expect(state.mode).toBe('paused');
    expect(frozen(state)).toEqual(before);
    state = step(state, input({ left: true, right: true, jumpHeld: true }), 60);
    expect(state.mode).toBe('paused');
    expect(frozen(state)).toEqual(before);
    expect(state.time).toBeCloseTo(time + 1);
  });

  it('jump and ← → do nothing in the pause', () => {
    const state = step(step(running(), PAUSE), input({ left: true, right: true, jumpPressed: true, jumpHeld: true }), 5);
    expect(state.mode).toBe('paused');
  });

  it('P, ESC (both pausePressed) and ENTER go on playing', () => {
    for (const key of [PAUSE, ENTER]) {
      expect(step(step(running(), PAUSE), key).mode).toBe('playing');
    }
  });

  it('P does nothing on the title, in the intro, while dying, once won and in game over before 1.2 s', () => {
    const title = createGame(level, fixedRandom([0.5]));
    expect(step(title, PAUSE).mode).toBe('title');
    const intro = startLevel(createGame(level, fixedRandom([0.5])), 0, 0);
    expect(step(intro, PAUSE).mode).toBe('intro');
    expect(step(untilDying(fallingIntoPit()), PAUSE).mode).toBe('dying');
    const won = playingGame();
    won.mode = 'won';
    expect(step(won, PAUSE).mode).toBe('won');
    const over = playingGame();
    over.mode = 'gameOver';
    expect(step(over, PAUSE, 70).mode).toBe('gameOver');
  });

  it('pauseGame works only while playing', () => {
    expect(pauseGame(playingGame()).mode).toBe('paused');
    const modes = ['title', 'intro', 'dying', 'won', 'gameOver'] as const;
    for (const mode of modes) {
      const state = playingGame();
      state.mode = mode;
      expect(pauseGame(state).mode).toBe(mode);
    }
  });
});

describe('level time', () => {
  it('is about 1 s after 60 steps of playing', () => {
    expect(step(playingGame(), input(), 60).levelTime).toBeCloseTo(1);
  });

  it('stands still in the intro', () => {
    const intro = startLevel(createGame(level, fixedRandom([0.5])), 0, 0);
    expect(step(intro, input(), 149).levelTime).toBe(0);
  });

  it('stands still in the pause and goes on afterwards', () => {
    let state = step(playingGame(), input(), 60);
    state = step(state, PAUSE);
    state = step(state, input(), 60);
    expect(state.levelTime).toBeCloseTo(1);
    state = step(step(state, PAUSE), input(), 60);
    expect(state.levelTime).toBeCloseTo(2);
  });

  it('stands still in the death sequence and is not reset by the respawn', () => {
    let state = untilDying(fallingIntoPit());
    const t = state.levelTime;
    expect(t).toBeGreaterThan(0);
    state = endOfDeath(state);
    expect(state.mode).toBe('playing');
    expect(state.levelTime).toBe(t);
  });
});

describe('sounds', () => {
  const JUMP_KEY = input({ jumpPressed: true, jumpHeld: true });

  /** Claudia falling onto the first bug, her feet 5 px above it. */
  function fallingOnBug(): GameState {
    const state = playingGame(fixedRandom([0.5]));
    Object.assign(state.player, { x: 709, y: 462 - 28 - 5, vy: 600, onGround: false });
    return state;
  }

  /** All events of `n` steps. */
  function eventsOf(state: GameState, inp: InputState, n: number): string[] {
    const all: string[] = [];
    for (let i = 0; i < n; i++) {
      state = step(state, inp);
      all.push(...state.events);
    }
    return all;
  }

  it('a jump from the ground sounds once, in its step only', () => {
    let state = step(playingGame(), JUMP_KEY);
    expect(state.events).toEqual(['jump']);
    state = step(state, input({ jumpHeld: true }));
    expect(state.events).toEqual([]);
  });

  it('holding the jump key without a new press makes no jump sound', () => {
    expect(eventsOf(step(playingGame(), JUMP_KEY), input({ jumpHeld: true }), 120)).not.toContain('jump');
  });

  it('bouncing off a bug is a stomp, not a jump', () => {
    expect(step(fallingOnBug(), input({ jumpHeld: true })).events).toEqual(['stomp']);
  });

  it('two bugs at once sound twice', () => {
    const state = fallingOnBug();
    Object.assign(state.bugs[1], { x: 712, y: 462 });
    expect(step(state).events).toEqual(['stomp', 'stomp']);
  });

  it('the jump key that starts the game or skips the intro makes no sound', () => {
    let state = step(createGame(level), JUMP_KEY);
    expect(state.mode).toBe('intro');
    expect(state.events).toEqual([]);
    state = step(step(state, input(), 23), JUMP_KEY);
    expect(state.mode).toBe('playing');
    expect(state.events).toEqual([]);
    expect(step(state, input({ jumpHeld: true })).events).toEqual([]);
  });

  it('a fall into a pit and a bug from the side sound "hurt"', () => {
    expect(untilDying(fallingIntoPit()).events).toEqual(['hurt']);
    const state = playingGame(fixedRandom([0.5]));
    Object.assign(state.player, { x: 708 - 22 - 0.5, y: 452, onGround: true });
    expect(step(state).events).toEqual(['hurt']);
  });

  it('a checkpoint sounds "save" once', () => {
    let state = playingGame(fixedRandom([0.5]));
    Object.assign(state.player, { x: 64 * 32, y: 300, vy: -100, onGround: false });
    state = step(state);
    expect(state.events).toEqual(['save']);
    expect(step(state).events).toEqual([]);
  });

  it('the goal sounds "win"', () => {
    const state = playingGame();
    Object.assign(state.player, { x: 3990, y: 392, vy: -100, onGround: false });
    expect(step(state).events).toEqual(['win']);
  });

  it('the end of the last death sequence sounds "over"; a respawn makes no sound', () => {
    let state = step(untilDying(fallingIntoPit()), input(), 191);
    state = step(state);
    expect(state.mode).toBe('playing');
    expect(state.events).toEqual([]);
    state.lives = 0;
    state = step(untilDying(putIntoPit(state)), input(), 191);
    expect(state.events).toEqual([]);
    state = step(state);
    expect(state.mode).toBe('gameOver');
    expect(state.events).toEqual(['over']);
  });

  it('makes no sound in the pause, on the title, in the intro and at game over, with any keys', () => {
    const keys = input({ left: true, right: true, jumpPressed: true, jumpHeld: true, enterPressed: true });
    const paused = step(playingGame(), PAUSE);
    expect(eventsOf(paused, input({ left: true, right: true, jumpPressed: true, jumpHeld: true }), 60)).toEqual([]);
    expect(eventsOf(createGame(level), keys, 1)).toEqual([]);
    expect(eventsOf(startLevel(createGame(level), 0, 0), keys, 23)).toEqual([]);
    const over = playingGame();
    over.mode = 'gameOver';
    expect(eventsOf(over, keys, 72)).toEqual([]);
  });
});

describe('musicFor', () => {
  it('is the level track on the title, in the intro, playing, paused, dying and won', () => {
    expect(musicFor(createGame(level))).toBe('jungle');
    expect(musicFor(startLevel(createGame(level), 0, 0))).toBe('jungle');
    for (const mode of ['playing', 'paused', 'dying', 'won'] as const) {
      const state = playingGame();
      state.mode = mode;
      expect(musicFor(state)).toBe('jungle');
    }
  });

  it('is no music at game over, and the level track again after "again" (ENTER) and "menu" (P)', () => {
    for (const key of [ENTER, PAUSE]) {
      let state = playingGame();
      state.mode = 'gameOver';
      expect(musicFor(state)).toBeNull();
      state = step(state, key, 72);
      expect(state.mode).not.toBe('gameOver');
      expect(musicFor(state)).toBe('jungle');
    }
  });
});

describe('timeBonus', () => {
  it('gives 5 points per second below 240 s, rounded down, never below 0', () => {
    let oneSecond = 0;
    for (let i = 0; i < 60; i++) oneSecond += STEP;
    expect(timeBonus(0)).toBe(1200);
    expect(timeBonus(oneSecond)).toBe(1195);
    expect(timeBonus(100.5)).toBe(697);
    expect(timeBonus(239.9)).toBe(0);
    expect(timeBonus(240)).toBe(0);
    expect(timeBonus(300)).toBe(0);
  });
});
