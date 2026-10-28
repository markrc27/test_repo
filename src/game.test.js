import { describe, it, expect } from 'vitest'
import { canPlace, placePiece, canPlaceAnywhere } from './game.js'
import { createEmptyBoard } from './constants.js'

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
