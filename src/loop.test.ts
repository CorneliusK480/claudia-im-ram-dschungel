import { describe, expect, it } from 'vitest';
import { STEP } from './config';
import { advance } from './loop';

describe('advance', () => {
  it('runs at most 6 steps for a 5 s frame', () => {
    expect(advance(0, 5).steps).toBeLessThanOrEqual(6);
  });

  it('runs 1 step for 1/60 s', () => {
    expect(advance(0, 1 / 60).steps).toBe(1);
  });

  it('keeps the rest for the next frame', () => {
    const first = advance(0, STEP * 1.5);
    expect(first.steps).toBe(1);
    expect(first.accumulator).toBeCloseTo(STEP * 0.5);
    const second = advance(first.accumulator, STEP * 0.5);
    expect(second.steps).toBe(1);
    expect(second.accumulator).toBeCloseTo(0);
  });
});
