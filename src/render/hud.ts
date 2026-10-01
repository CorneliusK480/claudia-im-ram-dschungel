import { SCORE_COLOR, VIEW_W } from '../config';
import type { GameState } from '../logic/game';
import { texts } from '../texts';
import { drawRobot } from './claudia';
import { shadowText } from './text';

const BASELINE = 34;

/** The display at the top: lives, tokens, score and the level name. */
export function drawHud(ctx: CanvasRenderingContext2D, state: GameState): void {
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
}
