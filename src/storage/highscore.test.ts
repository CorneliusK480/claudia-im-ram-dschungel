import { describe, expect, it } from 'vitest';
import { readHighscore, writeHighscore, type HighscoreStorage } from './highscore';

/** A small storage in memory, like the browser one. */
function fakeStorage(start: Record<string, string> = {}): HighscoreStorage {
  const data = new Map(Object.entries(start));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

const saved = (value: string) => fakeStorage({ claudiaRamDschungelHighscore: value });

const broken: HighscoreStorage = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
};

describe('readHighscore', () => {
  it('is 0 when nothing is saved', () => {
    expect(readHighscore(fakeStorage())).toBe(0);
  });

  it('reads a saved number', () => {
    expect(readHighscore(saved('2410'))).toBe(2410);
  });

  it('is 0 for values that are no valid highscore', () => {
    for (const value of ['abc', '', '-5', 'NaN', 'Infinity']) {
      expect(readHighscore(saved(value))).toBe(0);
    }
  });

  it('rounds decimals down', () => {
    expect(readHighscore(saved('12.7'))).toBe(12);
  });

  it('is 0 when the storage fails or is missing', () => {
    expect(readHighscore(broken)).toBe(0);
    expect(readHighscore(null)).toBe(0);
  });
});

describe('writeHighscore', () => {
  it('saves a value that can be read again', () => {
    const storage = fakeStorage();
    writeHighscore(storage, 2410);
    expect(readHighscore(storage)).toBe(2410);
  });

  it('does not throw when the storage fails or is missing', () => {
    expect(() => writeHighscore(broken, 5)).not.toThrow();
    expect(() => writeHighscore(null, 5)).not.toThrow();
  });
});
