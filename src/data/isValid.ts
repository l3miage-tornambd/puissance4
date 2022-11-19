import { GAME_STATE, PLAYER } from "./grid";
import {winnerCond} from "./winner";

function nb(state: GAME_STATE, p: GAME_STATE["turn"]): number {
  return state.grid.reduce(
    (nb, L) => nb + L.reduce( (n, c) => c === p ? 1 + n : n, 0)
    , 0
  )
}

/**
 * Evaluate the validity of the provided state.
 * Errors are chosen in the declaration order (if several errors are possible, returns the first one in the list).
 * @param state the state to evaluate
 * @returns {valid: true}
 *          if the state is a valid one (number of token is correct provided player turn)
 * @returns { valid: false, reason: `column ${1 | 2 | 3 | 4 | 5 | 6 | 7} has too much tokens` }
 *          if there are too much token in column X (ordered from "left" to "right").
 * @returns { valid: false, reason: `too much token for ${PLAYER}` }
 *          if there are too much token for PLAYER whatever the player turn is.
 *          (there would be an error with Player1 turn as well with Player2 turn)
 * @returns { valid: false, reason: `not the turn of ${PLAYER}` }
 *          if the number of token of P1 and P2 implies that this is the turn of the other player
 * @returns { valid: false, reason: `There cannot be two winners` }
 *          if both players have at least 4 aligned tokens.
 */
 export function isValid(state: GAME_STATE): Readonly<{valid: true}>
 | Readonly<{
       valid: false,
       reason: `not the turn of ${PLAYER}`
             | `too much token for ${PLAYER}` // PLAYER has too much token provided that it is the turn of state.turn and P1 begins
             | `column ${1 | 2 | 3 | 4 | 5 | 6 | 7} has too much tokens`
             | `There cannot be two winners`
   }>
{
  const nbP1 = nb(state, "P1");
  const nbP2 = nb(state, "P2");

  const i = state.grid.findIndex(L => L.length > 6) + 1;
  if (i > 0) {
    const c = i as (1 | 2 | 3 | 4 | 5 | 6 | 7);
    return {valid: false, reason: `column ${c} has too much tokens`}
  }

  if (nbP1 > nbP2 + 1) return {valid: false, reason: "too much token for P1"}
  if (nbP2 > nbP1    ) return {valid: false, reason: "too much token for P2"}

  if (nbP1 === nbP2 + 1 && state.turn === "P1") return {valid: false, reason: "not the turn of P1"}
  if (nbP1 === nbP2 && state.turn === "P2") return {valid: false, reason: "not the turn of P2"};

  if ( winnerCond(state, p => p === "P1") === "P1"
    && winnerCond(state, p => p === "P2") === "P2"
  ) {
    return { valid: false, reason: `There cannot be two winners` };
  }

  return {valid: true};
}
