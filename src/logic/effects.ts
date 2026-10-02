import { EPS, PARTICLE_GRAV, TEXT_LIFE } from '../config';
import type { Random } from './random';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Seconds left */
  life: number;
  color: string;
  size: number;
}

/** A short text that rises and fades out. */
export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  /** Seconds since it appeared */
  t: number;
  /** Seconds it stays visible */
  life: number;
}

/** Visual feedback. Lives in the game state so it stops and goes with the game. */
export interface Effects {
  particles: Particle[];
  texts: FloatingText[];
  /** Seconds of screen shake left */
  shake: number;
}

export function createEffects(): Effects {
  return { particles: [], texts: [], shake: 0 };
}

/** n particles flying in all directions from (x, y), with a small push upwards. */
export function burst(
  effects: Effects, random: Random, x: number, y: number, color: string, n: number, speed = 220,
): void {
  for (let i = 0; i < n; i++) {
    const a = random() * Math.PI * 2;
    const s = speed * (0.3 + random());
    effects.particles.push({
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 80,
      life: 0.5 + random() * 0.4,
      color,
      size: 2 + random() * 3,
    });
  }
}

export function say(
  effects: Effects, x: number, y: number, text: string, color: string, life = TEXT_LIFE,
): void {
  effects.texts.push({ x, y, text, color, t: 0, life });
}

export function stepEffects(effects: Effects, dt: number): void {
  for (const q of effects.particles) {
    q.life -= dt;
    q.vy += PARTICLE_GRAV * dt;
    q.x += q.vx * dt;
    q.y += q.vy * dt;
  }
  effects.particles = effects.particles.filter((q) => q.life > EPS);
  for (const t of effects.texts) t.t += dt;
  effects.texts = effects.texts.filter((t) => t.t < t.life - EPS);
  effects.shake = effects.shake - dt > EPS ? effects.shake - dt : 0;
}
