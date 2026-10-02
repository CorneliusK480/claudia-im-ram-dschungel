// Music and sounds with the Web Audio API, like the prototype (docs/prototype-reference.md, section 10).
// No audio files: every note is made in the browser. Sound errors never stop the game.

import { MUSIC_LOOKAHEAD, MUSIC_START_DELAY } from '../config';
import type { GameEvent } from '../logic/events';
import { SOUNDS, type ToneSpec } from './sounds';
import { parseTrack, TRACKS, type ParsedTrack } from './tracks';

export interface Audio {
  /** Call on every game key and click: browsers allow sound only after an input. */
  unlock(): void;
  /** Off: everything is silent at once. On: the music goes on where it stopped. */
  setMuted(muted: boolean): void;
  /** Plays the sound of an event right away. */
  play(event: GameEvent): void;
  /** Once per drawn frame: plans the music of the next moment. `null` = no music. */
  update(trackName: string | null, paused: boolean): void;
}

const PARSED: Record<string, ParsedTrack> = Object.fromEntries(
  Object.entries(TRACKS).map(([name, track]) => [name, parseTrack(track)]),
);

type AudioContextClass = typeof AudioContext;

export function createAudio(muted: boolean): Audio {
  let ctx: AudioContext | null = null;
  /** All notes go through this main switch (volume 1) to the speakers. */
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  const music = { name: null as string | null, step: 0, next: 0 };

  function output(c: AudioContext): GainNode {
    if (!master) {
      master = c.createGain();
      master.gain.value = 1;
      master.connect(c.destination);
    }
    return master;
  }

  function noteAt(c: AudioContext, freq: number, t0: number, dur: number, type: OscillatorType, vol: number): void {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(output(c));
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  function tone(c: AudioContext, { f1, f2, dur, type, vol, delay }: ToneSpec): void {
    const t0 = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f1, t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(output(c));
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  function drumAt(c: AudioContext, kind: string, t0: number): void {
    if (kind === 'k') {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(150, t0);
      o.frequency.exponentialRampToValueAtTime(40, t0 + 0.12);
      g.gain.setValueAtTime(0.13, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
      o.connect(g).connect(output(c));
      o.start(t0);
      o.stop(t0 + 0.16);
    } else if (kind === 's' || kind === 'h') {
      // One noise buffer for all snares and hi-hats, always played from the start.
      if (!noise) {
        noise = c.createBuffer(1, c.sampleRate * 0.3, c.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const src = c.createBufferSource();
      const f = c.createBiquadFilter();
      const g = c.createGain();
      src.buffer = noise;
      f.type = 'highpass';
      f.frequency.value = kind === 'h' ? 7000 : 1500;
      const dur = kind === 'h' ? 0.04 : 0.12;
      g.gain.setValueAtTime(kind === 'h' ? 0.025 : 0.06, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(f).connect(g).connect(output(c));
      src.start(t0);
      src.stop(t0 + dur + 0.02);
    }
  }

  return {
    unlock() {
      try {
        if (!ctx) {
          const w = window as unknown as { AudioContext?: AudioContextClass; webkitAudioContext?: AudioContextClass };
          const Ctx = w.AudioContext ?? w.webkitAudioContext;
          if (Ctx) ctx = new Ctx();
        }
        if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
      } catch {
        // no sound possible: the game simply stays silent
      }
    },

    setMuted(value) {
      muted = value;
      if (!muted || !ctx) return;
      try {
        // Turn the music back by the planned eighths that have not begun yet,
        // so it starts again exactly where it was last heard.
        const track = music.name ? PARSED[music.name] : undefined;
        if (track && music.next > 0) {
          while (music.next - track.sd > ctx.currentTime && music.step > 0) {
            music.next -= track.sd;
            music.step--;
          }
        }
        music.next = 0;
        // Cutting the main switch silences all sounding and planned notes at once.
        if (master) {
          master.disconnect();
          master = null;
        }
      } catch {
        // a sound error must not stop the game
      }
    },

    play(event) {
      if (muted || !ctx) return;
      try {
        for (const spec of SOUNDS[event]) tone(ctx, spec);
      } catch {
        // a broken sound must not stop the game
      }
    },

    update(trackName, paused) {
      // Another track (also null → jungle) starts from the beginning; the same one goes on.
      if (trackName !== music.name) {
        music.name = trackName;
        music.step = 0;
        music.next = 0;
      }
      const c = ctx;
      if (!c || c.state !== 'running') return;
      const track = trackName ? PARSED[trackName] : undefined;
      if (!track || muted || paused) {
        music.next = 0;
        return;
      }
      try {
        const { sd } = track;
        if (music.next < c.currentTime) music.next = c.currentTime + MUSIC_START_DELAY;
        while (music.next < c.currentTime + MUSIC_LOOKAHEAD) {
          const s = music.step;
          const b = track.bass[s % track.bass.length];
          const l = track.lead[s % track.lead.length];
          if (b) noteAt(c, b, music.next, sd * 0.9, track.bassWave, track.bassWave === 'sawtooth' ? 0.035 : 0.06);
          if (l) noteAt(c, l, music.next, sd * 0.85, track.leadWave, track.leadWave === 'triangle' ? 0.05 : 0.022);
          drumAt(c, track.drums[s % track.drums.length], music.next);
          music.next += sd;
          music.step++;
        }
      } catch {
        // a broken note must not stop the game
      }
    },
  };
}
