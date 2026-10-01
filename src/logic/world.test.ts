import { describe, expect, it } from 'vitest';
import { loadLevel1 } from '../test/level1';
import { cameraX } from './camera';
import { createPlayer } from './player';
import { overlaps } from './rect';
import { buildWorld } from './world';

const world = buildWorld(loadLevel1());

describe('buildWorld (level 1)', () => {
  it('has 4 ground sections and 10 platforms as solids', () => {
    expect(world.solids).toHaveLength(14);
  });

  it('has no solid at column 78, row 11 (the fake platform)', () => {
    const cell = { x: 78 * 32, y: 11 * 32, w: 32, h: 32 };
    expect(world.solids.some((s) => overlaps(s, cell))).toBe(false);
  });

  it('puts Claudia at (69, 452), standing exactly on the ground', () => {
    expect(world.startPos).toEqual({ x: 69, y: 452 });
    const feet = world.startPos.y + 28;
    expect(world.solids.some((s) => s.y === feet && s.x <= 69 && s.x + s.w >= 69 + 22)).toBe(true);
  });

  it('places the goal at (4000, 416), 48 × 64', () => {
    expect(world.goalRect).toEqual({ x: 4000, y: 416, w: 48, h: 64 });
  });

  it('has the camera at 0 at the start and at 3200 at the end', () => {
    const player = createPlayer(world);
    expect(cameraX(player, world)).toBe(0);
    player.x = 130 * 32 - 22;
    expect(cameraX(player, world)).toBe(3200);
  });
});
