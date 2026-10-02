import type { InputState } from '../logic/input';

const LEFT = new Set(['ArrowLeft', 'KeyA']);
const RIGHT = new Set(['ArrowRight', 'KeyD']);
const JUMP = new Set(['ArrowUp', 'KeyW', 'Space']);
const ENTER = new Set(['Enter', 'NumpadEnter']);
const PAUSE = new Set(['KeyP', 'Escape']);
const MUTE = new Set(['KeyM']);
/** The prompt cannon: one shot per press, holding does not fire again. */
const SHOOT = new Set(['KeyX', 'KeyF']);
const GAME_KEYS = new Set([...LEFT, ...RIGHT, ...JUMP, ...ENTER, ...PAUSE, ...MUTE, ...SHOOT]);

export interface KeyboardCallbacks {
  /** Every game key, also held ones: browsers allow sound only after an input. */
  onGameKey(): void;
  /** M, once per press: sound off or on. Not part of the InputState, so it never starts or ends anything. */
  onMute(): void;
}

export interface Keyboard {
  /** Current input. "Pressed" events stay until `consume()` is called. */
  read(): InputState;
  /** Call after each logic step: pressed events count for exactly one step. */
  consume(): void;
}

/**
 * Turns key events into an InputState. Uses `event.code` (key position),
 * so it works the same on German and English keyboards.
 */
export function createKeyboard(target: Window, callbacks: KeyboardCallbacks): Keyboard {
  const held = new Set<string>();
  let jumpPressed = false;
  let enterPressed = false;
  let pausePressed = false;
  let shootPressed = false;

  target.addEventListener('keydown', (e) => {
    if (!GAME_KEYS.has(e.code)) return;
    // Space and arrows would otherwise scroll the page.
    e.preventDefault();
    callbacks.onGameKey();
    held.add(e.code);
    // Auto repeat of a held key is not a new press.
    if (e.repeat) return;
    if (MUTE.has(e.code)) callbacks.onMute();
    if (JUMP.has(e.code)) jumpPressed = true;
    if (ENTER.has(e.code)) enterPressed = true;
    if (PAUSE.has(e.code)) pausePressed = true;
    if (SHOOT.has(e.code)) shootPressed = true;
  });

  target.addEventListener('keyup', (e) => {
    if (!GAME_KEYS.has(e.code)) return;
    e.preventDefault();
    held.delete(e.code);
  });

  // Window loses focus → keyup events would get lost, so release everything.
  target.addEventListener('blur', () => {
    held.clear();
    jumpPressed = false;
    enterPressed = false;
    pausePressed = false;
    shootPressed = false;
  });

  const anyHeld = (keys: Set<string>) => [...keys].some((k) => held.has(k));

  return {
    read: () => ({
      left: anyHeld(LEFT),
      right: anyHeld(RIGHT),
      jumpHeld: anyHeld(JUMP),
      jumpPressed,
      enterPressed,
      pausePressed,
      shootPressed,
    }),
    consume: () => {
      jumpPressed = false;
      enterPressed = false;
      pausePressed = false;
      shootPressed = false;
    },
  };
}
