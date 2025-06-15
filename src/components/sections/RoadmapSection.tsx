// src/components/sections/RoadmapSection.tsx
"use client"

import { useState, useEffect } from "react"
import { BookNode } from "@/book/bookNode"
import { RoadmapTree } from "@/components/roadmap_components/RoadmapTree"
import { BookDetailPanel } from "@/components/roadmap_components/BookDetailPanel"

interface RoadmapSectionProps {
  books: BookNode[]
  title: string
}

export function RoadmapSection({ books: initialBooks, title }: RoadmapSectionProps) {
  const [books, setBooks] = useState<BookNode[]>(initialBooks)
  const [selectedBook, setSelectedBook] = useState<BookNode | null>(null)
  const [showPanelOnLeft, setShowPanelOnLeft] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 🔧 FIX: Sync internal state when prop changes
  useEffect(() => {
    console.log('🗺️ RoadmapSection: Prop books changed, count:', initialBooks.length)
    setBooks(initialBooks)
  }, [initialBooks])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleBookSelect = (book: BookNode | null, clickEvent?: React.MouseEvent) => {
    setSelectedBook(book)
    
    // On mobile, panel position doesn't matter as it's full screen
    if (!isMobile && book && clickEvent) {
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
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId))
    if (selectedBook?.id === bookId) {
      setSelectedBook(null)
    }
  }

  console.log('🗺️ RoadmapSection render: books.length =', books.length)

  return (
    <div className="relative">
      {books.length > 0 ? (
        <RoadmapTree
          books={books}
          title={title}
          onBookSelect={handleBookSelect}
          selectedBook={selectedBook}
          onDeleteNode={handleDeleteNode}
          onClearRoadmap={handleClearRoadmap}
        />
      ) : (
        <div className={`flex flex-col items-center justify-center text-center ${isMobile ? 'h-48 px-4' : 'h-56'}`}>
          <div className={`${isMobile ? 'text-4xl' : 'text-6xl'} mb-4 text-gray-300`}>📚</div>
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-600 mb-2`}>
            Sorry we cannot build a roadmap for you
          </h3>
          <p className={`text-gray-500 ${isMobile ? 'text-sm px-2' : ''} max-w-2xl`}>
            {title}
          </p>
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