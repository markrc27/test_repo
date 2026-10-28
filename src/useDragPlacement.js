import { useCallback, useRef, useState } from 'react'
import { canPlace } from './game.js'

// Measure the board's real on-screen geometry from two adjacent cells.
// Returns null if the board isn't mounted yet.
function measureBoard() {
  const c00 = document.querySelector('[data-row="0"][data-col="0"]')
  const c01 = document.querySelector('[data-row="0"][data-col="1"]')
  if (!c00 || !c01) return null
  const r00 = c00.getBoundingClientRect()
  const r01 = c01.getBoundingClientRect()
  const cellSize = r00.width
  const stride = r01.left - r00.left // cell size + gap
  return { cellSize, stride, gap: stride - cellSize }
}

// Pointer-based drag placement that works for mouse and touch.
//
// `boardRef` - ref to the current board (for live validity checks).
// `onPlace(slotIndex, row, col, piece)` - called on a valid drop.
//
// Returns { drag, preview, startDrag }:
//   drag    - { piece, ghost: {x, y, cellSize, gap} } | null  (floating piece)
//   preview - { keys: Set, valid, color } | null              (board highlight)
//   startDrag(piece, slotIndex, event)
export default function useDragPlacement(boardRef, onPlace) {
  const [drag, setDrag] = useState(null)
  const [preview, setPreview] = useState(null)
  const info = useRef(null) // mutable drag context, avoids stale closures

  const endDrag = useCallback(() => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    info.current = null
    setDrag(null)
    setPreview(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recompute preview + ghost position for a pointer location.
  const update = useCallback(
    (clientX, clientY) => {
      const ctx = info.current
      if (!ctx) return
      const { piece, grab, geom, lift } = ctx

      const sampleX = clientX
      const sampleY = clientY - lift

      // Which board cell is under the (lifted) sample point?
      const el = document.elementFromPoint(sampleX, sampleY)
      const cellEl = el && el.closest ? el.closest('[data-row]') : null

      let nextPreview = null
      if (cellEl) {
        const pointerRow = Number(cellEl.dataset.row)
        const pointerCol = Number(cellEl.dataset.col)
        const originRow = pointerRow - grab[0]
        const originCol = pointerCol - grab[1]
        const valid = canPlace(boardRef.current, piece.cells, originRow, originCol)
        const keys = new Set(
          piece.cells.map(([dr, dc]) => `${originRow + dr}-${originCol + dc}`),
        )
        nextPreview = { keys, valid, color: piece.color, originRow, originCol }
      }
      ctx.lastPreview = nextPreview
      setPreview(nextPreview)

      // Position the ghost so the grabbed cell sits under the sample point.
      const ghostX = sampleX - grab[1] * geom.stride - geom.cellSize / 2
      const ghostY = sampleY - grab[0] * geom.stride - geom.cellSize / 2
      setDrag({
        piece,
        ghost: { x: ghostX, y: ghostY, cellSize: geom.cellSize, gap: geom.gap },
      })
    },
    [boardRef],
  )

  function onMove(e) {
    e.preventDefault()
    update(e.clientX, e.clientY)
  }

  function onUp() {
    const ctx = info.current
    const pv = ctx && ctx.lastPreview
    if (ctx && pv && pv.valid) {
      onPlace(ctx.slotIndex, pv.originRow, pv.originCol, ctx.piece)
    }
    endDrag()
  }

  const startDrag = useCallback(
    (piece, slotIndex, e) => {
      e.preventDefault()
      const geom = measureBoard()
      if (!geom) return

      // Which filled cell of the piece did the pointer grab?
      const target = document.elementFromPoint(e.clientX, e.clientY)
      const pcEl = target && target.closest ? target.closest('[data-pr]') : null
      const grab = pcEl
        ? [Number(pcEl.dataset.pr), Number(pcEl.dataset.pc)]
        : piece.cells[0]

      const lift = e.pointerType === 'touch' ? geom.stride * 2.5 : 0

      info.current = { piece, slotIndex, grab, geom, lift, lastPreview: null }
      window.addEventListener('pointermove', onMove, { passive: false })
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
      update(e.clientX, e.clientY)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [update],
  )

  return { drag, preview, startDrag }
}
