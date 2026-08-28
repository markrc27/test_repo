import { useState } from 'react'
import Board from './components/Board.jsx'
import PieceTray from './components/PieceTray.jsx'
import { createEmptyBoard } from './constants.js'
import { generateTray } from './shapes.js'

export default function App() {
  const [board] = useState(createEmptyBoard)
  const [tray, setTray] = useState(() => generateTray())

  return (
    <div className="app">
      <h1 className="title">Block Puzzle</h1>
      <Board board={board} />
      <PieceTray pieces={tray} />
      <button className="btn" onClick={() => setTray(generateTray())}>
        New pieces
      </button>
    </div>
  )
}
