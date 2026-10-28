import { useCallback, useEffect, useRef, useState } from 'react'
import Board from './components/Board.jsx'
import PieceTray from './components/PieceTray.jsx'
import DragGhost from './components/DragGhost.jsx'
import { createEmptyBoard } from './constants.js'
import { generateTray } from './shapes.js'
import { placePiece, findClears, applyClears, clearedKeys, clearCount } from './game.js'
import useDragPlacement from './useDragPlacement.js'

const CLEAR_ANIMATION_MS = 220

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard)
  const [tray, setTray] = useState(() => generateTray())
  const [clearing, setClearing] = useState(null) // Set of "r-c" cells animating out
  const [locked, setLocked] = useState(false) // input disabled during clear animation

  // Keep a live ref to the board so drag validity checks never go stale.
  const boardRef = useRef(board)
  useEffect(() => {
    boardRef.current = board
  }, [board])

  // Commit a valid drop: fill the board and consume the tray slot. If the
  // placement completes any lines, flash them, then clear after a short delay.
  const handlePlace = useCallback((slotIndex, row, col, piece) => {
    const placed = placePiece(boardRef.current, piece.cells, row, col, piece.color)
    setBoard(placed)
    setTray((prev) => {
      const next = prev.slice()
      next[slotIndex] = null
      return next.every((p) => p === null) ? generateTray() : next
    })

    const clears = findClears(placed)
    if (clearCount(clears) > 0) {
      setClearing(clearedKeys(placed, clears))
      setLocked(true)
      setTimeout(() => {
        setBoard(applyClears(placed, clears))
        setClearing(null)
        setLocked(false)
      }, CLEAR_ANIMATION_MS)
    }
  }, [])

  const { drag, preview, startDrag } = useDragPlacement(boardRef, handlePlace)

  // Dev-only hook so automated tests can seed a precise board/tray.
  // import.meta.env.DEV is false in production builds, so this is stripped out.
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__bptest = { setBoard, setTray, getBoard: () => boardRef.current }
    }
  }, [])

  // Ignore drag starts while a clear animation is playing.
  const handlePointerDown = useCallback(
    (piece, slotIndex, e) => {
      if (locked) return
      startDrag(piece, slotIndex, e)
    },
    [locked, startDrag],
  )

  const newGame = () => {
    setBoard(createEmptyBoard())
    setTray(generateTray())
    setClearing(null)
    setLocked(false)
  }

  return (
    <div className="app">
      <h1 className="title">Block Puzzle</h1>
      <Board board={board} preview={preview} clearing={clearing} />
      <PieceTray
        pieces={tray}
        draggingUid={drag?.piece.uid}
        onPiecePointerDown={handlePointerDown}
      />
      <button className="btn" onClick={newGame}>
        New game
      </button>
      <DragGhost drag={drag} />
    </div>
  )
}
