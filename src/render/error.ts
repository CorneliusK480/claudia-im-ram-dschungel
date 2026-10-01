import { ERROR_COLOR, FONT, FRAME_COLOR, VIEW_H, VIEW_W } from '../config';
import { texts } from '../texts';

const LEFT = 60;
const MAX_LINES = 12;
const LINE_H = 24;

/** Splits a text into lines that fit into `maxWidth`. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function drawError(ctx: CanvasRenderingContext2D, title: string, errors: string[]): void {
  ctx.fillStyle = FRAME_COLOR;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.strokeStyle = ERROR_COLOR;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, VIEW_W - 40, VIEW_H - 40);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = ERROR_COLOR;
  ctx.font = `bold 28px ${FONT}`;
  ctx.fillText(title, LEFT, 60);

  ctx.font = `16px ${FONT}`;
  ctx.fillStyle = '#f0e6e6';
  let y = 120;
  let lines = 0;
  for (let i = 0; i < errors.length; i++) {
    const wrapped = wrap(ctx, errors[i], VIEW_W - 2 * LEFT - 20);
    if (lines + wrapped.length > MAX_LINES) {
      ctx.fillStyle = ERROR_COLOR;
      ctx.fillText(texts.moreErrors(errors.length - i), LEFT, y);
      return;
    }
    wrapped.forEach((text, j) => {
      ctx.fillText(j === 0 ? `• ${text}` : `  ${text}`, LEFT, y);
      y += LINE_H;
    });
    lines += wrapped.length;
  }
}
