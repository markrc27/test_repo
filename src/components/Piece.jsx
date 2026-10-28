import { shapeSize } from '../shapes.js'

// Renders a single piece as a small grid matching its bounding box.
// `onPointerDown` starts a drag; `used` dims an already-placed piece.
// Filled cells carry data-pr/data-pc so the drag logic can tell which part
// of the piece was grabbed.
export default function Piece({ piece, used = false, onPointerDown }) {
  const { rows, cols } = shapeSize(piece.cells)
  const filled = new Set(piece.cells.map(([r, c]) => `${r}-${c}`))

  return (
    <div
      className={`piece${used ? ' piece--used' : ''}`}
      onPointerDown={used ? undefined : onPointerDown}
    >
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
              data-pr={on ? r : undefined}
              data-pc={on ? c : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
