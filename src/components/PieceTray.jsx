import Piece from './Piece.jsx'

// The tray of currently available pieces below the board.
// `pieces` is an array where a slot may be null once its piece is placed.
export default function PieceTray({ pieces }) {
  return (
    <div className="tray">
      {pieces.map((piece, i) => (
        <div className="tray-slot" key={piece ? piece.uid : `empty-${i}`}>
          {piece ? <Piece piece={piece} /> : null}
        </div>
      ))}
    </div>
  )
}
