import { EPS, ERROR_COLOR, GAMEOVER_INPUT_AFTER, GOAL_INPUT_AFTER, INTRO_TIME, SCORE_COLOR, VIEW_H, VIEW_W } from '../config';
import type { LevelData, Theme } from '../level/types';
import { texts } from '../texts';
import { shadowText } from './text';

/** Darkens the whole picture. */
export function dim(ctx: CanvasRenderingContext2D, alpha: number): void {
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

/** Hints blink: 0.6 s white, 0.4 s half transparent. */
export function blinkColor(t: number): string {
  return t % 1 < 0.6 ? '#fff' : '#fff6';
}

/** Dark bar with the level name and its one-liner. Fades in and out. */
export function drawIntroOverlay(
  ctx: CanvasRenderingContext2D, level: LevelData, theme: Theme, modeTime: number,
): void {
  ctx.globalAlpha = Math.max(0, Math.min(1, modeTime * 3, (INTRO_TIME - modeTime) * 3));
  ctx.fillStyle = '#000b';
  ctx.fillRect(0, VIEW_H / 2 - 70, VIEW_W, 120);
  shadowText(ctx, level.name, VIEW_W / 2, VIEW_H / 2 - 15, 34, theme.accent);
  shadowText(ctx, level.sub, VIEW_W / 2, VIEW_H / 2 + 25, 17, '#fff');
  ctx.globalAlpha = 1;
}

/** Half-transparent layer with "task done", time bonus and score. The hint appears once keys work, and blinks. */
export function drawGoalOverlay(
  ctx: CanvasRenderingContext2D, theme: Theme, bonus: number, score: number, modeTime: number,
): void {
  dim(ctx, 0.5);
  shadowText(ctx, texts.goalTitle, VIEW_W / 2, VIEW_H / 2 - 40, 32, theme.accent);
  shadowText(ctx, texts.goalBonusLine(bonus, score), VIEW_W / 2, VIEW_H / 2, 18, SCORE_COLOR);
  if (modeTime >= GOAL_INPUT_AFTER - EPS) {
    shadowText(ctx, texts.goalFinish, VIEW_W / 2, VIEW_H / 2 + 50, 18, blinkColor(modeTime));
  }
}

/** Darkened picture with "PAUSE". */
export function drawPauseOverlay(ctx: CanvasRenderingContext2D): void {
  dim(ctx, 0.6);
  shadowText(ctx, texts.pauseTitle, VIEW_W / 2, VIEW_H / 2 - 10, 48, '#fff');
  shadowText(ctx, texts.pauseText, VIEW_W / 2, VIEW_H / 2 + 30, 16, '#ccc');
}

/** Dark red bar with the death message and the lives left. */
export function drawDeathOverlay(ctx: CanvasRenderingContext2D, message: string, lives: number): void {
  ctx.fillStyle = '#300c';
  ctx.fillRect(0, VIEW_H / 2 - 70, VIEW_W, 170);
  shadowText(ctx, message, VIEW_W / 2, VIEW_H / 2 - 25, 34, ERROR_COLOR);
  const left = lives > 0 ? texts.livesLeft(lives) : texts.noLivesLeft;
  shadowText(ctx, left, VIEW_W / 2, VIEW_H / 2 + 5, 16, '#fff');
}

/** Game over with score and highscore. The two choices appear once the keys work. */
export function drawGameOverOverlay(
  ctx: CanvasRenderingContext2D, score: number, highscore: number, modeTime: number,
): void {
  dim(ctx, 0.75);
  shadowText(ctx, texts.gameOverTitle, VIEW_W / 2, VIEW_H / 2 - 60, 40, ERROR_COLOR);
  shadowText(ctx, texts.gameOverText, VIEW_W / 2, VIEW_H / 2 - 20, 18, '#fff');
  shadowText(ctx, texts.gameOverScore(score, highscore), VIEW_W / 2, VIEW_H / 2 + 15, 18, SCORE_COLOR);
  if (modeTime >= GAMEOVER_INPUT_AFTER - EPS) {
    shadowText(ctx, texts.gameOverRetry, VIEW_W / 2, VIEW_H / 2 + 65, 17, blinkColor(modeTime));
    shadowText(ctx, texts.gameOverMenu, VIEW_W / 2, VIEW_H / 2 + 92, 15, '#ccc');
  }
}
