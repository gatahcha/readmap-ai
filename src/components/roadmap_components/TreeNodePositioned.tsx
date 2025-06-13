"use client"

import type React from "react"
import { useState } from "react"
import type { BookNode } from "@/book/bookNode"
import { Star, Hash, Trash2 } from "lucide-react"

interface PositionedNode {
  id: string
  book: BookNode
  x: number
  y: number
  level: number
  parent?: string
  children: string[]
  width: number
  height: number
}

interface TreeNodePositionedProps {
  node: PositionedNode
  onSelect: (book: BookNode, clickEvent?: React.MouseEvent) => void // Updated to include click event
  isSelected: boolean
  isHovered: boolean
  onHover: (book: BookNode | null) => void
  onDelete: (bookId: string) => void
}

export function TreeNodePositioned({
  node,
  onSelect,
  isSelected,
  isHovered,
  onHover,
  onDelete,
}: TreeNodePositionedProps) {
  const [imageError, setImageError] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(node.id)
  }

  const handleNodeClick = (e: React.MouseEvent) => {
    onSelect(node.book, e) // Pass the click event
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Calculate responsive dimensions and styling
  const width = node.width
  const height = node.height

  // Calculate image dimensions based on node size
  const imgWidth = Math.min(64, width * 0.25)
  const imgHeight = Math.min(96, height * 0.8)

  // Calculate font sizes based on node size - improved scaling
  const titleFontSize = Math.max(12, Math.min(15, width / 18))
  const authorFontSize = Math.max(10, Math.min(12, width / 22))
  const metaFontSize = Math.max(9, Math.min(11, width / 25))

  // Calculate padding based on node size - reduced for more content space
  const padding = Math.max(8, Math.min(14, width / 22))

  // Calculate available width for text content
  const trashButtonWidth = Math.max(12, Math.min(16, width / 20)) + Math.max(4, padding / 4) * 2 + 8 // icon + padding + margin
  const imageAreaWidth = width > 140 ? imgWidth + 8 : 0 // image width + gap
  const availableTextWidth = width - padding * 2 - imageAreaWidth - trashButtonWidth

  return (
    <div
      className={`absolute rounded-lg shadow-md transition-all duration-300 select-none cursor-pointer overflow-hidden ${
        isSelected
          ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white border-2 border-orange-600 shadow-lg scale-105"
          : isHovered
            ? "bg-gradient-to-br from-orange-300 to-orange-400 text-white border-2 border-orange-500 shadow-lg scale-105"
            : "bg-gradient-to-br from-orange-100 to-orange-200 text-gray-800 border border-orange-300 hover:from-orange-200 hover:to-orange-300"
      }`}
      style={{
        left: `${node.x - width / 2}px`,
        top: `${node.y - height / 2}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: isSelected || isHovered ? 20 : 10,
        padding: `${padding}px`,
      }}
      onClick={handleNodeClick} // Updated to use new handler
      onMouseEnter={() => onHover(node.book)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        className={`absolute top-1 right-1 rounded-full transition-colors z-10 ${
          isSelected || isHovered ? "bg-white/20 hover:bg-white/40" : "bg-white/60 hover:bg-white/80"
        }`}
        style={{
          padding: `${Math.max(4, padding / 4)}px`,
        }}
        onClick={handleDeleteClick}
        aria-label="Delete node"
      >
        <Trash2
          className={`${isSelected || isHovered ? "text-white" : "text-gray-700"}`}
          style={{
            width: `${Math.max(12, Math.min(16, width / 20))}px`,
            height: `${Math.max(12, Math.min(16, width / 20))}px`,
          }}
        />
      </button>

      <div className="flex gap-2 h-full overflow-hidden">
        {width > 140 && (
          <div 
            className="flex-shrink-0"
            style={{ width: `${imgWidth}px`, minWidth: `${imgWidth}px` }}
          >
            {!imageError && node.book.thumbnail ? (
              <img
                src={node.book.thumbnail}
                alt={node.book.title}
                width={imgWidth}
                height={imgHeight}
                className="object-cover rounded shadow-sm"
                style={{ maxHeight: `${imgHeight}px` }}
                onError={handleImageError}
              />
            ) : (
              <div 
                className={`flex items-center justify-center rounded shadow-sm ${
                  isSelected || isHovered ? "bg-white/20" : "bg-gray-200"
                }`}
                style={{ 
                  width: `${imgWidth}px`, 
                  height: `${imgHeight}px`,
                  maxHeight: `${imgHeight}px`
                }}
              >
                <span 
                  className={`text-xs ${
                    isSelected || isHovered ? "text-white" : "text-gray-500"
                  }`}
                >
                  No Image
                </span>
              </div>
            )}
          </div>
        )}
        <div 
          className="flex-1 min-w-0 flex flex-col justify-between overflow-hidden"
          style={{ maxWidth: `${availableTextWidth}px` }}
        >
          <div className="overflow-hidden">
            <h3
              className={`font-medium leading-tight break-words ${
                isSelected || isHovered ? "text-white" : "text-gray-900"
              }`}
              style={{ 
                fontSize: `${titleFontSize}px`,
                lineHeight: '1.1',
                display: '-webkit-box',
                WebkitLineClamp: height > 90 ? 2 : 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}
            >
              {node.book.title}
            </h3>
            {height > 55 && (
              <p
                className={`mt-1 break-words ${isSelected || isHovered ? "text-orange-100" : "text-gray-600"}`}
                style={{ 
                  fontSize: `${authorFontSize}px`,
                  lineHeight: '1.1',
                  display: '-webkit-box',
                  WebkitLineClamp: height > 80 ? 2 : 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-word'
                }}
              >
                {node.book.author}
              </p>
            )}
          </div>

          {height > 65 && width > 150 && (
            <div className="flex flex-col gap-1 overflow-hidden mt-1">
              <div
                className={`flex items-center flex-wrap gap-1 ${isSelected || isHovered ? "text-orange-100" : "text-gray-700"}`}
                style={{ fontSize: `${metaFontSize}px`, lineHeight: '1.1' }}
              >
                <div className="flex items-center flex-shrink-0">
                  <Star
                    className={`mr-0.5 flex-shrink-0 ${isSelected || isHovered ? "text-yellow-200" : "text-orange-400"}`}
                    style={{ width: `${metaFontSize + 1}px`, height: `${metaFontSize + 1}px` }}
                  />
                  <span className="truncate">{node.book.average_rating}</span>
                </div>
                <span className="mx-0.5 flex-shrink-0">•</span>
                <div className="flex items-center flex-shrink-0">
                  <Hash
                    className="mr-0.5 flex-shrink-0"
                    style={{ width: `${metaFontSize + 1}px`, height: `${metaFontSize + 1}px` }}
                  />
                  <span className="truncate">{node.book.num_pages} pg</span>
                </div>
              </div>

              {width > 170 && height > 85 && (
                <div className="overflow-hidden">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-xs truncate max-w-full ${
                      isSelected || isHovered ? "bg-white/20 text-white" : "bg-white/60 text-gray-700"
                    }`}
                    style={{ fontSize: `${Math.max(8, metaFontSize - 1)}px` }}
                  >
                    {node.book.categories.split(",")[0].trim()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}