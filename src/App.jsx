import { useState } from 'react'
import Board from './components/Board.jsx'
import { createEmptyBoard } from './constants.js'

export default function App() {
  const [board] = useState(createEmptyBoard)

  return (
    <div className="app">
      <h1 className="title">Block Puzzle</h1>
      <Board board={board} />
    </div>
  )
}
