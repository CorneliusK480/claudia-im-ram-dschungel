import type { GameState } from '../logic/game';
import { drawBackground } from './background';
import { drawClaudia } from './claudia';
import { drawGoalOverlay } from './overlay';
import { drawTerminal } from './terminal';
import { drawTerrain } from './terrain';

/** Draws the whole game state. Only reads the state. */
export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  const theme = state.level.theme;
  // rounded, so the ground does not flicker
  const camX = Math.round(state.camX);
  drawBackground(ctx, theme, camX);
  drawTerrain(ctx, state.world, theme, camX);
  drawTerminal(ctx, state.world, theme, camX);
  if (state.mode !== 'respawning') drawClaudia(ctx, state.player, camX);
  if (state.mode === 'won') drawGoalOverlay(ctx, theme);
}
