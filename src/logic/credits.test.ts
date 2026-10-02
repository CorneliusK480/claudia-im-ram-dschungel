import { describe, expect, it } from 'vitest';
import { STEP } from '../config';
import { hasCredit, rechargeCredits } from './credits';

describe('credits', () => {
  it('recharge 1 credit in 90 steps (1.5 s)', () => {
    let credits = 2;
    for (let i = 0; i < 90; i++) credits = rechargeCredits(credits, STEP);
    expect(credits).toBeCloseTo(3);
    expect(hasCredit(credits)).toBe(true);
  });

  it('never go above 5', () => {
    let credits = 4.5;
    for (let i = 0; i < 300; i++) credits = rechargeCredits(credits, STEP);
    expect(credits).toBe(5);
  });

  it('a shot needs a full credit', () => {
    expect(hasCredit(0.99)).toBe(false);
    expect(hasCredit(1)).toBe(true);
  });
});
