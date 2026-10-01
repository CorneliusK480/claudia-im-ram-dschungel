import { EPS, MAX_FRAME, STEP } from './config';

/**
 * Adds the real frame time (at most MAX_FRAME) and turns it into whole logic steps.
 * The rest is kept for the next frame.
 */
export function advance(accumulator: number, frameSeconds: number): { steps: number; accumulator: number } {
  let acc = accumulator + Math.min(Math.max(frameSeconds, 0), MAX_FRAME);
  const steps = Math.floor((acc + EPS) / STEP);
  acc = Math.max(0, acc - steps * STEP);
  return { steps, accumulator: acc };
}

/** Runs `step` 60 times per second and `render` once per frame. */
export function startLoop(step: () => void, render: () => void): void {
  let last: number | null = null;
  let accumulator = 0;

  // Back from a hidden tab: forget the time that passed meanwhile.
  document.addEventListener('visibilitychange', () => {
    last = null;
    accumulator = 0;
  });

  const frame = (now: number) => {
    const seconds = last === null ? 0 : (now - last) / 1000;
    last = now;
    const result = advance(accumulator, seconds);
    accumulator = result.accumulator;
    for (let i = 0; i < result.steps; i++) step();
    render();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
