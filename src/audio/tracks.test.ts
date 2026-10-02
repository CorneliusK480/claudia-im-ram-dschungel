import { describe, expect, it } from 'vitest';
import { noteFreq, parseTrack, TRACKS } from './tracks';

describe('noteFreq', () => {
  it('uses A4 = 440 Hz and equal steps', () => {
    expect(noteFreq('A4')).toBe(440);
    expect(noteFreq('A2')).toBeCloseTo(110);
    expect(noteFreq('C6')).toBeCloseTo(1046.5, 1);
    expect(noteFreq('G#4')).toBeCloseTo(415.3, 1);
  });
});

describe('parseTrack (jungle)', () => {
  const track = parseTrack(TRACKS.jungle);

  it('has 32 bass, 64 lead and 16 drum eighths', () => {
    expect(track.bass).toHaveLength(32);
    expect(track.lead).toHaveLength(64);
    expect(track.drums).toHaveLength(16);
  });

  it('has eighths of 60 / 132 / 2 s', () => {
    expect(track.sd).toBeCloseTo(0.2273, 4);
  });

  it('turns notes into frequencies and rests into 0', () => {
    expect(track.bass[0]).toBeCloseTo(110);
    expect(track.bass[1]).toBe(0);
    expect(track.drums.slice(0, 3)).toEqual(['k', '.', 'h']);
  });

  it('keeps the waveforms', () => {
    expect(track.bassWave).toBe('triangle');
    expect(track.leadWave).toBe('square');
  });
});
