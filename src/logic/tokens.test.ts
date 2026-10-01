import { describe, expect, it } from 'vitest';
import { STEP } from '../config';
import { loadLevel1 } from '../test/level1';
import { fixedRandom } from '../test/random';
import { texts } from '../texts';
import { createGame, stepGame, type GameState } from './game';
import { NO_INPUT } from './input';
import { createPlayer } from './player';
import { buildTokens, touchesToken } from './tokens';
import { buildWorld } from './world';

const level = loadLevel1();
const world = buildWorld(level);

/** A game with Claudia's centre exactly on the first token (x 304, y 336), floating in the air. */
function onFirstToken(): GameState {
  const state = createGame(level, fixedRandom([0.5]));
  const token = state.tokens[0];
  Object.assign(state.player, { x: token.x - 11, y: token.y - 14, onGround: false });
  return state;
}

const step = (state: GameState) => stepGame(state, NO_INPUT, STEP);
const textsOf = (state: GameState) => state.effects.texts.map((t) => t.text);

describe('buildTokens (level 1)', () => {
  const tokens = buildTokens(level);

  it('has exactly 49 tokens', () => {
    expect(tokens).toHaveLength(49);
  });

  it('has no token in columns 78–80 (only bait tokens there)', () => {
    expect(tokens.some((t) => t.x >= 78 * 32 && t.x < 81 * 32)).toBe(false);
  });

  it('puts the first token in the middle of column 9, row 10', () => {
    expect(tokens[0]).toEqual({ x: 304, y: 336, taken: false });
  });
});

describe('touchesToken', () => {
  const token = { x: 304, y: 336, taken: false };
  const centredAt = (cx: number, cy: number) => ({ ...createPlayer(world), x: cx - 11, y: cy - 14 });

  it('touches just inside 20 px sideways and 22 px up or down', () => {
    expect(touchesToken(centredAt(304 - 19.9, 336), token)).toBe(true);
    expect(touchesToken(centredAt(304, 336 + 21.9), token)).toBe(true);
  });

  it('does not touch at exactly 20 px sideways or 22 px up or down', () => {
    expect(touchesToken(centredAt(304 - 20, 336), token)).toBe(false);
    expect(touchesToken(centredAt(304 + 20, 336), token)).toBe(false);
    expect(touchesToken(centredAt(304, 336 - 22), token)).toBe(false);
    expect(touchesToken(centredAt(304, 336 + 22), token)).toBe(false);
  });
});

describe('collecting tokens', () => {
  it('counts +1 token and +10 score, with 6 particles', () => {
    const state = step(onFirstToken());
    expect(state.tokens[0].taken).toBe(true);
    expect(state.tokenCount).toBe(1);
    expect(state.score).toBe(10);
    expect(state.effects.particles).toHaveLength(6);
    expect(state.effects.texts).toHaveLength(0);
  });

  it('collects a token only once', () => {
    const state = step(step(onFirstToken()));
    expect(state.tokenCount).toBe(1);
    expect(state.score).toBe(10);
  });

  it('collects nothing while dying', () => {
    const state = onFirstToken();
    state.mode = 'dying';
    step(state);
    expect(state.tokens[0].taken).toBe(false);
    expect(state.tokenCount).toBe(0);
  });

  it('collects nothing once won', () => {
    const state = onFirstToken();
    state.mode = 'won';
    step(state);
    expect(state.tokens[0].taken).toBe(false);
    expect(state.tokenCount).toBe(0);
  });

  it('shows "Kontext +25 Tokens" at the 25th token, without extra points or lives', () => {
    const state = onFirstToken();
    state.tokenCount = 24;
    step(state);
    expect(state.tokenCount).toBe(25);
    expect(state.score).toBe(10);
    expect(state.lives).toBe(3);
    expect(textsOf(state)).toEqual([texts.contextTokens(25)]);
    expect(state.effects.texts[0]).toMatchObject({ x: 304, y: 336, text: 'Kontext +25 Tokens' });
  });

  it('gives an extra life and "1UP" at the 100th token instead of the context text', () => {
    const state = onFirstToken();
    state.tokenCount = 99;
    step(state);
    expect(state.tokenCount).toBe(100);
    expect(state.score).toBe(10);
    expect(state.lives).toBe(4);
    expect(textsOf(state)).toEqual(['1UP: Neue Session!']);
  });
});
