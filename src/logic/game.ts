import { EPS, RESPAWN_DELAY, VIEW_H } from '../config';
import type { LevelData } from '../level/types';
import { cameraX } from './camera';
import type { InputState } from './input';
import { createPlayer, rectOf, stepPlayer, type Player } from './player';
import { overlaps } from './rect';
import { buildWorld, type World } from './world';

export type GameMode = 'playing' | 'respawning' | 'won';

export interface GameState {
  mode: GameMode;
  level: LevelData;
  world: World;
  player: Player;
  camX: number;
  respawnTimer: number;
}

export function createGame(level: LevelData): GameState {
  const world = buildWorld(level);
  const player = createPlayer(world);
  return { mode: 'playing', level, world, player, camX: cameraX(player, world), respawnTimer: 0 };
}

/** One fixed logic step. Returns the new state (a new object after a restart). */
export function stepGame(state: GameState, input: InputState, dt: number): GameState {
  switch (state.mode) {
    case 'playing':
      stepPlayer(state.player, input, state.world, dt);
      state.camX = cameraX(state.player, state.world);
      if (state.player.y > VIEW_H) {
        // Fell out of the picture at the bottom. The camera stays where it is.
        state.mode = 'respawning';
        state.respawnTimer = RESPAWN_DELAY;
      } else if (overlaps(rectOf(state.player), state.world.goalRect)) {
        state.mode = 'won';
      }
      return state;

    case 'respawning':
      state.respawnTimer -= dt;
      if (state.respawnTimer <= EPS) {
        state.player = createPlayer(state.world);
        state.camX = cameraX(state.player, state.world);
        state.respawnTimer = 0;
        state.mode = 'playing';
      }
      return state;

    case 'won':
      // Only ENTER works: start the same level again, without reloading.
      return input.enterPressed ? createGame(state.level) : state;
  }
}
