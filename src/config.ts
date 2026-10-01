// All fixed values of the game. Units: pixels and seconds.

export const TILE = 32;
export const VIEW_W = 960;
export const VIEW_H = 544;
export const ROWS = 17;

// Movement & physics (docs/prototype-reference.md, section 5)
export const GRAV = 2100;
export const JUMP = 780;
export const SPEED = 270;
export const ACC = 2600;
export const FRICTION = 2400;
export const MAXFALL = 950;
export const COYOTE = 0.1;
export const JUMP_BUFFER = 0.13;
export const JUMP_CUT = 0.42;

export const PLAYER_W = 22;
export const PLAYER_H = 28;
export const GOAL_W = 48;
export const GOAL_H = 64;

export const RESPAWN_DELAY = 0.5;

// Game loop
export const STEP = 1 / 60;
export const MAX_FRAME = 0.1;

// Timers are compared with a small tolerance because of rounding errors.
export const EPS = 1e-9;

// Fixed colours and font
export const FRAME_COLOR = '#020a06';
export const ERROR_COLOR = '#ff6b6b';
export const FONT = '"Courier New", monospace';

// Sky colours of level 1, drawn before the level file has arrived.
export const PLACEHOLDER_SKY: [string, string] = ['#03140c', '#0b3a22'];
