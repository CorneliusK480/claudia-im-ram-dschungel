import { PROMPT_H, PROMPT_W, VIEW_W } from '../config';
import type { GameState } from '../logic/game';

/** White speech bubbles with a small tip at the back. The command is a floating text above Claudia. */
export function drawPrompts(ctx: CanvasRenderingContext2D, state: GameState, camX: number): void {
  for (const p of state.prompts) {
    const x = p.x - camX;
    if (x + PROMPT_W < 0 || x > VIEW_W) continue;
    // tip at the bottom, on the side Claudia shot from
    const back = p.dir > 0 ? x + 3 : x + PROMPT_W - 3;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#223';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(back, p.y + PROMPT_H - 4);
    ctx.lineTo(back - p.dir * 4, p.y + PROMPT_H + 3);
    ctx.lineTo(back + p.dir * 5, p.y + PROMPT_H - 4);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(x, p.y, PROMPT_W, PROMPT_H - 3, 4);
    ctx.fill();
    ctx.stroke();
    // cover the stroke where the tip meets the bubble
    ctx.fillRect(Math.min(back, back + p.dir * 4) + 0.5, p.y + PROMPT_H - 5, 4, 2);
    // three dots: "typing"
    ctx.fillStyle = '#556';
    for (let k = 0; k < 3; k++) ctx.fillRect(x + 3 + k * 4, p.y + 5, 2, 2);
  }
}
