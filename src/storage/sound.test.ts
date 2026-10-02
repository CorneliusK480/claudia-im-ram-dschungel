import { describe, expect, it } from 'vitest';
import type { GameStorage } from './browser';
import { readSoundOff, writeSoundOff } from './sound';

/** A small storage in memory, like the browser one. */
function fakeStorage(start: Record<string, string> = {}): GameStorage {
  const data = new Map(Object.entries(start));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

const saved = (value: string) => fakeStorage({ claudiaRamDschungelTonAus: value });

const broken: GameStorage = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
};

describe('readSoundOff', () => {
  it('is false (sound on) when nothing is saved', () => {
    expect(readSoundOff(fakeStorage())).toBe(false);
  });

  it("is true only for '1'", () => {
    expect(readSoundOff(saved('1'))).toBe(true);
    expect(readSoundOff(saved('0'))).toBe(false);
  });

  it('is false for strange values', () => {
    for (const value of ['true', 'ja', '', '2']) {
      expect(readSoundOff(saved(value))).toBe(false);
    }
  });

  it('is false when the storage fails or is missing', () => {
    expect(readSoundOff(broken)).toBe(false);
    expect(readSoundOff(null)).toBe(false);
  });
});

describe('writeSoundOff', () => {
  it('saves off and on so it can be read again', () => {
    const storage = fakeStorage();
    writeSoundOff(storage, true);
    expect(readSoundOff(storage)).toBe(true);
    writeSoundOff(storage, false);
    expect(readSoundOff(storage)).toBe(false);
  });

  it('does not throw when the storage fails or is missing', () => {
    expect(() => writeSoundOff(broken, true)).not.toThrow();
    expect(() => writeSoundOff(null, true)).not.toThrow();
  });
});
