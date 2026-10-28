import { shapeSize } from '../shapes.js'

// The floating piece that follows the pointer during a drag.
// Rendered at board scale (cellSize/gap from the live board geometry).
export default function DragGhost({ drag }) {
  if (!drag) return null
  const { piece, ghost } = drag
  const { rows, cols } = shapeSize(piece.cells)
  const filled = new Set(piece.cells.map(([r, c]) => `${r}-${c}`))

  return (
    <div
      className="ghost"
      style={{ left: `${ghost.x}px`, top: `${ghost.y}px` }}
    >
      <div
        className="ghost-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${ghost.cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${ghost.cellSize}px)`,
          gap: `${ghost.gap}px`,
        }}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          const on = filled.has(`${r}-${c}`)
          return (
            <div
              key={i}
              className={`ghost-cell${on ? ' ghost-cell--on' : ''}`}
              style={on ? { backgroundColor: piece.color } : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
