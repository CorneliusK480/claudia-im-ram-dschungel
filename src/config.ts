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

// Lives & tokens (docs/prototype-reference.md, section 7)
export const START_LIVES = 3;
/** Death when Claudia's top edge is below this. */
export const PIT_Y = 584;
export const TOKEN_POINTS = 10;
/** Collected when Claudia's centre is closer than this to the token centre. */
export const TOKEN_HIT_X = 20;
export const TOKEN_HIT_Y = 22;
export const TOKEN_TEXT_EVERY = 25;
export const TOKEN_LIFE_EVERY = 100;

// Bugs
export const BUG_W = 24;
export const BUG_H = 18;
export const BUG_SPEED = 60;
export const BUG_POINTS = 100;
/** A bug that falls below this disappears without points. */
export const BUG_LOST_Y = 594;
/** Landing on a bug counts if Claudia's feet are less than this below its top. */
export const STOMP_DEPTH = 16;
/** Bounce speed after a stomp, as part of JUMP: with the jump key held, and without. */
export const BOUNCE_HELD = 0.85;
export const BOUNCE = 0.55;
/** A defeated bug is shown squashed for this long. */
export const SQUASH_TIME = 0.6;

// Death & respawn
export const DEATH_TIME = 3.2;
/** ENTER ends the death sequence only after this time. */
export const DEATH_SKIP_AFTER = 0.7;
export const GAMEOVER_INPUT_AFTER = 1.2;
export const INVULNERABLE_TIME = 1.5;
/** Respawn this far right of the checkpoint column's left edge. */
export const CHECKPOINT_SPAWN_X = 5;

// Screens (docs/prototype-reference.md, section 9)
export const INTRO_TIME = 2.5;
/** The intro can be skipped only after this time. */
export const INTRO_SKIP_AFTER = 0.4;
/** The title camera moves this fast to the right. */
export const TITLE_CAM_SPEED = 60;
/** Leg speed of the big title Claudia, as if walking this many px/s (slower than SPEED, else it blurs). */
export const TITLE_RUN_SPEED = 60;
/** Keys work on the "task done" screen only after this time. */
export const GOAL_INPUT_AFTER = 1.2;
export const GOAL_POINTS = 500;
/** Time bonus: BONUS_PER_SECOND points for every second below BONUS_TIME_LIMIT. */
export const BONUS_TIME_LIMIT = 240;
export const BONUS_PER_SECOND = 5;
/** Name of the highscore in the browser storage. */
export const HIGHSCORE_KEY = 'claudiaRamDschungelHighscore';

// Effects
export const DEATH_SHAKE = 0.3;
/** Largest shake offset, at shake = DEATH_SHAKE. */
export const SHAKE_PX = 6;
export const TEXT_LIFE = 1.3;
export const TEXT_RISE = 40;
export const PARTICLE_GRAV = 600;

// Game loop
export const STEP = 1 / 60;
export const MAX_FRAME = 0.1;

// Timers are compared with a small tolerance because of rounding errors.
export const EPS = 1e-9;

// Fixed colours and font
export const FRAME_COLOR = '#020a06';
export const ERROR_COLOR = '#ff6b6b';
export const SCORE_COLOR = '#ffd84a';
export const DEATH_COLOR = '#D97757';
export const TITLE_COLOR = '#D97757';
export const BUG_PARTICLE_COLOR = '#ff5a8a';
export const FONT = '"Courier New", monospace';

// Sky colours of level 1, drawn before the level file has arrived.
export const PLACEHOLDER_SKY: [string, string] = ['#03140c', '#0b3a22'];
