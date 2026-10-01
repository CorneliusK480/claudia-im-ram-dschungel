import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { LevelData } from '../level/types';
import { validateLevel } from '../level/validate';

/** Text of the real level file in public/levels. */
export const level1Text = readFileSync(
  fileURLToPath(new URL('../../public/levels/level1.json', import.meta.url)),
  'utf8',
);

export function loadLevel1(): LevelData {
  const result = validateLevel(JSON.parse(level1Text));
  if (!result.ok) throw new Error(result.errors.join('\n'));
  return result.level;
}
