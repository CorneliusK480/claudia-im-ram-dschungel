import { HIGHSCORE_KEY } from '../config';
import type { GameStorage } from './browser';

/** The saved highscore. 0 if nothing is saved, the value is no valid number or the storage fails. */
export function readHighscore(storage: GameStorage | null): number {
  try {
    const text = storage?.getItem(HIGHSCORE_KEY);
    if (!text) return 0;
    const value = Number(text);
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  } catch {
    return 0;
  }
}

/** Saves the highscore. If the storage fails, the game simply goes on without it. */
export function writeHighscore(storage: GameStorage | null, value: number): void {
  try {
    storage?.setItem(HIGHSCORE_KEY, String(value));
  } catch {
    // nothing to do: the game must not stop because of the storage
  }
}
