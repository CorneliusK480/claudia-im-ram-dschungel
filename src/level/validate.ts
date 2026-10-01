import { ROWS } from '../config';
import { texts } from '../texts';
import type { LevelData, Theme } from './types';

export type ValidationResult =
  | { ok: true; level: LevelData }
  | { ok: false; errors: string[] };

type Obj = Record<string, unknown>;

const isObject = (v: unknown): v is Obj =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isText = (v: unknown): v is string => typeof v === 'string';

// List fields: number of integers per entry and whether entry[0] is x and entry[1] is y.
const TUPLE_LISTS: Record<string, { n: number; hasY: boolean }> = {
  plats: { n: 3, hasY: true },
  fakes: { n: 3, hasY: true },
  crumbles: { n: 3, hasY: true },
  tokens: { n: 3, hasY: true },
  fakeTokens: { n: 3, hasY: true },
  bugs: { n: 2, hasY: true },
  viruses: { n: 2, hasY: true },
  injectors: { n: 2, hasY: true },
  power: { n: 2, hasY: true },
  dj: { n: 2, hasY: true },
  leaks: { n: 2, hasY: true },
  spikes: { n: 2, hasY: false },
  blocks: { n: 4, hasY: true },
};

const KNOWN_FIELDS = new Set([
  'name', 'sub', 'theme', 'music', 'width', 'start', 'goal', 'ground',
  'movers', 'saves', 'boss', ...Object.keys(TUPLE_LISTS),
]);
const KNOWN_THEME_FIELDS = new Set(['sky', 'far', 'ground', 'top', 'accent', 'vines', 'lava']);

/** Checks a parsed level file and collects all errors with their path. */
export function validateLevel(raw: unknown): ValidationResult {
  const errors: string[] = [];
  if (!isObject(raw)) return { ok: false, errors: [texts.notAnObject('Level')] };

  for (const key of Object.keys(raw)) {
    if (!KNOWN_FIELDS.has(key)) errors.push(texts.unknownField(key));
  }

  const required = (key: string): boolean => {
    if (raw[key] === undefined) {
      errors.push(texts.missing(key));
      return false;
    }
    return true;
  };

  // Simple text fields
  for (const key of ['name', 'sub', 'music']) {
    if (required(key) && !isText(raw[key])) errors.push(texts.expectedText(key));
  }

  // Theme
  if (required('theme')) validateTheme(raw.theme, errors);

  // Width (needed for the bounds checks below)
  let width: number | null = null;
  if (required('width')) {
    if (isInt(raw.width) && raw.width > 0) width = raw.width;
    else errors.push(texts.expectedPositiveInt('width'));
  }

  const checkX = (path: string, x: number) => {
    if (width !== null && (x < 0 || x >= width)) errors.push(texts.outsideLevel(path));
  };
  const checkXY = (path: string, x: number, y: number) => {
    if ((width !== null && (x < 0 || x >= width)) || y < 0 || y >= ROWS) {
      errors.push(texts.outsideLevel(path));
    }
  };

  const isIntTuple = (v: unknown, n: number): v is number[] =>
    Array.isArray(v) && v.length === n && v.every(isInt);

  // start, goal: one pair inside the level
  for (const key of ['start', 'goal']) {
    if (!required(key)) continue;
    const v = raw[key];
    if (!isIntTuple(v, 2)) errors.push(texts.expectedInts(key, 2));
    else checkXY(key, v[0], v[1]);
  }

  // ground: list of [from, to)
  if (required('ground')) {
    const list = raw.ground;
    if (!Array.isArray(list)) errors.push(texts.expectedList('ground'));
    else {
      list.forEach((entry, i) => {
        const path = `ground[${i}]`;
        if (!isIntTuple(entry, 2)) errors.push(texts.expectedInts(path, 2));
        else if (width !== null && !(entry[0] >= 0 && entry[0] < entry[1] && entry[1] <= width)) {
          errors.push(texts.badRange(path, width));
        }
      });
    }
  }

  // Optional lists of integer tuples
  for (const [key, { n, hasY }] of Object.entries(TUPLE_LISTS)) {
    const list = raw[key];
    if (list === undefined) continue;
    if (!Array.isArray(list)) {
      errors.push(texts.expectedList(key));
      continue;
    }
    list.forEach((entry, i) => {
      const path = `${key}[${i}]`;
      if (!isIntTuple(entry, n)) errors.push(texts.expectedInts(path, n));
      else if (hasY) checkXY(path, entry[0], entry[1]);
      else checkX(path, entry[0]);
    });
  }

  // movers: 4 integers and a speed (may be a decimal number)
  if (raw.movers !== undefined) {
    if (!Array.isArray(raw.movers)) errors.push(texts.expectedList('movers'));
    else {
      raw.movers.forEach((entry, i) => {
        const path = `movers[${i}]`;
        const ok =
          Array.isArray(entry) &&
          entry.length === 5 &&
          entry.slice(0, 4).every(isInt) &&
          isNumber(entry[4]);
        if (!ok) errors.push(texts.expectedMover(path));
        else checkXY(path, entry[0], entry[1]);
      });
    }
  }

  // saves: plain list of x columns
  if (raw.saves !== undefined) {
    if (!Array.isArray(raw.saves)) errors.push(texts.expectedList('saves'));
    else {
      raw.saves.forEach((x, i) => {
        const path = `saves[${i}]`;
        if (!isInt(x)) errors.push(texts.expectedInt(path));
        else checkX(path, x);
      });
    }
  }

  // boss: a single pair
  if (raw.boss !== undefined) {
    if (!isIntTuple(raw.boss, 2)) errors.push(texts.expectedInts('boss', 2));
    else checkXY('boss', raw.boss[0], raw.boss[1]);
  }

  if (errors.length > 0) return { ok: false, errors };

  const list = <T>(key: string): T[] => (raw[key] as T[] | undefined) ?? [];
  const level: LevelData = {
    name: raw.name as string,
    sub: raw.sub as string,
    theme: raw.theme as Theme,
    music: raw.music as string,
    width: raw.width as number,
    start: raw.start as LevelData['start'],
    goal: raw.goal as LevelData['goal'],
    ground: raw.ground as LevelData['ground'],
    blocks: list('blocks'),
    plats: list('plats'),
    movers: list('movers'),
    crumbles: list('crumbles'),
    fakes: list('fakes'),
    fakeTokens: list('fakeTokens'),
    tokens: list('tokens'),
    bugs: list('bugs'),
    viruses: list('viruses'),
    injectors: list('injectors'),
    spikes: list('spikes'),
    leaks: list('leaks'),
    power: list('power'),
    dj: list('dj'),
    saves: list('saves'),
    boss: raw.boss as LevelData['boss'],
  };
  return { ok: true, level };
}

function validateTheme(theme: unknown, errors: string[]): void {
  if (!isObject(theme)) {
    errors.push(texts.notAnObject('theme'));
    return;
  }
  for (const key of Object.keys(theme)) {
    if (!KNOWN_THEME_FIELDS.has(key)) errors.push(texts.unknownField(`theme.${key}`));
  }
  const sky = theme.sky;
  if (sky === undefined) errors.push(texts.missing('theme.sky'));
  else if (!(Array.isArray(sky) && sky.length === 2 && sky.every(isText))) {
    errors.push(texts.expectedTexts('theme.sky', 2));
  }
  for (const key of ['far', 'ground', 'top', 'accent']) {
    const path = `theme.${key}`;
    if (theme[key] === undefined) errors.push(texts.missing(path));
    else if (!isText(theme[key])) errors.push(texts.expectedText(path));
  }
  const vines = theme.vines;
  if (vines === undefined) errors.push(texts.missing('theme.vines'));
  else if (!Array.isArray(vines)) errors.push(texts.expectedList('theme.vines'));
  else {
    vines.forEach((v, i) => {
      if (!isText(v)) errors.push(texts.expectedText(`theme.vines[${i}]`));
    });
  }
  if (theme.lava !== undefined && typeof theme.lava !== 'boolean') {
    errors.push(texts.expectedBool('theme.lava'));
  }
}
