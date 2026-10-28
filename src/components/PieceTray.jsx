import Piece from './Piece.jsx'

// The tray of currently available pieces below the board.
// `pieces` is an array where a slot is null once its piece has been placed.
// `draggingUid` is the uid of the piece currently being dragged (hidden here).
// `onPiecePointerDown(piece, slotIndex, event)` starts a drag.
export default function PieceTray({ pieces, draggingUid, onPiecePointerDown }) {
  return (
    <div className="tray">
      {pieces.map((piece, i) => (
        <div className="tray-slot" key={piece ? piece.uid : `empty-${i}`}>
          {piece && piece.uid !== draggingUid ? (
            <Piece
              piece={piece}
              onPointerDown={(e) => onPiecePointerDown(piece, i, e)}
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}
