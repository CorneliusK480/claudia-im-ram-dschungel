import type { Random } from '../logic/random';

/** Returns the given numbers in turn, starting over at the end. */
export function fixedRandom(values: number[]): Random {
  let i = 0;
  return () => values[i++ % values.length];
}
