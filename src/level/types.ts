// Level file format, see docs/prototype-reference.md, section 2.

export interface Theme {
  sky: [string, string];
  far: string;
  ground: string;
  top: string;
  accent: string;
  vines: string[];
  lava?: boolean;
}

export type Pair = [number, number];
export type Triple = [number, number, number];

export interface LevelData {
  name: string;
  sub: string;
  theme: Theme;
  music: string;
  width: number;
  start: Pair;
  goal: Pair;
  ground: Pair[];
  blocks: [number, number, number, number][];
  plats: Triple[];
  movers: [number, number, number, number, number][];
  crumbles: Triple[];
  fakes: Triple[];
  fakeTokens: Triple[];
  tokens: Triple[];
  bugs: Pair[];
  viruses: Pair[];
  injectors: Pair[];
  spikes: Pair[];
  leaks: Pair[];
  power: Pair[];
  dj: Pair[];
  saves: number[];
  boss?: Pair;
}
