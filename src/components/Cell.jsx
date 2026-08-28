// A single board cell. `color` is null for empty, or a CSS color for filled.
export default function Cell({ color }) {
  return (
    <div
      className={`cell${color ? ' cell--filled' : ''}`}
      style={color ? { backgroundColor: color } : undefined}
    />
  )
}
