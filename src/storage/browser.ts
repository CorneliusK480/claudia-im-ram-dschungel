/** The part of the browser storage that is used here. */
export type GameStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** The browser storage, or null if the browser blocks it. */
export function browserStorage(): GameStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
