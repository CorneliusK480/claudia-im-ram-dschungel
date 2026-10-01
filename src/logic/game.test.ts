import { describe, expect, it } from 'vitest';
import { STEP } from '../config';
import { loadLevel1 } from '../test/level1';
import { createGame, stepGame, type GameState } from './game';
import { NO_INPUT, type InputState } from './input';

const level = loadLevel1();
const input = (over: Partial<InputState> = {}): InputState => ({ ...NO_INPUT, ...over });

function step(state: GameState, inp = input(), n = 1): GameState {
  for (let i = 0; i < n; i++) state = stepGame(state, inp, STEP);
  return state;
}

/** A game with Claudia falling into the third pit (columns 84–87). */
function fallingIntoPit(): GameState {
  const state = createGame(level);
  Object.assign(state.player, { x: 2740, y: 470, onGround: false });
  state.camX = 2270;
  return state;
}

describe('falling into a pit', () => {
  it('respawns at the start exactly 30 steps (0.5 s) after leaving the picture', () => {
    let state = fallingIntoPit();
    while (state.mode === 'playing') {
      state = step(state);
      if (state.mode === 'playing') expect(state.player.y).toBeLessThanOrEqual(544);
    }
    expect(state.mode).toBe('respawning');
    expect(state.player.y).toBeGreaterThan(544);

    state = step(state, input(), 29);
    expect(state.mode).toBe('respawning');
    state = step(state);
    expect(state.mode).toBe('playing');
    expect(state.player.x).toBe(69);
    expect(state.player.y).toBe(452);
    expect(state.camX).toBe(0);
  });

  it('keeps the camera still while respawning', () => {
    let state = fallingIntoPit();
    while (state.mode === 'playing') state = step(state);
    const camX = state.camX;
    expect(camX).toBeGreaterThan(0);
    for (let i = 0; i < 29; i++) {
      state = step(state, input({ right: true, jumpPressed: true, jumpHeld: true }));
      expect(state.camX).toBe(camX);
    }
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
    state = step(state, input({ right: true, jumpPressed: true, jumpHeld: true }), 30);
    expect(state.mode).toBe('won');
    expect(state.player.x).toBe(x);
    expect(state.player.y).toBe(y);
  });

  it('ENTER while playing changes nothing', () => {
    const withEnter = step(createGame(level), input({ enterPressed: true }), 10);
    const without = step(createGame(level), input(), 10);
    expect(withEnter.mode).toBe('playing');
    expect(withEnter).toEqual(without);
  });

  it('ENTER after winning starts level 1 again at the start', () => {
    let state = touchingGoalWithFeet();
    state.camX = 3200;
    state = step(state, input({ enterPressed: true }));
    expect(state.mode).toBe('playing');
    expect(state.player.x).toBe(69);
    expect(state.player.y).toBe(452);
    expect(state.camX).toBe(0);
  });
});
