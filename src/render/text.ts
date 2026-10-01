import { FONT } from '../config';

/** Bold text with a dark shadow 2 px to the bottom right. `y` is the baseline. */
export function shadowText(
  ctx: CanvasRenderingContext2D, str: string, x: number, y: number, size: number, color: string,
  align: CanvasTextAlign = 'center',
): void {
  ctx.font = `bold ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#000a';
  ctx.fillText(str, x + 2, y + 2);
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
}
