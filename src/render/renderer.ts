import { DEATH_SHAKE, SHAKE_PX } from '../config';
import type { GameState } from '../logic/game';
import { drawBanner } from './banner';
import { drawBackground } from './background';
import { drawBugs } from './bugs';
import { drawCheckpoints } from './checkpoint';
import { drawClaudia } from './claudia';
import { drawEffects } from './effects';
import { drawHud } from './hud';
import { drawDeathOverlay, drawGameOverOverlay, drawGoalOverlay, drawIntroOverlay, drawPauseOverlay } from './overlay';
import { drawPets } from './pets';
import { drawPrompts } from './prompts';
import { drawTerminal } from './terminal';
import { drawTerrain } from './terrain';
import { drawTitle } from './title';
import { drawTokens } from './tokens';

/** Draws the whole game state. Only reads the state. */
export function render(ctx: CanvasRenderingContext2D, state: GameState, soundOff: boolean): void {
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
  drawTerminal(ctx, state.world, theme, camX, state.mode === 'won');
  drawBugs(ctx, state, camX);
  drawPets(ctx, state, camX);
  drawPrompts(ctx, state, camX);
  const { mode } = state;
  if (mode === 'intro' || mode === 'playing' || mode === 'paused' || mode === 'won') {
    drawClaudia(ctx, state.player, camX, state.time);
  }
  drawEffects(ctx, state.effects, camX);
  ctx.restore();

  // The title has no display at the top.
  if (mode === 'title') {
    drawTitle(ctx, state, soundOff);
    return;
  }
  drawHud(ctx, state, soundOff);
  if (state.banner) drawBanner(ctx, state.banner);
  if (mode === 'intro') drawIntroOverlay(ctx, state.level, theme, state.modeTime);
  else if (mode === 'paused') drawPauseOverlay(ctx);
  else if (mode === 'dying') drawDeathOverlay(ctx, state.deathMessage, state.lives);
  else if (mode === 'gameOver') drawGameOverOverlay(ctx, state.score, state.highscore, state.modeTime);
  else if (mode === 'won') drawGoalOverlay(ctx, theme, state.goalBonus, state.score, state.modeTime);
}
