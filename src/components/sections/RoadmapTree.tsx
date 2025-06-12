"use client"

import { useCallback, useEffect, useState } from "react"
import type { BookNode } from "@/book/bookNode"
import { TreeNodePositioned } from "@/components/roadmap_components/TreeNodePositioned"
import { BookConnection } from "@/components/roadmap_components/BookConnection"
import { ArrowDefinitions } from "@/components/roadmap_components/ArrowDefinition"
import { Download, Trash2 } from "lucide-react"

interface RoadmapTreeProps {
  books: BookNode[]
  onBookSelect: (book: BookNode | null) => void // Allow null
  selectedBook: BookNode | null
}

interface PositionedNode {
  id: string
  book: BookNode
  x: number
  y: number
  level: number
  parent?: string
  children: string[]
}

export function RoadmapTree({ books: initialBooks, onBookSelect, selectedBook }: RoadmapTreeProps) {
  // Change from using props.books directly to using state
  const [books, setBooks] = useState<BookNode[]>(initialBooks)
  const [positionedNodes, setPositionedNodes] = useState<PositionedNode[]>([])
  const [hoveredBook, setHoveredBook] = useState<BookNode | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)

  // Add this function to handle node deletion
  const handleDeleteNode = useCallback(
    (bookId: string) => {
      // Find the book to be deleted
      const bookToDelete = books.find((book) => book.id === bookId)
      if (!bookToDelete) return

      // Create a map of all books by their titles for easy lookup
      const booksByTitle = new Map<string, BookNode>()
      books.forEach((book) => booksByTitle.set(book.title, book))

      // Find all books that have this book as a prerequisite
      const dependentBooks = books.filter((book) => book.prerequisites.includes(bookToDelete.title))

      // Create a set of books to remove (start with the book to delete)
      const booksToRemove = new Set<string>([bookId])

      // Function to check if a book would become orphaned
      const wouldBecomeOrphaned = (book: BookNode) => {
        // If it has no prerequisites, it can't be orphaned
        if (book.prerequisites.length === 0) return false

        // Check if all prerequisites are being removed
        const remainingPrereqs = book.prerequisites.filter((prereqTitle) => {
          const prereqBook = booksByTitle.get(prereqTitle)
          return prereqBook && !booksToRemove.has(prereqBook.id)
        })

        // If no prerequisites remain, it's orphaned
        return remainingPrereqs.length === 0
      }

      // Recursively find orphaned children
      const findOrphanedChildren = (currentBookId: string) => {
        const orphanedChildren = dependentBooks.filter((book) => {
          // Find books that depend on the current book
          const prereqBook = booksByTitle.get(bookToDelete.title)
          return prereqBook && book.prerequisites.includes(prereqBook.title) && wouldBecomeOrphaned(book)
        })

        // Add orphaned children to the removal set
        orphanedChildren.forEach((child) => {
          if (!booksToRemove.has(child.id)) {
            booksToRemove.add(child.id)
            // Recursively check this child's dependents
            findOrphanedChildren(child.id)
          }
        })
      }

      // Start the recursive search from the book to delete
      findOrphanedChildren(bookId)

      // Update the books state by filtering out the books to remove
      setBooks((prevBooks) => prevBooks.filter((book) => !booksToRemove.has(book.id)))

      // If the selected book is being removed, clear the selection
      if (selectedBook && booksToRemove.has(selectedBook.id)) {
        onBookSelect(null as any) // Temporary fix, but better to update the interface
      }
    },
    [books, selectedBook, onBookSelect],
  )

  // Helper function to find book by title
  const findBookByTitle = useCallback(
    (title: string) => {
      return books.find((book) => book.title === title)
    },
    [books],
  )

  // Calculate horizontally balanced positions with proper level ordering
  useEffect(() => {
    const calculatePositions = () => {
      // Create a map to store the level of each book
      const bookLevels = new Map<string, number>()
      const childrenMap = new Map<string, BookNode[]>()

      // Function to calculate the level of a book recursively
      const calculateBookLevel = (book: BookNode): number => {
        // If we've already calculated this book's level, return it
        if (bookLevels.has(book.id)) {
          return bookLevels.get(book.id)!
        }

        // If the book has no prerequisites, it's at level 1
        if (book.prerequisites.length === 0) {
          bookLevels.set(book.id, 1)
          return 1
        }

        // Otherwise, find the maximum level of its prerequisites and add 1
        let maxPrereqLevel = 0
        for (const prereqTitle of book.prerequisites) {
          const prereqBook = findBookByTitle(prereqTitle)
          if (prereqBook) {
            const prereqLevel = calculateBookLevel(prereqBook)
            maxPrereqLevel = Math.max(maxPrereqLevel, prereqLevel)
          }
        }

        const level = maxPrereqLevel + 1
        bookLevels.set(book.id, level)
        return level
      }

      // Calculate level for each book
      books.forEach((book) => {
        calculateBookLevel(book)
      })

      // Build parent-child relationships using titles
      books.forEach((book) => {
        book.prerequisites.forEach((prereqTitle) => {
          const prereqBook = findBookByTitle(prereqTitle)
          if (prereqBook) {
            if (!childrenMap.has(prereqBook.id)) {
              childrenMap.set(prereqBook.id, [])
            }
            childrenMap.get(prereqBook.id)!.push(book)
          }
        })
      })

      // Group books by level
      const levelGroups: { [level: number]: BookNode[] } = {}
      books.forEach((book) => {
        const level = bookLevels.get(book.id) || 1
        if (!levelGroups[level]) {
          levelGroups[level] = []
        }
        levelGroups[level].push(book)
      })

      // Calculate positions with horizontal balancing
      const levelSpacing = 200
      const nodeSpacing = 280
      const containerWidth = Math.max(1200, window.innerWidth)
      const positions = new Map<string, { x: number; y: number }>()

      // Position nodes based on levels (top to bottom)
      Object.entries(levelGroups).forEach(([levelStr, levelBooks]) => {
        const level = Number.parseInt(levelStr)
        const y = (level - 1) * levelSpacing + 100 // Start from top

        // Calculate horizontal positions to center the level
        const totalWidth = Math.max(levelBooks.length - 1, 0) * nodeSpacing
        const startX = (containerWidth - totalWidth) / 2

        levelBooks.forEach((book, index) => {
          const x = startX + index * nodeSpacing
          positions.set(book.id, { x, y })
        })
      })

      // Convert to positioned nodes
      const positioned: PositionedNode[] = books.map((book) => {
        const pos = positions.get(book.id) || { x: 0, y: 0 }
        const level = bookLevels.get(book.id) || 1

        // Find parent by title (first prerequisite)
        const parentTitle = book.prerequisites[0]
        const parentBook = parentTitle ? findBookByTitle(parentTitle) : null

        return {
          id: book.id,
          book,
          x: pos.x,
          y: pos.y,
          level,
          parent: parentBook?.id,
          children: childrenMap.get(book.id)?.map((c) => c.id) || [],
        }
      })

      setPositionedNodes(positioned)
    }

    if (books.length > 0) {
      calculatePositions()
    }
  }, [books, findBookByTitle])

  const getNodeById = useCallback(
    (id: string) => {
      return positionedNodes.find((node) => node.id === id)
    },
    [positionedNodes],
  )

  // Get all connections between books using titles
  const getConnections = useCallback(() => {
    const connections: { source: string; target: string; id: string }[] = []

    books.forEach((book) => {
      book.prerequisites.forEach((prereqTitle) => {
        const prereqBook = findBookByTitle(prereqTitle)
        if (prereqBook) {
          connections.push({
            source: prereqBook.id,
            target: book.id,
            id: `${prereqBook.id}-${book.id}`,
          })
        }
      })
    })

    return connections
  }, [books, findBookByTitle])

  // Check if a connection is highlighted
  const isConnectionHighlighted = useCallback(
    (sourceId: string, targetId: string) => {
      const connectionId = `${sourceId}-${targetId}`

      if (hoveredConnection === connectionId) return true

      if (hoveredBook) {
        const sourceBook = getNodeById(sourceId)?.book
        if (sourceBook && hoveredBook.id === targetId && hoveredBook.prerequisites.includes(sourceBook.title)) {
          return true
        }
      }

      if (selectedBook) {
        const sourceBook = getNodeById(sourceId)?.book
        if (sourceBook && selectedBook.id === targetId && selectedBook.prerequisites.includes(sourceBook.title)) {
          return true
        }
      }

      return false
    },
    [hoveredConnection, hoveredBook, selectedBook, getNodeById],
  )

  if (positionedNodes.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  // Calculate container dimensions
  const maxX = Math.max(...positionedNodes.map((n) => n.x)) + 150
  const maxY = Math.max(...positionedNodes.map((n) => n.y)) + 150
  const minX = Math.min(...positionedNodes.map((n) => n.x)) - 150

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px] overflow-auto">
      {/* Header with title and action buttons */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200 text-sm">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Roadmap #1</h2>
        <div className="w-32"></div> {/* Spacer for centering */}
      </div>

      <div
        className="relative mx-auto"
        style={{
          width: Math.max(maxX - minX, 800),
          height: maxY,
          minHeight: "400px",
        }}
      >
        {/* SVG for animated connections */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          style={{ zIndex: 1, overflow: "visible" }}
        >
          {/* Arrow definitions */}
          <ArrowDefinitions />

          {/* Connections */}
          {getConnections().map(({ source, target, id }) => (
            <BookConnection
              key={id}
              sourceId={source}
              targetId={target}
              id={id}
              isHighlighted={isConnectionHighlighted(source, target)}
              getNodeById={getNodeById}
              onHover={setHoveredConnection}
            />
          ))}
        </svg>

        {/* Nodes */}
        {positionedNodes.map((node) => (
          <TreeNodePositioned
            key={node.id}
            node={node}
            onSelect={onBookSelect}
            isSelected={selectedBook?.id === node.id}
            isHovered={hoveredBook?.id === node.id}
            onHover={setHoveredBook}
            onDelete={handleDeleteNode} // Pass the delete handler
          />
        ))}
      </div>
    </div>
  )
}
