import { useCallback, useEffect, useRef, useState } from 'react'
import Board from './components/Board.jsx'
import PieceTray from './components/PieceTray.jsx'
import DragGhost from './components/DragGhost.jsx'
import { createEmptyBoard } from './constants.js'
import { generateTray } from './shapes.js'
import { placePiece } from './game.js'
import useDragPlacement from './useDragPlacement.js'

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard)
  const [tray, setTray] = useState(() => generateTray())

  // Keep a live ref to the board so drag validity checks never go stale.
  const boardRef = useRef(board)
  useEffect(() => {
    boardRef.current = board
  }, [board])

  // Commit a valid drop: fill the board and consume the tray slot,
  // refilling with three fresh pieces once all slots are empty.
  const handlePlace = useCallback((slotIndex, row, col, piece) => {
    setBoard((prev) => placePiece(prev, piece.cells, row, col, piece.color))
    setTray((prev) => {
      const next = prev.slice()
      next[slotIndex] = null
      return next.every((p) => p === null) ? generateTray() : next
    })
  }, [])

  const { drag, preview, startDrag } = useDragPlacement(boardRef, handlePlace)

  const newGame = () => {
    setBoard(createEmptyBoard())
    setTray(generateTray())
  }

  return (
    <div className="app">
      <h1 className="title">Block Puzzle</h1>
      <Board board={board} preview={preview} />
      <PieceTray
        pieces={tray}
        draggingUid={drag?.piece.uid}
        onPiecePointerDown={startDrag}
      />
      <button className="btn" onClick={newGame}>
        New game
      </button>
      <DragGhost drag={drag} />
    </div>
  )
}
