import { GAME_STATE, PLAYER } from "./grid";

/**
 * Returns who is the winner for a given state.
 * @param state the state to evaluate, supposed to be a valid one.
 * @returns P1 if there are at least 4 P1 tokens aligned.
 * @returns P2 if there are at least 4 P2 tokens aligned.
 * @returns DRAW if the grid is full and no player has 4 aligned tokens.
 * @returns DRAW if the grid is not full and no player has 4 aligned tokens.
 */
 export function winner(state: GAME_STATE): PLAYER | "DRAW" | "no winner yet" {
    return "no winner yet";
}
