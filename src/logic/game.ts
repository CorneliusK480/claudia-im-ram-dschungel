import {
  BONUS_PER_SECOND, BONUS_TIME_LIMIT, BOUNCE, BOUNCE_HELD, BUG_H, BUG_PARTICLE_COLOR, BUG_POINTS, BUG_W, DEATH_COLOR, DEATH_SHAKE, DEATH_SKIP_AFTER, DEATH_TIME, EPS, GAMEOVER_INPUT_AFTER,
  GOAL_INPUT_AFTER, GOAL_POINTS,  INTRO_SKIP_AFTER, INTRO_TIME, INVULNERABLE_TIME, JUMP, PIT_Y, PLAYER_W, SCORE_COLOR, START_LIVES, TILE, TOKEN_LIFE_EVERY,
  TOKEN_POINTS, TOKEN_TEXT_EVERY, VIEW_H,
} from '../config';
import type { LevelData } from '../level/types';
import { texts } from '../texts';
import { bugRect, buildBugs, isStomp, stepBug, type Bug } from './bugs';
import { cameraX, titleCameraX } from './camera';
import { buildCheckpoints, spawnOf, touchesCheckpoint, type Checkpoint } from './checkpoints';
import { burst, createEffects, say, stepEffects, type Effects } from './effects';
import type { InputState } from './input';
import { createPlayer, rectOf, stepPlayer, type Player } from './player';
import { pick, type Random } from './random';
import { overlaps } from './rect';
import { buildTokens, touchesToken, type Token } from './tokens';
import { buildWorld, type World } from './world';

export type GameMode = 'title' | 'intro' | 'playing' | 'paused' | 'dying' | 'gameOver' | 'won';

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
  /** Seconds spent playing this level. Stands still in the intro, the pause and the death sequence. */
  levelTime: number;
  /** Time bonus given at the goal. */
  goalBonus: number;
  /** Game time in seconds, drives animations only. Goes on in the pause, stops at game over. */
  time: number;
  random: Random;
  /** Best score so far. Only the logic raises it; saving it is up to main.ts. */
  highscore: number;
}

/** The title screen, with a fresh level 1 in the background. */
export function createGame(level: LevelData, random: Random = Math.random, highscore = 0): GameState {
  const world = buildWorld(level);
  const player = createPlayer(world);
  return {
    mode: 'title',
    modeTime: 0,
    level,
    world,
    player,
    camX: 0,
    lives: START_LIVES,
    score: 0,
    tokenCount: 0,
    spawn: { ...world.startPos },
    tokens: buildTokens(level),
    bugs: buildBugs(level),
    checkpoints: buildCheckpoints(level),
    effects: createEffects(),
    deathMessage: '',
    levelTime: 0,
    goalBonus: 0,
    time: 0,
    random,
    highscore,
  };
}

/**
 * A fresh level with its intro: everything is built anew from the level data.
 * Only score, token count, highscore and the random source are taken over.
 */
export function startLevel(state: GameState, score: number, tokenCount: number): GameState {
  const next = createGame(state.level, state.random, state.highscore);
  next.score = score;
  next.tokenCount = tokenCount;
  next.mode = 'intro';
  next.camX = cameraX(next.player, next.world);
  return next;
}

/** One fixed logic step. Returns the new state (a new object after a restart). */
export function stepGame(state: GameState, input: InputState, dt: number): GameState {
  state.modeTime += dt;
  // Starts, skips the intro and confirms the end screens.
  const go = input.enterPressed || input.jumpPressed;
  switch (state.mode) {
    case 'title':
      // Enemies stand still, only the camera moves.
      state.time += dt;
      state.camX = titleCameraX(state.modeTime, state.world);
      return go ? startLevel(state, 0, 0) : state;

    case 'intro':
      // The world goes on, Claudia stands at the start and cannot be hurt.
      state.time += dt;
      stepEffects(state.effects, dt);
      stepBugs(state, dt);
      if (state.modeTime >= INTRO_TIME - EPS || (go && state.modeTime >= INTRO_SKIP_AFTER - EPS)) {
        setMode(state, 'playing');
      }
      return state;

    case 'playing':
      // Nothing else happens in the step that pauses.
      if (input.pausePressed) {
        setMode(state, 'paused');
        return state;
      }
      state.levelTime += dt;
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
      if (overlaps(rectOf(state.player), state.world.goalRect)) reachGoal(state);
      state.camX = cameraX(state.player, state.world);
      return state;

    case 'paused':
      // Everything stands still, only drawn animations go on.
      state.time += dt;
      if (input.pausePressed || input.enterPressed) setMode(state, 'playing');
      return state;

    case 'dying': {
      // The world goes on, Claudia is gone, the camera stands still.
      state.time += dt;
      stepEffects(state.effects, dt);
      stepBugs(state, dt);
      const skip = input.enterPressed && state.modeTime >= DEATH_SKIP_AFTER - EPS;
      if (skip || state.modeTime >= DEATH_TIME - EPS) {
        if (state.lives > 0) {
          respawn(state);
        } else {
          state.highscore = Math.max(state.highscore, state.score);
          setMode(state, 'gameOver');
        }
      }
      return state;
    }

    case 'gameOver':
      // Everything stands still. Keys work only after a short moment.
      if (state.modeTime < GAMEOVER_INPUT_AFTER - EPS) return state;
      // Same level again, starting over at 0 like in Super Mario. Only the highscore stays.
      if (go) return startLevel(state, 0, 0);
      if (input.pausePressed) return createGame(state.level, state.random, state.highscore);
      return state;

    case 'won':
      // The world goes on without touching Claudia, she and the camera stand still.
      state.time += dt;
      stepEffects(state.effects, dt);
      stepBugs(state, dt);
      if (go && state.modeTime >= GOAL_INPUT_AFTER - EPS) {
        // Level 1 is the last level for now: save the highscore and go back to the title.
        state.highscore = Math.max(state.highscore, state.score);
        return createGame(state.level, state.random, state.highscore);
      }
      return state;
  }
}

/** max(0, (240 − seconds) · 5), rounded down. The tiny extra keeps whole seconds whole despite rounding errors. */
export function timeBonus(levelTime: number): number {
  return Math.max(0, Math.floor((BONUS_TIME_LIMIT - levelTime) * BONUS_PER_SECOND + 1e-6));
}

/** Pauses the game if it is being played, e.g. when the tab or window is left. */
export function pauseGame(state: GameState): GameState {
  if (state.mode === 'playing') setMode(state, 'paused');
  return state;
}

function setMode(state: GameState, mode: GameMode): void {
  state.mode = mode;
  state.modeTime = 0;
}

function reachGoal(state: GameState): void {
  const { goalRect } = state.world;
  state.goalBonus = timeBonus(state.levelTime);
  state.score += GOAL_POINTS + state.goalBonus;
  burst(state.effects, state.random, goalRect.x + 24, goalRect.y + 20, state.level.theme.accent, 40, 300);
  setMode(state, 'won');
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
