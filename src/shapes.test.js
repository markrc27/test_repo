import { describe, it, expect } from 'vitest'
import {
  SHAPES,
  normalize,
  shapeSize,
  generatePiece,
  generateTray,
} from './shapes.js'
import { BOARD_SIZE } from './constants.js'

describe('normalize', () => {
  it('shifts cells so min row and col are 0', () => {
    expect(normalize([[2, 3], [2, 4], [3, 3]])).toEqual([[0, 0], [0, 1], [1, 0]])
  })
})

describe('shapeSize', () => {
  it('reports bounding-box dimensions', () => {
    expect(shapeSize([[0, 0], [0, 1], [1, 0]])).toEqual({ rows: 2, cols: 2 })
  })
})

describe('SHAPES catalog', () => {
  it('has a reasonable number of pieces', () => {
    expect(SHAPES.length).toBeGreaterThanOrEqual(20)
  })

  it('every shape has a unique id, a color, and at least one cell', () => {
    const ids = new Set()
    for (const s of SHAPES) {
      expect(s.id).toBeTruthy()
      expect(ids.has(s.id)).toBe(false)
      ids.add(s.id)
      expect(s.color).toMatch(/^#/)
      expect(s.cells.length).toBeGreaterThan(0)
    }
  })

  it('every shape is normalized and fits within the board', () => {
    for (const s of SHAPES) {
      const minR = Math.min(...s.cells.map(([r]) => r))
      const minC = Math.min(...s.cells.map(([, c]) => c))
      expect(minR).toBe(0)
      expect(minC).toBe(0)
      const { rows, cols } = shapeSize(s.cells)
      expect(rows).toBeLessThanOrEqual(BOARD_SIZE)
      expect(cols).toBeLessThanOrEqual(BOARD_SIZE)
    }
  })

  it('has no duplicate cells within a shape', () => {
    for (const s of SHAPES) {
      const keys = s.cells.map(([r, c]) => `${r}-${c}`)
      expect(new Set(keys).size).toBe(keys.length)
    }
  })
})

describe('generatePiece', () => {
  it('returns a valid catalog shape with a unique instance id', () => {
    const p = generatePiece(() => 0)
    expect(p.id).toBe(SHAPES[0].id)
    expect(p.uid).toContain(SHAPES[0].id)
    expect(p.cells).toEqual(SHAPES[0].cells)
  })

  it('picks the last shape when rng approaches 1', () => {
    const p = generatePiece(() => 0.999999)
    expect(p.id).toBe(SHAPES[SHAPES.length - 1].id)
  })

  it('returns an independent cell copy (mutation safe)', () => {
    const p = generatePiece(() => 0)
    p.cells[0][0] = 99
    expect(SHAPES[0].cells[0][0]).toBe(0)
  })
})

describe('generateTray', () => {
  it('returns three pieces by default with distinct uids', () => {
    const tray = generateTray()
    expect(tray).toHaveLength(3)
    expect(new Set(tray.map((p) => p.uid)).size).toBe(3)
  })
})
