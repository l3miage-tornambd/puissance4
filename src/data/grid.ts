export type PLAYER = "P1" | "P2";

export type COLUMN = readonly PLAYER[];
export type GRID = readonly [COLUMN, COLUMN, COLUMN, COLUMN, COLUMN, COLUMN, COLUMN];

/**
 * A game state is composed of a current gris and a current player turn.
 * Tokens are labeled with their coresponding player.
 */
export interface GAME_STATE {
    readonly grid: GRID;
    readonly turn: PLAYER;
}

export function getEmptyGrid(): GRID {
    return [[], [], [], [], [], [], []];
}
