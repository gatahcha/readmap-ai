"use client"

// src/components/sections/RoadmapSection.tsx
import { useState } from "react"
import { BookNode } from "@/book/bookNode"
import { RoadmapTree } from "@/components/roadmap_components/RoadmapTree"
import { BookDetailPanel } from "@/components/roadmap_components/BookDetailPanel"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RoadmapSectionProps {
  books: BookNode[]
}

export function RoadmapSection({ books: initialBooks }: RoadmapSectionProps) {
  const [books, setBooks] = useState<BookNode[]>(initialBooks)
  const [selectedBook, setSelectedBook] = useState<BookNode | null>(null)
  const [showPanelOnLeft, setShowPanelOnLeft] = useState(false)

  const handleBookSelect = (book: BookNode | null, clickEvent?: React.MouseEvent) => {
    setSelectedBook(book)
    
    // Determine panel position based on where the book node was clicked
    if (book && clickEvent) {
      const rect = (clickEvent.currentTarget as HTMLElement).getBoundingClientRect()
      const nodeX = rect.left + rect.width / 2
      const screenWidth = window.innerWidth
      
      // If node is on the right side of screen, show panel on left
      const isNodeOnRightSide = nodeX > screenWidth / 2
      setShowPanelOnLeft(isNodeOnRightSide)
    }
  }

  const handleClosePanel = () => {
    setSelectedBook(null)
  }

  const handleClearRoadmap = () => {
    setBooks([])
    setSelectedBook(null)
  }

  const handleDeleteNode = (bookId: string) => {
    // Filter by the string id, not isbn13
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId))
    // Close panel if the deleted book was selected
    if (selectedBook?.id === bookId) {
      setSelectedBook(null)
    }
  }

  return (
    <div className="relative">
      {books.length > 0 ? (
        <RoadmapTree
          books={books}
          onBookSelect={handleBookSelect}
          selectedBook={selectedBook}
          onDeleteNode={handleDeleteNode}
          onClearRoadmap={handleClearRoadmap}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4 text-gray-300">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Roadmap Yet</h3>
          <p className="text-gray-500">Search for a topic to generate your learning roadmap</p>
        </div>
      )}

      <BookDetailPanel
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={handleClosePanel}
        showOnLeft={showPanelOnLeft}
      />
    </div>
  )
}