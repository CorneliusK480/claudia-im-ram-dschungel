import { EPS } from '../config';

/**
 * A message at the top in the middle, e.g. "429 Too Many Requests".
 * Slice 7 uses it for hallucinations as well.
 */
export interface Banner {
  text: string;
  color: string;
  /** Seconds left */
  time: number;
}

export function showBanner(text: string, color: string, time: number): Banner {
  return { text, color, time };
}

/** Counts down; returns null once the time is over. */
export function stepBanner(banner: Banner | null, dt: number): Banner | null {
  if (!banner) return null;
  banner.time -= dt;
  return banner.time <= EPS ? null : banner;
}
