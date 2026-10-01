import { describe, expect, it } from 'vitest';
import { STEP } from '../config';
import { loadLevel1 } from '../test/level1';
import { buildBugs, stepBug } from './bugs';
import { buildWorld } from './world';

const level = loadLevel1();
const world = buildWorld(level);

describe('buildBugs (level 1)', () => {
  it('has 7 bugs walking left, the first at (708, 462)', () => {
    const bugs = buildBugs(level);
    expect(bugs).toHaveLength(7);
    expect(bugs[0]).toMatchObject({ x: 708, y: 462 });
    expect(bugs.every((b) => b.vx === -60 && b.alive)).toBe(true);
  });
});

describe('stepBug', () => {
  it('walks 1 px per step (60 px/s)', () => {
    const bug = buildBugs(level)[0];
    stepBug(bug, world, STEP);
    expect(bug.x).toBeCloseTo(707);
    expect(bug.y).toBe(462);
  });

  it('turns at the left level edge and at the edge of the first pit, never falling', () => {
    const bug = buildBugs(level)[0]; // column 22, ground from column 0 to 28
    let minX = bug.x;
    let maxX = bug.x;
    for (let i = 0; i < 2000; i++) {
      stepBug(bug, world, STEP);
      expect(bug.x).toBeGreaterThanOrEqual(0);
      expect(bug.x).toBeLessThanOrEqual(28 * 32 - 24);
      expect(bug.y).toBe(462);
      minX = Math.min(minX, bug.x);
      maxX = Math.max(maxX, bug.x);
    }
    expect(minX).toBeLessThan(2);
    expect(maxX).toBeGreaterThan(28 * 32 - 24 - 2);
  });

  it('keeps all 7 bugs on the ground for 3000 steps', () => {
    const bugs = buildBugs(level);
    for (let i = 0; i < 3000; i++) for (const b of bugs) stepBug(b, world, STEP);
    for (const b of bugs) {
      expect(b.y).toBe(462);
      expect(b.alive).toBe(true);
    }
  });

  it('turns at a wall', () => {
    // A wall right in front of the bug, standing on the ground.
    const wall = { ...world, solids: [...world.solids, { x: 690, y: 400, w: 10, h: 80 }] };
    const bug = buildBugs(level)[0];
    for (let i = 0; i < 20; i++) stepBug(bug, wall, STEP);
    expect(bug.vx).toBe(60);
    expect(bug.x).toBeGreaterThanOrEqual(700);
  });

  it('disappears without points when it falls below 594 px', () => {
    const bug = { ...buildBugs(level)[0], x: 940, y: 500 }; // above the first pit
    for (let i = 0; i < 60 && bug.alive; i++) stepBug(bug, world, STEP);
    expect(bug.alive).toBe(false);
    expect(bug.y).toBeGreaterThan(594);
  });
});
