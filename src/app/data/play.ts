import {GAME_STATE, GRID} from "./grid";

export type PLAY_SUCCESS = Readonly<{success: true, state: GAME_STATE}>;
export type PLAY_FAILURE = Readonly<{success: false, reason: "no such column" | "game is over" | "column is full"}>;

/**
 * Put a token of current player at column colmun.
 * Errors are chosen in the declaration order (if several errors are possible, returns the first one in the list).
 * @param state the state to evaluate, supposed to be a valid one.
 * @param column the column where to play the token of state.turn (from integer 1 to 7)
 * @returns {success: true, state: GAME_STATE} with the returned GAME_STATE having a changed turn and the new grid the same expect with a new token in pleyed column.
 * @returns {success: false, reason: "no such column"} if the column number is not a valid one.
 * @returns {success: false, reason: "column is full"} if the column already have 6 tokens.
 */
 export function play(state: GAME_STATE, column: number): PLAY_SUCCESS | PLAY_FAILURE {
   const c = column - 1;
   const COL = state.grid[c];
   if (COL === undefined) {
     return {success: false, reason: "no such column"};
   }
   if (COL.length >= 6) {
     return {success: false, reason: "column is full"}
   }

   return {
     success: true,
     state: {
       turn: state.turn === "P1" ? "P2" : "P1",
       grid: state.grid.map((P, i) => i !== c ? P : [...P, state.turn]) as unknown as GRID
     }
   };
}
