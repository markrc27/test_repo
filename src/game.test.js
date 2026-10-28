import { describe, it, expect } from 'vitest'
import {
  canPlace,
  placePiece,
  canPlaceAnywhere,
  findClears,
  applyClears,
  clearedKeys,
  clearCount,
} from './game.js'
import { createEmptyBoard, BOARD_SIZE } from './constants.js'

// Fill an entire row / column with a color, returning a new board.
function fillRow(board, r, color = '#fff') {
  const next = board.map((row) => row.slice())
  for (let c = 0; c < next[0].length; c++) next[r][c] = color
  return next
}
function fillCol(board, c, color = '#fff') {
  const next = board.map((row) => row.slice())
  for (let r = 0; r < next.length; r++) next[r][c] = color
  return next
}

// A simple 2x2 square piece and an L for tests.
const square = [[0, 0], [0, 1], [1, 0], [1, 1]]
const hLine3 = [[0, 0], [0, 1], [0, 2]]

describe('canPlace', () => {
  it('allows placing within an empty board', () => {
    const board = createEmptyBoard()
    expect(canPlace(board, square, 0, 0)).toBe(true)
    expect(canPlace(board, square, 6, 6)).toBe(true)
  })

  it('rejects placement out of bounds', () => {
    const board = createEmptyBoard()
    expect(canPlace(board, square, 7, 7)).toBe(false) // 2x2 would spill off
    expect(canPlace(board, hLine3, 0, 6)).toBe(false) // needs cols 6,7,8
    expect(canPlace(board, square, -1, 0)).toBe(false)
  })

  it('rejects placement over a filled cell', () => {
    let board = createEmptyBoard()
    board = placePiece(board, [[0, 0]], 1, 1, '#fff')
    expect(canPlace(board, square, 0, 0)).toBe(false) // overlaps (1,1)
    expect(canPlace(board, square, 2, 2)).toBe(true)
  })
})

describe('placePiece', () => {
  it('fills the correct cells with the color and leaves others empty', () => {
    const board = createEmptyBoard()
    const next = placePiece(board, square, 3, 4, '#abc')
    expect(next[3][4]).toBe('#abc')
    expect(next[3][5]).toBe('#abc')
    expect(next[4][4]).toBe('#abc')
    expect(next[4][5]).toBe('#abc')
    expect(next[0][0]).toBe(null)
  })

  it('does not mutate the original board', () => {
    const board = createEmptyBoard()
    placePiece(board, square, 0, 0, '#abc')
    expect(board[0][0]).toBe(null)
  })
})

describe('canPlaceAnywhere', () => {
  it('is true on an empty board', () => {
    expect(canPlaceAnywhere(createEmptyBoard(), square)).toBe(true)
  })

  it('is false when the board is completely full', () => {
    const full = createEmptyBoard().map((row) => row.map(() => '#fff'))
    expect(canPlaceAnywhere(full, [[0, 0]])).toBe(false)
  })

  it('finds the one remaining gap for a single cell', () => {
    const board = createEmptyBoard().map((row) => row.map(() => '#fff'))
    board[5][5] = null
    expect(canPlaceAnywhere(board, [[0, 0]])).toBe(true)
    expect(canPlaceAnywhere(board, square)).toBe(false)
  })
})

describe('findClears', () => {
  it('finds nothing on a partial board', () => {
    let board = createEmptyBoard()
    board = placePiece(board, hLine3, 0, 0, '#fff')
    expect(findClears(board)).toEqual({ rows: [], cols: [] })
  })

  it('detects a single full row', () => {
    const board = fillRow(createEmptyBoard(), 3)
    expect(findClears(board)).toEqual({ rows: [3], cols: [] })
  })

  it('detects a single full column', () => {
    const board = fillCol(createEmptyBoard(), 6)
    expect(findClears(board)).toEqual({ rows: [], cols: [6] })
  })

  it('detects a row and column clearing simultaneously', () => {
    let board = fillRow(createEmptyBoard(), 0)
    board = fillCol(board, 0)
    expect(findClears(board)).toEqual({ rows: [0], cols: [0] })
  })

  it('detects a completely full board as all rows and cols', () => {
    const board = createEmptyBoard().map((row) => row.map(() => '#fff'))
    const { rows, cols } = findClears(board)
    expect(rows).toHaveLength(BOARD_SIZE)
    expect(cols).toHaveLength(BOARD_SIZE)
  })
})

describe('applyClears', () => {
  it('empties a cleared row but leaves other cells', () => {
    let board = fillRow(createEmptyBoard(), 2)
    board[4][4] = '#abc'
    const next = applyClears(board, { rows: [2], cols: [] })
    expect(next[2].every((c) => c === null)).toBe(true)
    expect(next[4][4]).toBe('#abc')
  })

  it('clears the intersection cell only once (row + col)', () => {
    let board = fillRow(createEmptyBoard(), 0)
    board = fillCol(board, 0)
    board[4][4] = '#abc'
    const next = applyClears(board, { rows: [0], cols: [0] })
    expect(next[0].every((c) => c === null)).toBe(true)
    expect(next.every((row) => row[0] === null)).toBe(true)
    expect(next[4][4]).toBe('#abc')
  })

  it('does not mutate the original board', () => {
    const board = fillRow(createEmptyBoard(), 1)
    applyClears(board, { rows: [1], cols: [] })
    expect(board[1][0]).toBe('#fff')
  })
})

describe('clearedKeys', () => {
  it('lists every cell in the cleared row and column without duplicates', () => {
    const board = createEmptyBoard()
    const keys = clearedKeys(board, { rows: [0], cols: [0] })
    // 8 in the row + 8 in the col - 1 shared intersection = 15
    expect(keys.size).toBe(BOARD_SIZE * 2 - 1)
    expect(keys.has('0-0')).toBe(true)
    expect(keys.has('0-5')).toBe(true)
    expect(keys.has('5-0')).toBe(true)
  })
})

describe('clearCount', () => {
  it('sums rows and columns', () => {
    expect(clearCount({ rows: [1, 2], cols: [3] })).toBe(3)
    expect(clearCount({ rows: [], cols: [] })).toBe(0)
  })
})
