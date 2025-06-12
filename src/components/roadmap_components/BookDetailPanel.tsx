"use client"

import type { BookNode } from "@/book/bookNode"
import { Button } from "@/components/ui/button"
import { X, Star } from "lucide-react"
import Image from "next/image"

declare global {
  interface Window {
    bookRegistry?: BookNode[]
  }
}

interface BookDetailPanelProps {
  book: BookNode | null
  isOpen: boolean
  onClose: () => void
}

export function BookDetailPanel({ book, isOpen, onClose }: BookDetailPanelProps) {
  if (!isOpen || !book) return null

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 pr-4">{book.title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Book Cover */}
        <div className="mb-6">
          <Image
            src={book.thumbnail || "/placeholder.svg?height=200&width=150"}
            alt={book.title}
            width={150}
            height={200}
            className="rounded-lg shadow-md mx-auto"
          />
        </div>

        {/* Book Info */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900">Author</h3>
            <p className="text-gray-700">{book.author}</p>
          </div>

          {book.subtitle && (
            <div>
              <h3 className="font-semibold text-gray-900">Subtitle</h3>
              <p className="text-gray-700">{book.subtitle}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900">Categories</h3>
            <p className="text-gray-700">{book.categories}</p>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Rating</h3>
              <div className="flex items-center gap-1">
                {renderStars(book.average_rating)}
                <span className="text-sm text-gray-600 ml-1">({book.average_rating.toFixed(1)})</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pages</h3>
              <p className="text-gray-700">{book.num_pages}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Published</h3>
            <p className="text-gray-700">{book.published_year}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">ISBN</h3>
            <p className="text-gray-700 text-sm">
              ISBN-13: {book.isbn13}
              <br />
              ISBN-10: {book.isbn10}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed text-sm">{book.description}</p>
        </div>

        {/* Prerequisites */}
        {book.prerequisites.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Prerequisites</h3>
            <div className="space-y-1">
              {book.prerequisites.map((prereqISBN13) => {
                // Find the book title for this ISBN13
                const prereqBook = window.bookRegistry?.find((b: BookNode) => b.isbn13 === prereqISBN13)
                return (
                  <div key={prereqISBN13} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {prereqBook ? prereqBook.title : `ISBN-13: ${prereqISBN13}`}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
