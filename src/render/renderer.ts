import { DEATH_SHAKE, SHAKE_PX } from '../config';
import type { GameState } from '../logic/game';
import { drawBackground } from './background';
import { drawBugs } from './bugs';
import { drawCheckpoints } from './checkpoint';
import { drawClaudia } from './claudia';
import { drawEffects } from './effects';
import { drawHud } from './hud';
import { drawDeathOverlay, drawGameOverOverlay, drawGoalOverlay } from './overlay';
import { drawTerminal } from './terminal';
import { drawTerrain } from './terrain';
import { drawTokens } from './tokens';

/** Draws the whole game state. Only reads the state. */
export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  const theme = state.level.theme;
  // rounded, so the ground does not flicker
  const camX = Math.round(state.camX);

  // Only the world shakes, not the display at the top and the overlays.
  ctx.save();
  const { shake } = state.effects;
  if (shake > 0) {
    const amount = (2 * SHAKE_PX * shake) / DEATH_SHAKE;
    ctx.translate((Math.random() - 0.5) * amount, (Math.random() - 0.5) * amount);
  }
  drawBackground(ctx, theme, camX);
  drawTerrain(ctx, state.world, theme, camX);
  drawCheckpoints(ctx, state, camX);
  drawTokens(ctx, state, camX);
  drawTerminal(ctx, state.world, theme, camX);
  drawBugs(ctx, state, camX);
  if (state.mode === 'playing' || state.mode === 'won') {
    drawClaudia(ctx, state.player, camX, state.time);
  }
  drawEffects(ctx, state.effects, camX);
  ctx.restore();

  drawHud(ctx, state);
  if (state.mode === 'dying') drawDeathOverlay(ctx, state.deathMessage, state.lives);
  else if (state.mode === 'gameOver') drawGameOverOverlay(ctx, state.score, state.modeTime);
  else if (state.mode === 'won') drawGoalOverlay(ctx, theme, state.score);
}
