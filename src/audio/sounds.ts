// The sounds, word for word from the prototype (docs/prototype-reference.md, section 10.2).

import type { GameEvent } from '../logic/events';

/** One tone: pitch glides from f1 to f2 over `dur` seconds, starting `delay` seconds later. */
export interface ToneSpec {
  f1: number;
  f2: number;
  dur: number;
  type: OscillatorType;
  vol: number;
  delay: number;
}

const tone = (f1: number, f2: number, dur: number, type: OscillatorType = 'square', vol = 0.07, delay = 0): ToneSpec =>
  ({ f1, f2, dur, type, vol, delay });

/** Several tones one after the other, `gap` seconds apart. */
const arpeggio = (freqs: number[], dur: number, type: OscillatorType, vol: number, gap: number, end = 1): ToneSpec[] =>
  freqs.map((f, i) => tone(f, f * end, dur, type, vol, i * gap));

export const SOUNDS: Record<GameEvent, ToneSpec[]> = {
  jump: [tone(320, 640, 0.12, 'square', 0.05)],
  coin: [tone(988, 988, 0.05, 'square', 0.04), tone(1319, 1319, 0.12, 'square', 0.04, 0.05)],
  oneup: arpeggio([784, 988, 1175, 1568], 0.08, 'square', 0.05, 0.06),
  stomp: [tone(500, 60, 0.18, 'square', 0.07)],
  hurt: [tone(300, 40, 0.5, 'sawtooth', 0.07)],
  save: arpeggio([660, 880], 0.1, 'triangle', 0.07, 0.1),
  win: arpeggio([523, 659, 784, 1047, 784, 1047], 0.14, 'square', 0.05, 0.11),
  over: arpeggio([392, 330, 262, 196], 0.22, 'triangle', 0.08, 0.2, 0.98),
};
