import { PLACEHOLDER_SKY, STEP } from './config';
import { createKeyboard } from './input/keyboard';
import { loadLevel } from './level/load';
import { createGame, pauseGame, stepGame } from './logic/game';
import { startLoop } from './loop';
import { browserStorage, readHighscore, writeHighscore } from './storage/highscore';
import { drawSky } from './render/background';
import { drawError } from './render/error';
import { render } from './render/renderer';
import { setupScreen } from './render/screen';
import { texts } from './texts';

async function start(): Promise<void> {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const screen = setupScreen(canvas);
  const { ctx } = screen;

  // No empty picture while loading: draw the sky right away.
  let draw = () => drawSky(ctx, PLACEHOLDER_SKY);
  screen.onResize(() => draw());
  draw();

  const result = await loadLevel(`${import.meta.env.BASE_URL}levels/level1.json`);
  if (!result.ok) {
    draw = () => drawError(ctx, texts.levelLoadError(1), result.errors);
    draw();
    return;
  }

  const storage = browserStorage();
  let saved = readHighscore(storage);
  let state = createGame(result.level, Math.random, saved);
  const keyboard = createKeyboard(window);
  // Leaving the tab or the window while playing pauses the game.
  window.addEventListener('blur', () => {
    state = pauseGame(state);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) state = pauseGame(state);
  });
  draw = () => render(ctx, state);
  startLoop(
    () => {
      state = stepGame(state, keyboard.read(), STEP);
      keyboard.consume();
      if (state.highscore > saved) {
        writeHighscore(storage, state.highscore);
        saved = state.highscore;
      }
    },
    () => draw(),
  );
}

void start();
