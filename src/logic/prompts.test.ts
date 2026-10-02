import { describe, expect, it } from 'vitest';
import { STEP } from '../config';
import { loadLevel1 } from '../test/level1';
import { buildBugs, type Bug } from './bugs';
import { createPlayer } from './player';
import { createPrompt, stepPrompts, type Prompt } from './prompts';
import { buildWorld } from './world';

const level = loadLevel1();
const world = buildWorld(level);

/** A prompt flying right at (x, y). */
const prompt = (x: number, y: number, dir: 1 | -1 = 1): Prompt =>
  ({ x, y, dir, text: 'Sei ein Cookie!', pet: 'cookie', life: 0.75 });

const bugAt = (x: number, y: number): Bug => ({ ...buildBugs(level)[0], x, y });

describe('createPrompt', () => {
  it('starts in front of Claudia at chest height, flying where she looks', () => {
    const player = createPlayer(world); // x 69, y 452
    expect(createPrompt(player, { text: 'a', pet: null })).toMatchObject({ x: 91, y: 458, dir: 1, life: 0.75 });
    player.facing = -1;
    expect(createPrompt(player, { text: 'a', pet: null })).toMatchObject({ x: 53, y: 458, dir: -1 });
  });
});

describe('stepPrompts', () => {
  it('flies 560 px/s in its direction and vanishes after 45 steps (0.75 s), not before', () => {
    let prompts = [prompt(100, 100), prompt(1000, 100, -1)];
    prompts = stepPrompts(prompts, [], world, STEP).prompts;
    expect(prompts[0].x).toBeCloseTo(100 + 560 / 60);
    expect(prompts[1].x).toBeCloseTo(1000 - 560 / 60);
    for (let i = 1; i < 44; i++) prompts = stepPrompts(prompts, [], world, STEP).prompts;
    expect(prompts).toHaveLength(2);
    expect(prompts[0].x).toBeCloseTo(100 + 44 * 560 / 60);
    expect(prompts[0].y).toBe(100);
    const last = stepPrompts(prompts, [], world, STEP);
    expect(last.prompts).toHaveLength(0);
    expect(last.wallHits).toHaveLength(0);
  });

  it('vanishes at a platform and reports a wall hit', () => {
    // first platform: x 288–416, y 352–384
    let step = stepPrompts([prompt(260, 360)], [], world, STEP);
    expect(step.prompts).toHaveLength(1);
    step = stepPrompts(step.prompts, [], world, STEP);
    expect(step.prompts).toHaveLength(0);
    expect(step.wallHits).toHaveLength(1);
  });

  it('a bug behind a wall is not hit', () => {
    const bug = bugAt(290, 362);
    const step = stepPrompts([prompt(275, 360)], [bug], world, STEP);
    expect(step.hits).toHaveLength(0);
    expect(step.wallHits).toHaveLength(1);
  });

  it('hits exactly one of two bugs on top of each other', () => {
    const a = bugAt(700, 462);
    const b = bugAt(700, 462);
    const p = prompt(680, 458);
    const step = stepPrompts([p], [a, b], world, STEP);
    expect(step.prompts).toHaveLength(0);
    expect(step.hits).toEqual([{ prompt: p, bug: a }]);
  });

  it('two prompts at once hit two different bugs', () => {
    const a = bugAt(700, 462);
    const b = bugAt(700, 462);
    const step = stepPrompts([prompt(680, 458), prompt(682, 458)], [a, b], world, STEP);
    expect(step.hits.map((h) => h.bug)).toEqual([a, b]);
  });

  it('flies through a bug that is no longer alive', () => {
    const bug = { ...bugAt(700, 462), alive: false };
    const step = stepPrompts([prompt(680, 458)], [bug], world, STEP);
    expect(step.hits).toHaveLength(0);
    expect(step.prompts).toHaveLength(1);
  });
});
