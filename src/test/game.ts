import { createGame, startLevel, type GameState } from '../logic/game';
import type { Random } from '../logic/random';
import { loadLevel1 } from './level1';

const level = loadLevel1();

/** A fresh game of level 1, already playing: without the title and without waiting for the intro. */
export function playingGame(random?: Random): GameState {
  const state = startLevel(createGame(level, random), 0, 0);
  state.mode = 'playing';
  state.modeTime = 0;
  return state;
}
