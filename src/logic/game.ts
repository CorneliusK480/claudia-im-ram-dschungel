import {
  BOUNCE, BOUNCE_HELD, BUG_H, BUG_PARTICLE_COLOR, BUG_POINTS, BUG_W, DEATH_COLOR, DEATH_SHAKE, DEATH_SKIP_AFTER, DEATH_TIME, EPS, GAMEOVER_INPUT_AFTER,
  INVULNERABLE_TIME, JUMP, PIT_Y, PLAYER_W, SCORE_COLOR, START_LIVES, TILE, TOKEN_LIFE_EVERY,
  TOKEN_POINTS, TOKEN_TEXT_EVERY, VIEW_H,
} from '../config';
import type { LevelData } from '../level/types';
import { texts } from '../texts';
import { bugRect, buildBugs, isStomp, stepBug, type Bug } from './bugs';
import { cameraX } from './camera';
import { buildCheckpoints, spawnOf, touchesCheckpoint, type Checkpoint } from './checkpoints';
import { burst, createEffects, say, stepEffects, type Effects } from './effects';
import type { InputState } from './input';
import { createPlayer, rectOf, stepPlayer, type Player } from './player';
import { pick, type Random } from './random';
import { overlaps } from './rect';
import { buildTokens, touchesToken, type Token } from './tokens';
import { buildWorld, type World } from './world';

export type GameMode = 'playing' | 'dying' | 'gameOver' | 'won';

export interface GameState {
  mode: GameMode;
  /** Seconds since the current mode began. */
  modeTime: number;
  level: LevelData;
  world: World;
  player: Player;
  camX: number;
  lives: number;
  score: number;
  tokenCount: number;
  /** Where Claudia comes back after a death: the start or the last checkpoint. */
  spawn: { x: number; y: number };
  tokens: Token[];
  bugs: Bug[];
  checkpoints: Checkpoint[];
  effects: Effects;
  deathMessage: string;
  /** Game time in seconds, drives animations. Stops when the game stops. */
  time: number;
  random: Random;
}

/** A fresh level: everything is built anew from the level data. */
export function createGame(level: LevelData, random: Random = Math.random): GameState {
  const world = buildWorld(level);
  const player = createPlayer(world);
  return {
    mode: 'playing',
    modeTime: 0,
    level,
    world,
    player,
    camX: cameraX(player, world),
    lives: START_LIVES,
    score: 0,
    tokenCount: 0,
    spawn: { ...world.startPos },
    tokens: buildTokens(level),
    bugs: buildBugs(level),
    checkpoints: buildCheckpoints(level),
    effects: createEffects(),
    deathMessage: '',
    time: 0,
    random,
  };
}

/** One fixed logic step. Returns the new state (a new object after a restart). */
export function stepGame(state: GameState, input: InputState, dt: number): GameState {
  state.modeTime += dt;
  switch (state.mode) {
    case 'playing':
      state.time += dt;
      stepEffects(state.effects, dt);
      stepPlayer(state.player, input, state.world, dt);
      if (state.player.y > PIT_Y) {
        die(state);
        return state;
      }
      stepBugs(state, dt);
      if (touchBugs(state, input)) return state;
      collectTokens(state);
      checkCheckpoints(state);
      if (overlaps(rectOf(state.player), state.world.goalRect)) setMode(state, 'won');
      state.camX = cameraX(state.player, state.world);
      return state;

    case 'dying': {
      // The world goes on, Claudia is gone, the camera stands still.
      state.time += dt;
      stepEffects(state.effects, dt);
      stepBugs(state, dt);
      const skip = input.enterPressed && state.modeTime >= DEATH_SKIP_AFTER - EPS;
      if (skip || state.modeTime >= DEATH_TIME - EPS) {
        if (state.lives > 0) respawn(state);
        else setMode(state, 'gameOver');
      }
      return state;
    }

    case 'gameOver':
      // Everything stands still. ENTER starts the level anew, but only after a short moment.
      return input.enterPressed && state.modeTime >= GAMEOVER_INPUT_AFTER - EPS
        ? createGame(state.level, state.random)
        : state;

    case 'won':
      // Everything stands still. Only ENTER works: start the same level again, without reloading.
      return input.enterPressed ? createGame(state.level, state.random) : state;
  }
}

function setMode(state: GameState, mode: GameMode): void {
  state.mode = mode;
  state.modeTime = 0;
}

function die(state: GameState): void {
  const { player, effects } = state;
  state.lives -= 1;
  state.deathMessage = pick(texts.deathMessages, state.random);
  effects.shake = DEATH_SHAKE;
  // Kept inside the picture, so the particles are visible after a fall into a pit.
  const y = Math.min(player.y + 14, VIEW_H - 10);
  burst(effects, state.random, player.x + PLAYER_W / 2, y, DEATH_COLOR, 30, 320);
  setMode(state, 'dying');
}

/** Back at the spawn point. Like in Super Mario, bugs and tokens come back; score, tokens and checkpoint stay. */
function respawn(state: GameState): void {
  state.bugs = buildBugs(state.level);
  state.tokens = buildTokens(state.level);
  state.player = createPlayer(state.world, state.spawn);
  state.player.invulnerable = INVULNERABLE_TIME;
  state.camX = cameraX(state.player, state.world);
  setMode(state, 'playing');
}

function stepBugs(state: GameState, dt: number): void {
  for (const bug of state.bugs) {
    if (bug.alive) stepBug(bug, state.world, dt);
    else bug.deadTime += dt;
  }
}

/**
 * First finds all bugs Claudia touches, then decides: landing on at least one defeats all bugs she
 * lands on, and touches from the side in the same step do not count. Returns true if Claudia died.
 */
function touchBugs(state: GameState, input: InputState): boolean {
  const { player, effects } = state;
  const touched = state.bugs.filter((b) => b.alive && overlaps(rectOf(player), bugRect(b)));
  // Decided by the falling speed before bouncing off.
  const stomped = touched.filter((b) => isStomp(player, b));
  if (stomped.length > 0) {
    for (const bug of stomped) {
      bug.alive = false;
      bug.deadTime = 0;
      state.score += BUG_POINTS;
      burst(effects, state.random, bug.x + BUG_W / 2, bug.y + BUG_H / 2, BUG_PARTICLE_COLOR, 14);
      say(effects, bug.x, bug.y - 14, pick(texts.bugMessages, state.random), '#fff');
    }
    player.vy = -(input.jumpHeld ? BOUNCE_HELD : BOUNCE) * JUMP;
    player.onGround = false;
    return false;
  }
  if (touched.length > 0 && player.invulnerable <= EPS) {
    die(state);
    return true;
  }
  return false;
}

function collectTokens(state: GameState): void {
  const { player, effects } = state;
  for (const token of state.tokens) {
    if (token.taken || !touchesToken(player, token)) continue;
    token.taken = true;
    state.tokenCount += 1;
    state.score += TOKEN_POINTS;
    burst(effects, state.random, token.x, token.y, state.level.theme.accent, 6);
    if (state.tokenCount % TOKEN_LIFE_EVERY === 0) {
      state.lives += 1;
      say(effects, player.x, player.y - 16, texts.oneUp, SCORE_COLOR);
    } else if (state.tokenCount % TOKEN_TEXT_EVERY === 0) {
      say(effects, token.x, token.y, texts.contextTokens(state.tokenCount), state.level.theme.accent);
    }
  }
}

function checkCheckpoints(state: GameState): void {
  for (const cp of state.checkpoints) {
    if (cp.active || !touchesCheckpoint(state.player, cp)) continue;
    cp.active = true;
    state.spawn = spawnOf(cp);
    say(state.effects, cp.col * TILE, 14 * TILE - 10, texts.autosave, SCORE_COLOR);
  }
}
