// A single board cell.
// - `color`: null for empty, or a CSS color for a filled (locked-in) cell.
// - `preview`: 'valid' | 'invalid' | null — highlight while a piece hovers here.
// - `previewColor`: tint to show for a valid preview.
export default function Cell({ row, col, color, preview, previewColor, clearing }) {
  const classes = ['cell']
  if (color) classes.push('cell--filled')
  if (preview === 'valid') classes.push('cell--preview-valid')
  if (preview === 'invalid') classes.push('cell--preview-invalid')
  if (clearing) classes.push('cell--clearing')

  let style
  if (color) style = { backgroundColor: color }
  else if (preview === 'valid') style = { backgroundColor: previewColor }

  return (
    <div className={classes.join(' ')} style={style} data-row={row} data-col={col} />
  )
}
