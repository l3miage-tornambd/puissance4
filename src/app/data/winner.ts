import {GAME_STATE, PLAYER} from "./grid";

type DELTA = -1 | 0 | 1;
type DIRECTION = [dx: DELTA, dy: DELTA]
const directions: DIRECTION[] = [
  [1, 0], [1, -1], [1, 1], [0, 1]
]

export function winnerCond(state: GAME_STATE, f: (P: PLAYER) => boolean): ReturnType<typeof winner> {
  let player: PLAYER;
  if (state.grid.find(
    (L, col) => L.find((token, line) => f(token) && directions.find(([dc, dl]) => {
        // 4 same in that direction, from that position
        let c = col + dc;
        let l = line + dl;
        let nb = 1;
        player = state.grid[col][line];
        while (state.grid[c]?.[l] === player) {
          c += dc;
          l += dl;
          nb++;
        }
        return nb >= 4
      })
    ))
  ) {
    return player!;
  }

  return !state.grid.find( L => L.length < 6) ? "DRAW" : "no winner yet";
}

/**
 * Returns the winner for a given state.
 * Returns values are chosen in the declaration order
 * (if several return values are possible, returns the first one in the list).
 * @param state the state to evaluate, supposed to be a valid one.
 * @returns P1 if there are at least 4 P1 tokens aligned.
 * @returns P2 if there are at least 4 P2 tokens aligned.
 * @returns DRAW if the grid is full and no player has 4 aligned tokens.
 * @returns "no winner yet" if the grid is not full and no player has 4 aligned tokens.
 */
 export function winner(state: GAME_STATE): PLAYER | "DRAW" | "no winner yet" {
   return winnerCond(state, () => true)
 }
