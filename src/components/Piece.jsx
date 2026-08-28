import { shapeSize } from '../shapes.js'

// Renders a single piece as a small grid matching its bounding box.
// `used` dims the piece once it has been placed.
export default function Piece({ piece, used = false }) {
  const { rows, cols } = shapeSize(piece.cells)
  const filled = new Set(piece.cells.map(([r, c]) => `${r}-${c}`))

  return (
    <div className={`piece${used ? ' piece--used' : ''}`}>
      <div
        className="piece-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, var(--tray-cell))`,
          gridTemplateRows: `repeat(${rows}, var(--tray-cell))`,
        }}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          const on = filled.has(`${r}-${c}`)
          return (
            <div
              key={i}
              className={`piece-cell${on ? ' piece-cell--on' : ''}`}
              style={on ? { backgroundColor: piece.color } : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
