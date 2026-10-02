/** What the player wants, independent of keyboard or touch. */
export interface InputState {
  left: boolean;
  right: boolean;
  jumpHeld: boolean;
  /** Jump key was newly pressed since the last logic step. */
  jumpPressed: boolean;
  /** Enter was newly pressed since the last logic step. */
  enterPressed: boolean;
  /** P or ESC was newly pressed since the last logic step. */
  pausePressed: boolean;
  /** X or F was newly pressed since the last logic step. */
  shootPressed: boolean;
}

export const NO_INPUT: InputState = {
  left: false,
  right: false,
  jumpHeld: false,
  jumpPressed: false,
  enterPressed: false,
  pausePressed: false,
  shootPressed: false,
};
