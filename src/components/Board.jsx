import Cell from './Cell.jsx'

// Renders the game board as a CSS grid of cells.
// `preview` (optional): { keys: Set<"r-c">, valid: boolean, color: string }
// describes the cells a hovered piece would occupy.
export default function Board({ board, preview, clearing }) {
  return (
    <div className="board" style={{ '--board-size': board.length }}>
      {board.map((row, r) =>
        row.map((color, c) => {
          const key = `${r}-${c}`
          const inPreview = preview && preview.keys.has(key)
          return (
            <Cell
              key={key}
              row={r}
              col={c}
              color={color}
              preview={inPreview ? (preview.valid ? 'valid' : 'invalid') : null}
              previewColor={preview?.color}
              clearing={clearing ? clearing.has(key) : false}
            />
          )
        }),
      )}
    </div>
  )
}
