import { SCORE_COLOR, TITLE_COLOR, TITLE_RUN_SPEED, VIEW_W } from '../config';
import type { GameState } from '../logic/game';
import { texts } from '../texts';
import { drawRobot } from './claudia';
import { blinkColor, dim } from './overlay';
import { shadowText } from './text';

const SCALE = 3;

/** The title screen on top of the darkened level: name, big hopping Claudia, keys and highscore. */
export function drawTitle(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { time } = state;
  const cx = VIEW_W / 2;
  dim(ctx, 0.55);
  shadowText(ctx, texts.titleName, cx, 130, 64, TITLE_COLOR);
  shadowText(ctx, texts.titleSub, cx, 180, 32, state.level.theme.accent);
  // Hops in springy arcs between y 215 and 195, legs walking. Whole pixels, so the edges stay sharp.
  const y = Math.round(215 - Math.abs(Math.sin(time * 3)) * 20);
  drawRobot(ctx, cx - 33, y, 1, { run: time * TITLE_RUN_SPEED }, SCALE);
  shadowText(ctx, texts.titlePress, cx, 360, 22, blinkColor(state.modeTime));
  shadowText(ctx, texts.titleKeys1, cx, 410, 15, '#ccc');
  shadowText(ctx, texts.titleKeys2, cx, 435, 15, '#ccc');
  shadowText(ctx, texts.titleHelp, cx, 480, 15, SCORE_COLOR);
  if (state.highscore > 0) shadowText(ctx, texts.titleHighscore(state.highscore), cx, 515, 14, '#fff9');
}
