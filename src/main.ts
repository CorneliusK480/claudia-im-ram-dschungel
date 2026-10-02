import { createAudio } from './audio/audio';
import { PLACEHOLDER_SKY, STEP } from './config';
import { createKeyboard } from './input/keyboard';
import { loadLevel } from './level/load';
import { createGame, musicFor, pauseGame, stepGame } from './logic/game';
import { startLoop } from './loop';
import { browserStorage } from './storage/browser';
import { readHighscore, writeHighscore } from './storage/highscore';
import { readSoundOff, writeSoundOff } from './storage/sound';
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
  let soundOff = readSoundOff(storage);
  const audio = createAudio(soundOff);
  const keyboard = createKeyboard(window, {
    onGameKey: () => audio.unlock(),
    onMute: () => {
      soundOff = !soundOff;
      audio.setMuted(soundOff);
      writeSoundOff(storage, soundOff);
    },
  });
  // A click (or a tap) on the picture only starts the sound, nothing else.
  canvas.addEventListener('click', () => audio.unlock());
  // Leaving the tab or the window while playing pauses the game.
  window.addEventListener('blur', () => {
    state = pauseGame(state);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) state = pauseGame(state);
  });
  draw = () => render(ctx, state, soundOff);
  startLoop(
    () => {
      state = stepGame(state, keyboard.read(), STEP);
      keyboard.consume();
      for (const event of state.events) audio.play(event);
      if (state.highscore > saved) {
        writeHighscore(storage, state.highscore);
        saved = state.highscore;
      }
    },
    () => {
      // Only a hidden tab stops the music outside the pause; another window in front does not.
      audio.update(musicFor(state), state.mode === 'paused' || document.hidden);
      draw();
    },
  );
}

void start();
