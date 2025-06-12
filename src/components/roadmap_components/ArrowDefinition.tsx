export function ArrowDefinitions() {
  return (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="12"
        markerHeight="8"
        refX="10"
        refY="4"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0,0 L0,8 L12,4 z" fill="rgb(156, 163, 175)" />
      </marker>
      <marker
        id="arrowhead-highlighted"
        markerWidth="12"
        markerHeight="8"
        refX="10"
        refY="4"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0,0 L0,8 L12,4 z" fill="rgb(249, 115, 22)" />
      </marker>
    </defs>
  )
}