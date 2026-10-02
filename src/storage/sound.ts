import { SOUND_OFF_KEY } from '../config';
import type { GameStorage } from './browser';

/** True if the sound was switched off. Anything but '1', and any storage error, means "sound on". */
export function readSoundOff(storage: GameStorage | null): boolean {
  try {
    return storage?.getItem(SOUND_OFF_KEY) === '1';
  } catch {
    return false;
  }
}

/** Saves "sound off". If the storage fails, M still works, only without being saved. */
export function writeSoundOff(storage: GameStorage | null, off: boolean): void {
  try {
    storage?.setItem(SOUND_OFF_KEY, off ? '1' : '0');
  } catch {
    // nothing to do: the game must not stop because of the storage
  }
}
