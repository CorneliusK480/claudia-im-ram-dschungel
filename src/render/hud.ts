import { CREDITS_MAX, EPS, ERROR_COLOR, PROMPT_COLOR, SCORE_COLOR, VIEW_W } from '../config';
import type { GameState } from '../logic/game';
import { texts } from '../texts';
import { drawRobot } from './claudia';
import { shadowText } from './text';

const BASELINE = 34;

/** The display at the top: lives, tokens, score and the level name. */
export function drawHud(ctx: CanvasRenderingContext2D, state: GameState, soundOff: boolean): void {
  ctx.fillStyle = '#0008';
  ctx.beginPath();
  ctx.roundRect(10, 10, 440, 34, 8);
  ctx.fill();

  drawRobot(ctx, 20, 14, 1, 'stand', 0.85);
  shadowText(ctx, texts.hudLives(state.lives), 44, BASELINE, 16, '#fff', 'left');
  shadowText(ctx, texts.hudTokens(state.tokenCount), 90, BASELINE, 16, state.level.theme.accent, 'left');
  shadowText(ctx, texts.hudScore(state.score), 230, BASELINE, 16, SCORE_COLOR, 'left');

  // "Level 1: RAM-Dschungel" → "RAM-Dschungel"
  const name = state.level.name.split(': ')[1] ?? state.level.name;
  shadowText(ctx, name, VIEW_W - 20, BASELINE, 15, '#fffa', 'right');
  if (soundOff) drawSoundOffHint(ctx);
  drawApiBar(ctx, state);
}

/** Below the display: "API" and one box per credit, or "429 RATE LIMIT" blinking during the lock. */
function drawApiBar(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = '#0008';
  ctx.beginPath();
  ctx.roundRect(10, 48, 150, 20, 6);
  ctx.fill();

  if (state.rateLock > EPS) {
    const color = Math.floor(state.time * 6) % 2 ? ERROR_COLOR : '#fff';
    shadowText(ctx, texts.rateLimitBar, 85, 63, 12, color);
    return;
  }
  shadowText(ctx, texts.apiLabel, 16, 63, 11, PROMPT_COLOR, 'left');
  for (let k = 0; k < CREDITS_MAX; k++) {
    const x = 46 + k * 22;
    // 1 = full, between 0 and 1 = the box that is filling up
    const fill = Math.max(0, Math.min(1, state.credits - k));
    ctx.fillStyle = '#333';
    ctx.fillRect(x, 53, 18, 10);
    if (fill > 0) {
      ctx.fillStyle = fill >= 1 - EPS ? PROMPT_COLOR : '#a08a50';
      ctx.fillRect(x, 53, 18 * fill, 10);
    }
  }
}

/** "Ton aus (M)" at the top right, below the level name. */
export function drawSoundOffHint(ctx: CanvasRenderingContext2D): void {
  shadowText(ctx, texts.soundOff, VIEW_W - 20, 58, 12, '#fff8', 'right');
}
