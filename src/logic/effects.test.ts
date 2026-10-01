import { describe, expect, it } from 'vitest';
import { STEP } from '../config';
import { playingGame } from '../test/game';
import { fixedRandom } from '../test/random';
import { burst, createEffects, say, stepEffects } from './effects';
import { stepGame, type GameState } from './game';
import { NO_INPUT } from './input';

function steps(state: GameState, n: number): GameState {
  for (let i = 0; i < n; i++) state = stepGame(state, NO_INPUT, STEP);
  return state;
}

describe('floating texts', () => {
  it('are still there after 77 steps and gone after 78 (1.3 s)', () => {
    let state = playingGame();
    say(state.effects, 100, 300, 'Hallo', '#fff');
    state = steps(state, 77);
    expect(state.effects.texts).toHaveLength(1);
    state = steps(state, 1);
    expect(state.effects.texts).toHaveLength(0);
  });
});

describe('particles', () => {
  it('disappear when their life is over', () => {
    const effects = createEffects();
    // random 0.5 → life 0.5 + 0.5 · 0.4 = 0.7 s = 42 steps
    burst(effects, fixedRandom([0.5]), 100, 100, '#fff', 3);
    expect(effects.particles).toHaveLength(3);
    for (let i = 0; i < 41; i++) stepEffects(effects, STEP);
    expect(effects.particles).toHaveLength(3);
    stepEffects(effects, STEP);
    expect(effects.particles).toHaveLength(0);
  });

  it('fall with gravity', () => {
    const effects = createEffects();
    burst(effects, fixedRandom([0.5]), 100, 100, '#fff', 1);
    const vy = effects.particles[0].vy;
    stepEffects(effects, STEP);
    expect(effects.particles[0].vy).toBeCloseTo(vy + 10);
  });

  it('fly on once the level is won', () => {
    const state = playingGame(fixedRandom([0.5]));
    burst(state.effects, state.random, 100, 100, '#fff', 4);
    state.mode = 'won';
    const { x, y } = state.effects.particles[0];
    steps(state, 10);
    expect(state.effects.particles[0].x).not.toBe(x);
    expect(state.effects.particles[0].y).not.toBe(y);
  });
});

describe('screen shake', () => {
  it('counts down to 0 and not below', () => {
    const effects = createEffects();
    effects.shake = 0.3;
    for (let i = 0; i < 18; i++) stepEffects(effects, STEP);
    expect(effects.shake).toBeCloseTo(0);
    stepEffects(effects, STEP);
    expect(effects.shake).toBe(0);
  });
});
