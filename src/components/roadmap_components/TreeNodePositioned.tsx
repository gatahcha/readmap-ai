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
  onSelect: (book: BookNode, clickEvent?: React.MouseEvent) => void
  isSelected: boolean
  isHovered: boolean
  onHover: (book: BookNode | null) => void
  onDelete: (bookId: string) => void
  isMobile?: boolean
}

export function TreeNodePositioned({
  node,
  onSelect,
  isSelected,
  isHovered,
  onHover,
  onDelete,
  isMobile = false,
}: TreeNodePositionedProps) {
  const [imageError, setImageError] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete(node.id)
  }

  const handleNodeClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    onSelect(node.book, e as React.MouseEvent)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Mobile-responsive dimensions and styling
  const width = node.width
  const height = node.height

  // Mobile-optimized image dimensions
  const showImage = !isMobile || width > 140 // Reduced threshold from 160
  const imgWidth = showImage ? Math.min(isMobile ? 40 : 64, width * 0.25) : 0 // Reduced mobile from 48
  const imgHeight = showImage ? Math.min(isMobile ? 60 : 96, height * 0.8) : 0 // Reduced mobile from 72

  // Mobile-responsive font sizes - more aggressive scaling
  const titleFontSize = Math.max(
    isMobile ? 10 : 12, // Reduced mobile minimum from 11
    Math.min(isMobile ? 12 : 15, width / (isMobile ? 12 : 18)) // Improved scaling
  )
  const authorFontSize = Math.max(
    isMobile ? 8 : 10, // Reduced mobile minimum from 9
    Math.min(isMobile ? 10 : 12, width / (isMobile ? 18 : 22))
  )
  const metaFontSize = Math.max(
    isMobile ? 7 : 9, // Reduced mobile minimum from 8
    Math.min(isMobile ? 9 : 11, width / (isMobile ? 20 : 25))
  )

  // Mobile-responsive padding - more compact
  const padding = Math.max(isMobile ? 4 : 8, Math.min(isMobile ? 8 : 14, width / 22)) // Reduced mobile padding

  // Calculate available width for text content
  const trashButtonWidth = Math.max(isMobile ? 8 : 12, Math.min(isMobile ? 12 : 16, width / 20)) + Math.max(3, padding / 4) * 2 + (isMobile ? 4 : 8) // Reduced mobile sizing
  const imageAreaWidth = showImage ? imgWidth + (isMobile ? 4 : 8) : 0 // Reduced mobile gap
  const availableTextWidth = width - padding * 2 - imageAreaWidth - trashButtonWidth

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      // Prevent default to avoid scroll on touch
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isMobile) {
      e.preventDefault()
      handleNodeClick(e)
    }
  }

  return (
    <div
      className={`absolute rounded-lg shadow-md transition-all duration-300 select-none cursor-pointer overflow-hidden ${
        isSelected
          ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white border-2 border-orange-600 shadow-lg scale-105"
          : isHovered
            ? "bg-gradient-to-br from-orange-300 to-orange-400 text-white border-2 border-orange-500 shadow-lg scale-105"
            : "bg-gradient-to-br from-orange-100 to-orange-200 text-gray-800 border border-orange-300 hover:from-orange-200 hover:to-orange-300"
      } ${isMobile ? 'touch-manipulation' : ''}`}
      style={{
        left: `${node.x - width / 2}px`,
        top: `${node.y - height / 2}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: isSelected || isHovered ? 20 : 10,
        padding: `${padding}px`,
        // Mobile-specific touch optimizations
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
      onClick={!isMobile ? handleNodeClick : undefined}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onMouseEnter={!isMobile ? () => onHover(node.book) : undefined}
      onMouseLeave={!isMobile ? () => onHover(null) : undefined}
    >
      <button
        className={`absolute top-1 right-1 rounded-full transition-colors z-10 ${
          isSelected || isHovered ? "bg-white/20 hover:bg-white/40" : "bg-white/60 hover:bg-white/80"
        } ${isMobile ? 'touch-manipulation' : ''}`}
        style={{
          padding: `${Math.max(isMobile ? 3 : 4, padding / 4)}px`,
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
        onClick={!isMobile ? handleDeleteClick : undefined}
        onTouchEnd={isMobile ? handleDeleteClick : undefined}
        aria-label="Delete node"
      >
        <Trash2
          className={`${isSelected || isHovered ? "text-white" : "text-gray-700"}`}
          style={{
            width: `${Math.max(isMobile ? 10 : 12, Math.min(isMobile ? 14 : 16, width / 20))}px`,
            height: `${Math.max(isMobile ? 10 : 12, Math.min(isMobile ? 14 : 16, width / 20))}px`,
          }}
        />
      </button>

      <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'} h-full overflow-hidden`}>
        {showImage && (
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
                  style={{ fontSize: `${Math.max(8, metaFontSize - 1)}px` }}
                >
                  {isMobile ? "📚" : "No Image"}
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
                lineHeight: isMobile ? '1.0' : '1.1',
                display: '-webkit-box',
                WebkitLineClamp: height > (isMobile ? 70 : 90) ? 2 : 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}
            >
              {node.book.title}
            </h3>
            {height > (isMobile ? 45 : 55) && (
              <p
                className={`mt-1 break-words ${isSelected || isHovered ? "text-orange-100" : "text-gray-600"}`}
                style={{ 
                  fontSize: `${authorFontSize}px`,
                  lineHeight: isMobile ? '1.0' : '1.1',
                  display: '-webkit-box',
                  WebkitLineClamp: height > (isMobile ? 60 : 80) ? 2 : 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-word'
                }}
              >
                {node.book.author}
              </p>
            )}
          </div>

          {height > (isMobile ? 55 : 65) && width > (isMobile ? 120 : 150) && (
            <div className="flex flex-col gap-1 overflow-hidden mt-1">
              <div
                className={`flex items-center flex-wrap gap-1 ${isSelected || isHovered ? "text-orange-100" : "text-gray-700"}`}
                style={{ fontSize: `${metaFontSize}px`, lineHeight: isMobile ? '1.0' : '1.1' }}
              >
                <div className="flex items-center flex-shrink-0">
                  <Star
                    className={`mr-0.5 flex-shrink-0 ${isSelected || isHovered ? "text-yellow-200" : "text-orange-400"}`}
                    style={{ width: `${metaFontSize + 1}px`, height: `${metaFontSize + 1}px` }}
                  />
                  <span className="truncate">{node.book.average_rating.toFixed(1)}</span>
                </div>
                {!isMobile && (
                  <>
                    <span className="mx-0.5 flex-shrink-0">•</span>
                    <div className="flex items-center flex-shrink-0">
                      <Hash
                        className="mr-0.5 flex-shrink-0"
                        style={{ width: `${metaFontSize + 1}px`, height: `${metaFontSize + 1}px` }}
                      />
                      <span className="truncate">{node.book.num_pages} pg</span>
                    </div>
                  </>
                )}
              </div>

              {width > (isMobile ? 140 : 170) && height > (isMobile ? 70 : 85) && (
                <div className="overflow-hidden">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-xs truncate max-w-full ${
                      isSelected || isHovered ? "bg-white/20 text-white" : "bg-white/60 text-gray-700"
                    }`}
                    style={{ fontSize: `${Math.max(isMobile ? 7 : 8, metaFontSize - 1)}px` }}
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