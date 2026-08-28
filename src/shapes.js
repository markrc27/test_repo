// Fixed-orientation Block Puzzle piece catalog.
//
// Each shape is a plain object: { id, color, cells }
// `cells` is an array of [row, col] offsets, normalized so the top-left of the
// shape's bounding box is at [0, 0]. Pieces are NOT rotated in play, so every
// orientation we want is listed explicitly here.

// Normalize a list of [row, col] cells so the minimum row and column are 0.
export function normalize(cells) {
  const minR = Math.min(...cells.map(([r]) => r))
  const minC = Math.min(...cells.map(([, c]) => c))
  return cells.map(([r, c]) => [r - minR, c - minC])
}

// Bounding-box dimensions of a shape's cells.
export function shapeSize(cells) {
  const rows = Math.max(...cells.map(([r]) => r)) + 1
  const cols = Math.max(...cells.map(([, c]) => c)) + 1
  return { rows, cols }
}

// Build a straight line of `len` cells, horizontal or vertical.
function line(len, vertical) {
  return Array.from({ length: len }, (_, i) => (vertical ? [i, 0] : [0, i]))
}

// Build a filled rectangle of the given dimensions.
function rect(rows, cols) {
  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push([r, c])
  }
  return cells
}

// Piece colors, chosen to be distinct and readable on the dark board.
const COLORS = {
  single: '#f4d03f',
  line: '#4fc3f7',
  square: '#66bb6a',
  bigSquare: '#26a69a',
  cornerS: '#ff7043',
  cornerL: '#ab47bc',
  tee: '#ec407a',
  ess: '#7e57c2',
}

// Raw shape definitions. Cells are hand-written per orientation, then
// normalized when the catalog is assembled below.
const RAW = [
  // Single cell
  { id: 'single', color: COLORS.single, cells: [[0, 0]] },

  // Horizontal lines
  { id: 'h2', color: COLORS.line, cells: line(2, false) },
  { id: 'h3', color: COLORS.line, cells: line(3, false) },
  { id: 'h4', color: COLORS.line, cells: line(4, false) },
  { id: 'h5', color: COLORS.line, cells: line(5, false) },

  // Vertical lines
  { id: 'v2', color: COLORS.line, cells: line(2, true) },
  { id: 'v3', color: COLORS.line, cells: line(3, true) },
  { id: 'v4', color: COLORS.line, cells: line(4, true) },
  { id: 'v5', color: COLORS.line, cells: line(5, true) },

  // Squares
  { id: 'sq2', color: COLORS.square, cells: rect(2, 2) },
  { id: 'sq3', color: COLORS.bigSquare, cells: rect(3, 3) },

  // Small corner (3 cells / 2x2 minus one), all 4 orientations
  { id: 'corner3-tl', color: COLORS.cornerS, cells: [[0, 0], [0, 1], [1, 0]] },
  { id: 'corner3-tr', color: COLORS.cornerS, cells: [[0, 0], [0, 1], [1, 1]] },
  { id: 'corner3-br', color: COLORS.cornerS, cells: [[0, 1], [1, 0], [1, 1]] },
  { id: 'corner3-bl', color: COLORS.cornerS, cells: [[0, 0], [1, 0], [1, 1]] },

  // Big L (5 cells, 3x3 corner), all 4 orientations
  { id: 'L5-tl', color: COLORS.cornerL, cells: [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]] },
  { id: 'L5-tr', color: COLORS.cornerL, cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] },
  { id: 'L5-br', color: COLORS.cornerL, cells: [[0, 2], [1, 2], [2, 2], [2, 1], [2, 0]] },
  { id: 'L5-bl', color: COLORS.cornerL, cells: [[2, 0], [1, 0], [0, 0], [2, 1], [2, 2]] },

  // T-piece (4 cells), all 4 orientations
  { id: 'tee-up', color: COLORS.tee, cells: [[0, 0], [0, 1], [0, 2], [1, 1]] },
  { id: 'tee-down', color: COLORS.tee, cells: [[1, 0], [1, 1], [1, 2], [0, 1]] },
  { id: 'tee-left', color: COLORS.tee, cells: [[0, 1], [1, 1], [2, 1], [1, 0]] },
  { id: 'tee-right', color: COLORS.tee, cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },

  // S and Z pieces, horizontal and vertical
  { id: 's-h', color: COLORS.ess, cells: [[1, 0], [1, 1], [0, 1], [0, 2]] },
  { id: 's-v', color: COLORS.ess, cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { id: 'z-h', color: COLORS.ess, cells: [[0, 0], [0, 1], [1, 1], [1, 2]] },
  { id: 'z-v', color: COLORS.ess, cells: [[0, 1], [1, 1], [1, 0], [2, 0]] },
]

// The finished catalog, with every shape's cells normalized.
export const SHAPES = RAW.map((s) => ({ ...s, cells: normalize(s.cells) }))

// A fresh random-source seam so tests can be deterministic if needed.
export function generatePiece(rng = Math.random) {
  const shape = SHAPES[Math.floor(rng() * SHAPES.length)]
  // Return a shallow clone with a unique instance id for React keys / tray state.
  return {
    ...shape,
    cells: shape.cells.map((cell) => [...cell]),
    uid: `${shape.id}-${Math.random().toString(36).slice(2, 9)}`,
  }
}

// Generate a tray of `count` pieces (classic Block Puzzle offers 3 at a time).
export function generateTray(count = 3, rng = Math.random) {
  return Array.from({ length: count }, () => generatePiece(rng))
}
