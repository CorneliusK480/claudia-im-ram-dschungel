import { PET_FLY_SPEED, PET_GRAV, PET_HOP, PET_SIDE, PET_SPIN, PIT_Y, VIEW_W } from '../config';
import { texts } from '../texts';
import type { Bug } from './bugs';

export type PetKind = keyof typeof texts.petSayings;
export const PET_KINDS: PetKind[] = ['gift', 'butterfly', 'duck', 'cookie'];

/** A bug turned into something harmless by a prompt. It touches nothing and leaves the picture. */
export interface Pet {
  kind: PetKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Rotation in radians */
  angle: number;
  /** 1 = looks right, -1 = looks left */
  facing: 1 | -1;
  /** Seconds since it appeared, for wing beats and swaying. */
  t: number;
}

/** In the place of the bug, looking where the bug was walking. */
export function createPet(kind: PetKind, bug: Bug): Pet {
  const facing = bug.vx > 0 ? 1 : -1;
  const butterfly = kind === 'butterfly';
  return {
    kind,
    x: bug.x,
    y: bug.y,
    vx: butterfly ? 0 : facing * PET_SIDE,
    vy: butterfly ? -PET_FLY_SPEED : -PET_HOP,
    angle: 0,
    facing,
    t: 0,
  };
}

/** The butterfly rises evenly, the others hop up, spin and fall. Returns the pets still in the picture. */
export function stepPets(pets: Pet[], camX: number, dt: number): Pet[] {
  for (const p of pets) {
    p.t += dt;
    if (p.kind !== 'butterfly') {
      p.vy += PET_GRAV * dt;
      p.angle += p.facing * PET_SPIN * dt;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
  return pets.filter((p) => p.y >= -40 && p.y <= PIT_Y && p.x >= camX - 40 && p.x <= camX + VIEW_W + 40);
}
