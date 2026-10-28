import { BOARD_SIZE } from './constants.js'

// Pure board logic. A board is a 2D array (row-major) where each cell is
// either null (empty) or a color string (filled). Pieces are described by
// their normalized `cells` ([row, col] offsets) plus a `color`.

// Can `cells` be placed with its top-left bounding-box corner at (row, col)?
// Every target cell must be in-bounds and currently empty.
export function canPlace(board, cells, row, col) {
  for (const [dr, dc] of cells) {
    const r = row + dr
    const c = col + dc
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false
    if (board[r][c] !== null) return false
  }
  return true
}

// Return a NEW board with the piece's cells filled with `color`.
// Assumes canPlace already returned true; callers should check first.
export function placePiece(board, cells, row, col, color) {
  const next = board.map((r) => r.slice())
  for (const [dr, dc] of cells) {
    next[row + dr][col + dc] = color
  }
  return next
}

// Is there ANY position on the board where `cells` can be placed?
export function canPlaceAnywhere(board, cells) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (canPlace(board, cells, r, c)) return true
    }
  }
  return false
}

export { BOARD_SIZE }
