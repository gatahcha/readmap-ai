"use client"

import type React from "react"

import type { BookNode } from "@/book/bookNode"
import { Star, Hash, Trash2 } from "lucide-react"
import Image from "next/image"

interface PositionedNode {
  id: string
  book: BookNode
  x: number
  y: number
  level: number
  parent?: string
  children: string[]
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
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(node.id)
  }

  return (
    <div
      className={`absolute rounded-lg shadow-md w-[220px] p-3 transition-all duration-300 select-none cursor-pointer ${
        isSelected
          ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white border-2 border-orange-600 shadow-lg scale-105"
          : isHovered
            ? "bg-gradient-to-br from-orange-300 to-orange-400 text-white border-2 border-orange-500 shadow-lg scale-105"
            : "bg-gradient-to-br from-orange-100 to-orange-200 text-gray-800 border border-orange-300 hover:from-orange-200 hover:to-orange-300"
      }`}
      style={{
        left: `${node.x - 110}px`,
        top: `${node.y - 40}px`,
        zIndex: isSelected || isHovered ? 20 : 10,
      }}
      onClick={() => onSelect(node.book)}
      onMouseEnter={() => onHover(node.book)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        className={`absolute top-1 right-1 p-1 rounded-full ${
          isSelected || isHovered ? "bg-white/20 hover:bg-white/40" : "bg-white/60 hover:bg-white/80"
        } transition-colors`}
        onClick={handleDeleteClick}
        aria-label="Delete node"
      >
        <Trash2 className={`h-3.5 w-3.5 ${isSelected || isHovered ? "text-white" : "text-gray-700"}`} />
      </button>

      <div className="flex gap-3">
        <Image
          src={node.book.thumbnail || "/placeholder.svg?height=96&width=64"}
          alt={node.book.title}
          width={64}
          height={96}
          className="w-16 h-24 object-cover rounded shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-sm line-clamp-2 leading-tight ${
              isSelected || isHovered ? "text-white" : "text-gray-900"
            }`}
          >
            {node.book.title}
          </h3>
          <p className={`text-xs mt-1 truncate ${isSelected || isHovered ? "text-orange-100" : "text-gray-600"}`}>
            {node.book.author}
          </p>
          <div
            className={`flex items-center mt-2 text-xs ${
              isSelected || isHovered ? "text-orange-100" : "text-gray-700"
            }`}
          >
            <Star
              className={`h-3 w-3 mr-1 flex-shrink-0 ${
                isSelected || isHovered ? "text-yellow-200" : "text-orange-400"
              }`}
            />
            <span>{node.book.average_rating}</span>
            <span className="mx-1">•</span>
            <Hash className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{node.book.num_pages} pg</span>
          </div>
          <div className="mt-1">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isSelected || isHovered ? "bg-white/20 text-white" : "bg-white/60 text-gray-700"
              }`}
            >
              {node.book.categories.split(",")[0].trim()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
