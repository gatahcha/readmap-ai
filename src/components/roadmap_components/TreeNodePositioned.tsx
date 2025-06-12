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
  onSelect: (book: BookNode) => void
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

  const handleImageError = () => {
    setImageError(true)
  }

  // Calculate responsive dimensions and styling
  const width = node.width
  const height = node.height

  // Calculate image dimensions based on node size
  const imgWidth = Math.min(64, width * 0.25)
  const imgHeight = Math.min(96, height * 0.8)

  // Calculate font sizes based on node size
  const titleFontSize = Math.max(10, Math.min(16, width / 18))
  const authorFontSize = Math.max(8, Math.min(12, width / 22))
  const metaFontSize = Math.max(7, Math.min(10, width / 25))

  // Calculate padding based on node size
  const padding = Math.max(8, Math.min(16, width / 20))

  return (
    <div
      className={`absolute rounded-lg shadow-md transition-all duration-300 select-none cursor-pointer ${
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
      onClick={() => onSelect(node.book)}
      onMouseEnter={() => onHover(node.book)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        className={`absolute top-1 right-1 rounded-full transition-colors ${
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

      <div className="flex gap-2 h-full">
        {width > 140 && (
          <div style={{ width: `${imgWidth}px`, minWidth: `${imgWidth}px` }}>
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
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3
              className={`font-medium line-clamp-2 leading-tight ${
                isSelected || isHovered ? "text-white" : "text-gray-900"
              }`}
              style={{ fontSize: `${titleFontSize}px` }}
            >
              {node.book.title}
            </h3>
            {height > 70 && (
              <p
                className={`truncate mt-1 ${isSelected || isHovered ? "text-orange-100" : "text-gray-600"}`}
                style={{ fontSize: `${authorFontSize}px` }}
              >
                {node.book.author}
              </p>
            )}
          </div>

          {height > 80 && width > 160 && (
            <>
              <div
                className={`flex items-center mt-2 ${isSelected || isHovered ? "text-orange-100" : "text-gray-700"}`}
                style={{ fontSize: `${metaFontSize}px` }}
              >
                <Star
                  className={`mr-1 flex-shrink-0 ${isSelected || isHovered ? "text-yellow-200" : "text-orange-400"}`}
                  style={{ width: `${metaFontSize + 2}px`, height: `${metaFontSize + 2}px` }}
                />
                <span>{node.book.average_rating}</span>
                <span className="mx-1">•</span>
                <Hash
                  className="mr-1 flex-shrink-0"
                  style={{ width: `${metaFontSize + 2}px`, height: `${metaFontSize + 2}px` }}
                />
                <span>{node.book.num_pages} pg</span>
              </div>

              {width > 200 && (
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      isSelected || isHovered ? "bg-white/20 text-white" : "bg-white/60 text-gray-700"
                    }`}
                    style={{ fontSize: `${metaFontSize}px` }}
                  >
                    {node.book.categories.split(",")[0].trim()}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}