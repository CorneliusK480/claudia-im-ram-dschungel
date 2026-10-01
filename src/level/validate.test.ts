import { describe, expect, it } from 'vitest';
import { level1Text } from '../test/level1';
import { parseLevel } from './load';
import { validateLevel } from './validate';

const raw = () => JSON.parse(level1Text) as Record<string, unknown>;
const errorsOf = (value: unknown) => {
  const result = validateLevel(value);
  return result.ok ? [] : result.errors;
};

describe('validateLevel', () => {
  it('accepts the real level 1 file with all its data', () => {
    const result = parseLevel(level1Text);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.level.plats).toHaveLength(10);
    expect(result.level.tokens).toHaveLength(12);
    expect(result.level.fakes).toEqual([[78, 11, 3]]);
    expect(result.level.saves).toEqual([64]);
    expect(result.level.movers).toEqual([]);
  });

  it('reports exactly one error for a deleted comma', () => {
    const broken = level1Text.replace('[9, 11, 4],', '[9, 11, 4]');
    expect(broken).not.toBe(level1Text);
    const result = parseLevel(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toHaveLength(1);
  });

  it('names the platform with only 2 numbers', () => {
    const level = raw();
    (level.plats as number[][])[3] = [43, 8];
    expect(errorsOf(level)).toEqual(['plats[3]: erwartet 3 ganze Zahlen']);
  });

  it('reports a missing width', () => {
    const level = raw();
    delete level.width;
    expect(errorsOf(level)).toEqual(['width: fehlt']);
  });

  it('reports ground beyond the level width', () => {
    const level = raw();
    (level.ground as number[][])[3] = [88, 131];
    expect(errorsOf(level)).toEqual(['ground[3]: erwartet von < bis, beide zwischen 0 und 130']);
  });

  it('reports all errors at once', () => {
    const level = raw();
    level.name = 5;
    (level.plats as unknown[])[0] = [9, 11];
    (level.bugs as unknown[])[1] = [40, 'x'];
    (level.theme as Record<string, unknown>).sky = ['#000'];
    level.start = [2, 20];
    const errors = errorsOf(level);
    expect(errors).toHaveLength(5);
    expect(errors).toContain('name: erwartet einen Text');
    expect(errors).toContain('plats[0]: erwartet 3 ganze Zahlen');
    expect(errors).toContain('bugs[1]: erwartet 2 ganze Zahlen');
    expect(errors).toContain('theme.sky: erwartet 2 Texte');
    expect(errors).toContain('start: liegt außerhalb des Levels');
  });

  it('accepts the special formats of saves, boss and movers', () => {
    const level = raw();
    level.boss = [21, 14];
    level.movers = [[20, 13, 3, 3, 1.6]];
    expect(errorsOf(level)).toEqual([]);
    level.boss = [[21, 14]];
    level.saves = [[64]];
    expect(errorsOf(level)).toEqual(['saves[0]: erwartet eine ganze Zahl', 'boss: erwartet 2 ganze Zahlen']);
  });

  it('reports unknown fields (e.g. typos)', () => {
    const level = raw();
    level.platz = [];
    expect(errorsOf(level)).toEqual(['platz: unbekanntes Feld']);
  });

  it('rejects something that is not an object', () => {
    expect(errorsOf([1, 2])).toHaveLength(1);
  });
});
