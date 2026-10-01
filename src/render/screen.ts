import { VIEW_H, VIEW_W } from '../config';

/** Minimum space around the play area, so the dark frame and the glow stay visible. */
const MARGIN = 16;

export interface Screen {
  ctx: CanvasRenderingContext2D;
  /** Called after every size change (the canvas is cleared by it). */
  onResize(callback: () => void): void;
}

/**
 * Scales the canvas into the window without distortion and keeps it sharp:
 * the internal size is the real pixel size, drawing still uses 960 × 544 coordinates.
 */
export function setupScreen(canvas: HTMLCanvasElement): Screen {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D wird nicht unterstützt');
  const callbacks: (() => void)[] = [];

  const resize = () => {
    const availW = Math.max(1, window.innerWidth - 2 * MARGIN);
    const availH = Math.max(1, window.innerHeight - 2 * MARGIN);
    const scale = Math.min(availW / VIEW_W, availH / VIEW_H);
    const cssW = Math.floor(VIEW_W * scale);
    const cssH = Math.floor(VIEW_H * scale);
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    canvas.style.left = `${Math.floor((window.innerWidth - cssW) / 2)}px`;
    canvas.style.top = `${Math.floor((window.innerHeight - cssH) / 2)}px`;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(canvas.width / VIEW_W, 0, 0, canvas.height / VIEW_H, 0, 0);
    ctx.imageSmoothingEnabled = false;
    for (const cb of callbacks) cb();
  };

  window.addEventListener('resize', resize);
  resize();
  return { ctx, onResize: (cb) => callbacks.push(cb) };
}
