import { VIEW_H, VIEW_W } from '../config';
import type { Theme } from '../level/types';
import { withAlpha } from './color';

const GLOW_PARALLAX = 0.15;
const VINE_PARALLAX = 0.4;
// The patterns repeat seamlessly after this many pixels.
const GLOW_PERIOD = 1440;
const VINE_PERIOD = 1280;

/** Small fixed random generator: same seed → same numbers on every frame. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Glow { x: number; y: number; r: number; a: number }
interface Vine { x: number; len: number; amp: number; waves: number; width: number; color: number }

const glows: Glow[] = (() => {
  const rnd = seeded(7);
  return Array.from({ length: 9 }, () => ({
    x: rnd() * GLOW_PERIOD,
    y: 60 + rnd() * 340,
    r: 70 + rnd() * 120,
    a: 0.08 + rnd() * 0.1,
  }));
})();

const vines: Vine[] = (() => {
  const rnd = seeded(42);
  return Array.from({ length: 22 }, () => ({
    x: rnd() * VINE_PERIOD,
    len: 60 + rnd() * 260,
    amp: 3 + rnd() * 7,
    waves: 1.5 + rnd() * 3,
    width: 2 + Math.floor(rnd() * 3),
    color: Math.floor(rnd() * 1000),
  }));
})();

/** Draws the copies of a repeating pattern that are visible at the given offset. */
function forEachRepeat(offset: number, period: number, margin: number, draw: (shift: number) => void) {
  const first = Math.floor((offset - margin) / period);
  const last = Math.floor((offset + VIEW_W + margin) / period);
  for (let i = first; i <= last; i++) draw(i * period - offset);
}

export function drawSky(ctx: CanvasRenderingContext2D, sky: [string, string]): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  gradient.addColorStop(0, sky[0]);
  gradient.addColorStop(1, sky[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

export function drawBackground(ctx: CanvasRenderingContext2D, theme: Theme, camX: number): void {
  drawSky(ctx, theme.sky);

  // Soft glowing spots, far away
  forEachRepeat(camX * GLOW_PARALLAX, GLOW_PERIOD, 200, (shift) => {
    for (const g of glows) {
      const x = g.x + shift;
      const gradient = ctx.createRadialGradient(x, g.y, 0, x, g.y, g.r);
      gradient.addColorStop(0, withAlpha(theme.far, g.a));
      gradient.addColorStop(1, withAlpha(theme.far, 0));
      ctx.fillStyle = gradient;
      ctx.fillRect(x - g.r, g.y - g.r, g.r * 2, g.r * 2);
    }
  });

  // Hanging wavy vines, closer
  ctx.lineCap = 'round';
  forEachRepeat(camX * VINE_PARALLAX, VINE_PERIOD, 20, (shift) => {
    for (const v of vines) {
      const x = v.x + shift;
      const color = theme.vines[v.color % theme.vines.length] ?? theme.top;
      ctx.strokeStyle = color;
      ctx.lineWidth = v.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      for (let y = 8; y <= v.len; y += 8) {
        ctx.lineTo(x + Math.sin((y / v.len) * v.waves * Math.PI * 2) * v.amp, y);
      }
      ctx.stroke();
      // a few leaves along the vine
      ctx.fillStyle = color;
      for (let y = 30; y < v.len; y += 46) {
        const lx = x + Math.sin((y / v.len) * v.waves * Math.PI * 2) * v.amp;
        const side = (Math.floor(y / 46) % 2) * 2 - 1;
        ctx.beginPath();
        ctx.ellipse(lx + side * 5, y, 5, 2.5, side * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}
