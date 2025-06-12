"use client"

import { useCallback } from "react"
import type { BookNode } from "@/book/bookNode"

interface BookConnectionProps {
  sourceId: string
  targetId: string
  id: string
  isHighlighted: boolean
  getNodeById: (id: string) => { x: number; y: number; book: BookNode } | undefined
  onHover: (id: string | null) => void
}

export function BookConnection({ sourceId, targetId, id, isHighlighted, getNodeById, onHover }: BookConnectionProps) {
  // Generate smooth bezier connection path from middle-bottom to middle-top
  const generateConnectionPath = useCallback(() => {
    const sourceNode = getNodeById(sourceId)
    const targetNode = getNodeById(targetId)

    if (!sourceNode || !targetNode) return ""

    // Connect from middle-bottom of parent to middle-top of child
    const sourcePos = { x: sourceNode.x, y: sourceNode.y + 40 } // Middle-bottom of parent
    const targetPos = { x: targetNode.x, y: targetNode.y - 40 } // Middle-top of child

    // Calculate control points for curved path
    const dx = targetPos.x - sourcePos.x
    const dy = targetPos.y - sourcePos.y

    // More natural curve with control points at 1/3 and 2/3 of the path
    const cp1 = {
      x: sourcePos.x + dx * 0.1,
      y: sourcePos.y + dy * 0.4,
    }

    const cp2 = {
      x: targetPos.x - dx * 0.1,
      y: targetPos.y - dy * 0.4,
    }

    // Create smooth bezier curve
    return `M ${sourcePos.x} ${sourcePos.y} 
          C ${cp1.x} ${cp1.y}, 
            ${cp2.x} ${cp2.y}, 
            ${targetPos.x} ${targetPos.y}`
  }, [sourceId, targetId, getNodeById])

  const path = generateConnectionPath()

  return (
    <g onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(null)} className="pointer-events-auto">
      <path
        d={path}
        fill="none"
        stroke={isHighlighted ? "rgb(249, 115, 22)" : "rgb(156, 163, 175)"}
        strokeWidth={isHighlighted ? 3 : 2}
        className="transition-all duration-300"
        markerEnd={isHighlighted ? "url(#arrowhead-highlighted)" : "url(#arrowhead)"}
      />

      {isHighlighted && (
        <>
          <circle r="4" fill="rgb(249, 115, 22)">
            <animateMotion dur="3s" repeatCount="indefinite" path={path} />
          </circle>
          <circle r="4" fill="rgb(249, 115, 22)">
            <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path={path} />
          </circle>
        </>
      )}
    </g>
  )
}
