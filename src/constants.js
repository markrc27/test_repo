// Core game configuration.
// The classic Block Puzzle board is 8x8.
export const BOARD_SIZE = 8

// Create an empty board: a BOARD_SIZE x BOARD_SIZE grid of nulls.
// A cell is `null` when empty, or a color string when filled.
export function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  )
}
