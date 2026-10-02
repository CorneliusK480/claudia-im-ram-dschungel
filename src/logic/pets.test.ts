import { describe, expect, it } from 'vitest';
import { STEP } from '../config';
import { loadLevel1 } from '../test/level1';
import { buildBugs } from './bugs';
import { createPet, stepPets, type Pet } from './pets';

const bug = buildBugs(loadLevel1())[0]; // (708, 462), walking left

function run(pets: Pet[], n: number, camX = 300): Pet[] {
  for (let i = 0; i < n; i++) pets = stepPets(pets, camX, STEP);
  return pets;
}

describe('pets', () => {
  it('appear in the place of the bug, looking where it walked', () => {
    expect(createPet('duck', bug)).toMatchObject({ x: 708, y: 462, facing: -1, vx: -60, vy: -420 });
    expect(createPet('duck', { ...bug, vx: 60 })).toMatchObject({ facing: 1, vx: 60 });
  });

  it('the butterfly rises 90 px/s straight up and is gone once above -40', () => {
    let pets = run([createPet('butterfly', bug)], 60);
    expect(pets[0].y).toBeCloseTo(462 - 90);
    expect(pets[0].x).toBe(708);
    expect(pets[0].angle).toBe(0);
    // 502 px to y -40 at 90 px/s ≈ 5.6 s
    pets = run(pets, 270);
    expect(pets).toHaveLength(1);
    expect(run(pets, 20)).toHaveLength(0);
  });

  it('the duck hops up first, then falls and is gone below 584', () => {
    let pets = run([createPet('duck', bug)], 10);
    expect(pets[0].y).toBeLessThan(462);
    const peak = 462 - 420 ** 2 / (2 * 1200);
    pets = run(pets, 11); // 0.35 s: top of the hop
    // fixed steps land a few px below the ideal curve
    expect(Math.abs(pets[0].y - peak)).toBeLessThan(5);
    expect(Math.abs(pets[0].vy)).toBeLessThan(20);
    pets = run(pets, 20);
    expect(pets[0].vy).toBeGreaterThan(0);
    let steps = 0;
    while (pets.length > 0 && steps < 200) {
      expect(pets[0].y).toBeLessThanOrEqual(584);
      pets = run(pets, 1);
      steps++;
    }
    expect(pets).toHaveLength(0);
  });

  it('hopping pets spin in the direction the bug walked', () => {
    expect(run([createPet('gift', bug)], 30)[0].angle).toBeCloseTo(-4);
    expect(run([createPet('cookie', { ...bug, vx: 60 })], 30)[0].angle).toBeCloseTo(4);
  });

  it('vanish once more than 40 px out of the picture at the side', () => {
    const pet = { ...createPet('butterfly', bug), x: 300 - 41 };
    expect(stepPets([pet], 300, STEP)).toHaveLength(0);
    expect(stepPets([{ ...pet, x: 300 - 39 }], 300, STEP)).toHaveLength(1);
    expect(stepPets([{ ...pet, x: 300 + 960 + 41 }], 300, STEP)).toHaveLength(0);
  });
});
