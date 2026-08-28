import Cell from './Cell.jsx'

// Renders the game board as a CSS grid of cells.
export default function Board({ board }) {
  return (
    <div
      className="board"
      style={{ '--board-size': board.length }}
    >
      {board.map((row, r) =>
        row.map((color, c) => <Cell key={`${r}-${c}`} color={color} />),
      )}
    </div>
  )
}
