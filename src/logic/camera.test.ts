import { describe, expect, it } from 'vitest';
import { loadLevel1 } from '../test/level1';
import { cameraX, titleCameraX } from './camera';
import { createPlayer } from './player';
import { buildWorld } from './world';

const world = buildWorld(loadLevel1());

describe('cameraX', () => {
  it('keeps Claudia in the middle of the view inside the level', () => {
    const player = { ...createPlayer(world), x: 2000 };
    const screenX = player.x + 11 - cameraX(player, world);
    expect(Math.abs(screenX - 480)).toBeLessThanOrEqual(1);
  });

  it('is 0 at the start', () => {
    expect(cameraX(createPlayer(world), world)).toBe(0);
  });

  it('is 3200 at the end', () => {
    expect(cameraX({ ...createPlayer(world), x: 4138 }, world)).toBe(3200);
  });
});

describe('titleCameraX', () => {
  it('moves 60 px/s and starts over at 3200', () => {
    expect(titleCameraX(0, world)).toBe(0);
    expect(titleCameraX(10, world)).toBe(600);
    expect(titleCameraX(53.4, world)).toBeCloseTo(4);
  });
});
