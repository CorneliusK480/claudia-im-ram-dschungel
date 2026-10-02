// Music tracks, word for word from the prototype (docs/prototype-reference.md, section 10.3).
// Each text: eighth notes separated by spaces, "." = rest. Drums: k = kick, s = snare, h = hi-hat.

export interface Track {
  bpm: number;
  bassWave: OscillatorType;
  leadWave: OscillatorType;
  bass: string;
  lead: string;
  drums: string;
}

/** A track turned into numbers: one entry per eighth note, 0 = rest. */
export interface ParsedTrack {
  /** Length of one eighth note in seconds. */
  sd: number;
  bassWave: OscillatorType;
  leadWave: OscillatorType;
  bass: number[];
  lead: number[];
  drums: string[];
}

/** Only the track of level 1 and the title for now; the others come with their slices. */
export const TRACKS: Record<string, Track> = {
  jungle: {
    bpm: 132,
    bassWave: 'triangle',
    leadWave: 'square',
    bass: 'A2 . A3 . A2 . A3 A2 F2 . F3 . F2 . F3 F2 G2 . G3 . G2 . G3 G2 E2 . E3 . E2 . G#2 B2',
    lead:
      'E5 . A4 . C5 . E5 D5 C5 . A4 . . . . . D5 . F5 . A5 . G5 F5 E5 . . . . . . . ' +
      'B4 . D5 . G5 . F5 E5 D5 . B4 . . . . . C5 . B4 . A4 . G#4 . A4 . . . . . . .',
    drums: 'k . h . s . h . k k h . s . h h',
  },
};

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Frequency of a note like "A4" or "G#2", A4 = 440 Hz. */
export function noteFreq(name: string): number {
  const m = /^([A-G])(#?)(\d)$/.exec(name);
  if (!m) throw new Error(`Unknown note: ${name}`);
  const semi = SEMITONES[m[1]] + (m[2] ? 1 : 0) + (Number(m[3]) + 1) * 12;
  return 440 * Math.pow(2, (semi - 69) / 12);
}

const notes = (text: string) => text.trim().split(/\s+/).map((n) => (n === '.' ? 0 : noteFreq(n)));

export function parseTrack(track: Track): ParsedTrack {
  return {
    sd: 60 / track.bpm / 2,
    bassWave: track.bassWave,
    leadWave: track.leadWave,
    bass: notes(track.bass),
    lead: notes(track.lead),
    drums: track.drums.trim().split(/\s+/),
  };
}
