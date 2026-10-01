import { EPS, ERROR_COLOR, GAMEOVER_INPUT_AFTER, SCORE_COLOR, VIEW_H, VIEW_W } from '../config';
import type { Theme } from '../level/types';
import { texts } from '../texts';
import { shadowText } from './text';

function dim(ctx: CanvasRenderingContext2D, alpha: number): void {
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

/** Half-transparent layer with the "task done" message and the score. */
export function drawGoalOverlay(ctx: CanvasRenderingContext2D, theme: Theme, score: number): void {
  dim(ctx, 0.5);
  shadowText(ctx, texts.goalTitle, VIEW_W / 2, VIEW_H / 2 - 40, 32, theme.accent);
  shadowText(ctx, texts.scoreLine(score), VIEW_W / 2, VIEW_H / 2, 18, SCORE_COLOR);
  shadowText(ctx, texts.goalHint, VIEW_W / 2, VIEW_H / 2 + 50, 18, '#e8e4da');
}

/** Dark red bar with the death message and the lives left. */
export function drawDeathOverlay(ctx: CanvasRenderingContext2D, message: string, lives: number): void {
  ctx.fillStyle = '#300c';
  ctx.fillRect(0, VIEW_H / 2 - 70, VIEW_W, 170);
  shadowText(ctx, message, VIEW_W / 2, VIEW_H / 2 - 25, 34, ERROR_COLOR);
  const left = lives > 0 ? texts.livesLeft(lives) : texts.noLivesLeft;
  shadowText(ctx, left, VIEW_W / 2, VIEW_H / 2 + 5, 16, '#fff');
}

/** Placeholder game over screen. "ENTER: nochmal" appears once ENTER works, and blinks. */
export function drawGameOverOverlay(ctx: CanvasRenderingContext2D, score: number, modeTime: number): void {
  dim(ctx, 0.75);
  shadowText(ctx, texts.gameOverTitle, VIEW_W / 2, VIEW_H / 2 - 60, 40, ERROR_COLOR);
  shadowText(ctx, texts.gameOverText, VIEW_W / 2, VIEW_H / 2 - 20, 18, '#fff');
  shadowText(ctx, texts.scoreLine(score), VIEW_W / 2, VIEW_H / 2 + 15, 18, SCORE_COLOR);
  if (modeTime >= GAMEOVER_INPUT_AFTER - EPS) {
    const color = modeTime % 1 < 0.6 ? '#fff' : '#fff6';
    shadowText(ctx, texts.goalHint, VIEW_W / 2, VIEW_H / 2 + 65, 17, color);
  }
}
