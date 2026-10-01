/** A source of random numbers in [0, 1), like Math.random. Tests pass a fixed sequence. */
export type Random = () => number;

/** A random entry of a list that is not empty. */
export function pick<T>(list: readonly T[], random: Random): T {
  return list[Math.floor(random() * list.length)];
}
