import { CREDIT_TIME, CREDITS_MAX, EPS } from '../config';

/** Credits fill up evenly, one every CREDIT_TIME seconds, never above CREDITS_MAX (like the bucket of a real API). */
export function rechargeCredits(credits: number, dt: number): number {
  return Math.min(CREDITS_MAX, credits + dt / CREDIT_TIME);
}

/** A shot needs one full credit. */
export function hasCredit(credits: number): boolean {
  return credits >= 1 - EPS;
}
