import { GAME_STATE, PLAYER } from "./grid";

/**
 * Evaluate the validity of the provided state. 
 * @param state the state to evaluate
 * @returns {valid: true} if the state is a valid one (number of token is correct provided player turn)
 * @returns { valid: false, reason: `not the turn of ${PLAYER}` } if the number of token of P1 and P2 implies that this is the turn of the other player
 * @returns { valid: false, reason: `too much token for ${PLAYER}` } if there are too much token for PLAYER provided player turn and grid.
 * @returns { valid: false, reason: `column ${1 | 2 | 3 | 4 | 5 | 6 | 7} has too much tokens` } if there are too much token in column X (ordered from "left" to "right").
 * @returns { valid: false, reason: `There cannot be two winners` } if both players have at least 4 aligned tokens.
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
return {valid: true};
}
