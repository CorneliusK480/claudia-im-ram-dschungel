import { EPS, PLAYER_W, PROMPT_H, PROMPT_LIFE, PROMPT_SPEED, PROMPT_W, PROMPT_Y } from '../config';
import { bugRect, type Bug } from './bugs';
import type { PetKind } from './pets';
import type { Player } from './player';
import { overlaps, type Rect } from './rect';
import type { World } from './world';

/** A flying speech bubble with a command. It turns the first bug it hits into a pet. */
export interface Prompt {
  x: number;
  y: number;
  /** 1 = flies right, -1 = flies left */
  dir: 1 | -1;
  text: string;
  /** The pet the command asks for, null = a random one. */
  pet: PetKind | null;
  /** Seconds left */
  life: number;
}

export function promptRect(p: Prompt): Rect {
  return { x: p.x, y: p.y, w: PROMPT_W, h: PROMPT_H };
}

/** In front of Claudia at chest height, flying where she looks. */
export function createPrompt(player: Player, command: { text: string; pet: PetKind | null }): Prompt {
  const dir = player.facing;
  return {
    x: dir > 0 ? player.x + PLAYER_W : player.x - PROMPT_W,
    y: player.y + PROMPT_Y,
    dir,
    text: command.text,
    pet: command.pet,
    life: PROMPT_LIFE,
  };
}

export interface PromptStep {
  /** The prompts still flying. */
  prompts: Prompt[];
  /** Where prompts vanished at a wall or platform. */
  wallHits: { x: number; y: number }[];
  /** Which prompt hit which bug. Each bug at most once. */
  hits: { prompt: Prompt; bug: Bug }[];
}

/** Moves the prompts and finds walls and bugs they hit. Changes no bugs; that is up to the caller. */
export function stepPrompts(prompts: Prompt[], bugs: Bug[], world: World, dt: number): PromptStep {
  const result: PromptStep = { prompts: [], wallHits: [], hits: [] };
  for (const p of prompts) {
    p.x += p.dir * PROMPT_SPEED * dt;
    p.life -= dt;
    if (p.life <= EPS) continue;
    const r = promptRect(p);
    if (world.solids.some((s) => overlaps(r, s))) {
      result.wallHits.push({ x: p.x + PROMPT_W / 2, y: p.y + PROMPT_H / 2 });
      continue;
    }
    const bug = bugs.find((b) => b.alive && !result.hits.some((h) => h.bug === b) && overlaps(r, bugRect(b)));
    if (bug) {
      result.hits.push({ prompt: p, bug });
      continue;
    }
    result.prompts.push(p);
  }
  return result;
}
