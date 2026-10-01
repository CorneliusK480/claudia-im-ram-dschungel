import { PLAYER_H, PLAYER_W, TILE, TOKEN_HIT_X, TOKEN_HIT_Y } from '../config';
import type { LevelData } from '../level/types';
import type { Player } from './player';

export interface Token {
  /** Centre in pixels */
  x: number;
  y: number;
  taken: boolean;
}

/** The real tokens of the level, each row 32 px apart. The bait tokens (`fakeTokens`) are not part of this slice. */
export function buildTokens(level: LevelData): Token[] {
  const tokens: Token[] = [];
  for (const [c, r, n] of level.tokens) {
    for (let k = 0; k < n; k++) {
      tokens.push({ x: (c + k) * TILE + TILE / 2, y: r * TILE + TILE / 2, taken: false });
    }
  }
  return tokens;
}

export function touchesToken(player: Player, token: Token): boolean {
  return (
    Math.abs(player.x + PLAYER_W / 2 - token.x) < TOKEN_HIT_X &&
    Math.abs(player.y + PLAYER_H / 2 - token.y) < TOKEN_HIT_Y
  );
}
