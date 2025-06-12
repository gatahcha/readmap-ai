"use client"

import { useCallback, useEffect, useState } from "react"
import type { BookNode } from "@/book/bookNode"
import { TreeNodePositioned } from "@/components/roadmap_components/TreeNodePositioned"
import { BookConnection } from "@/components/roadmap_components/BookConnection"
import { ArrowDefinitions } from "@/components/roadmap_components/ArrowDefinition"
import { Download, Trash2 } from "lucide-react"
import { generateRoadmapPDF } from "@/components/utils/pdf-generator"

interface RoadmapTreeProps {
  books: BookNode[]
  onBookSelect: (book: BookNode | null) => void
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
  width: number
  height: number
}

export function RoadmapTree({ books: initialBooks, onBookSelect, selectedBook }: RoadmapTreeProps) {
  const [books, setBooks] = useState<BookNode[]>(initialBooks)
  const [positionedNodes, setPositionedNodes] = useState<PositionedNode[]>([])
  const [hoveredBook, setHoveredBook] = useState<BookNode | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [screenDimensions, setScreenDimensions] = useState({ width: 1200, height: 800 })
  const [horizontalOffset, setHorizontalOffset] = useState(0)

  useEffect(() => {
    const updateScreenDimensions = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateScreenDimensions()
    window.addEventListener("resize", updateScreenDimensions)
    return () => window.removeEventListener("resize", updateScreenDimensions)
  }, [])

  const getContainerDimensions = useCallback(() => {
    const containerWidth = Math.max(screenDimensions.width - 80, 800)
    const containerHeight = Math.max(screenDimensions.height - 180, 500)
    return { width: containerWidth, height: containerHeight }
  }, [screenDimensions])

  const handleDownload = useCallback(async () => {
    try {
      await generateRoadmapPDF(books, "Roadmap #1", "roadmap-tree-content-area")
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      await generateRoadmapPDF(books, "Roadmap #1")
    }
  }, [books])

  const handleDeleteNode = useCallback(
    (bookId: string) => {
      const bookToDelete = books.find((book) => book.id === bookId)
      if (!bookToDelete) return

      const booksByISBN13 = new Map<number, BookNode>()
      books.forEach((book) => booksByISBN13.set(book.isbn13, book))

      const dependentBooks = books.filter((book) => book.prerequisites.includes(bookToDelete.isbn13))
      const booksToRemove = new Set<string>([bookId])

      const wouldBecomeOrphaned = (book: BookNode) => {
        if (book.prerequisites.length === 0) return false
        const remainingPrereqs = book.prerequisites.filter((prereqISBN13) => {
          const prereqBook = booksByISBN13.get(prereqISBN13)
          return prereqBook && !booksToRemove.has(prereqBook.id)
        })
        return remainingPrereqs.length === 0
      }

      const findOrphanedChildren = (currentBookId: string) => {
        const orphanedChildren = dependentBooks.filter((book) => {
          return book.prerequisites.includes(bookToDelete.isbn13) && wouldBecomeOrphaned(book)
        })
        orphanedChildren.forEach((child) => {
          if (!booksToRemove.has(child.id)) {
            booksToRemove.add(child.id)
            findOrphanedChildren(child.id)
          }
        })
      }
      findOrphanedChildren(bookId)
      setBooks((prevBooks) => prevBooks.filter((book) => !booksToRemove.has(book.id)))
      if (selectedBook && booksToRemove.has(selectedBook.id)) {
        onBookSelect(null)
      }
    },
    [books, selectedBook, onBookSelect],
  )

  const findBookByISBN13 = useCallback((isbn13: number) => books.find((book) => book.isbn13 === isbn13), [books])

  useEffect(() => {
    const calculatePositions = () => {
      if (books.length === 0) return

      const containerDimensions = getContainerDimensions()
      const headerBarHeight = 80
      const sidePadding = 40
      const verticalPadding = 20

      const drawableCanvasWidth = containerDimensions.width - sidePadding
      const drawableCanvasHeight = containerDimensions.height - headerBarHeight - verticalPadding * 2

      const bookLevels = new Map<string, number>()
      const childrenMap = new Map<string, BookNode[]>()

      const calculateBookLevel = (book: BookNode): number => {
        if (bookLevels.has(book.id)) return bookLevels.get(book.id)!
        if (book.prerequisites.length === 0) {
          bookLevels.set(book.id, 1)
          return 1
        }
        let maxPrereqLevel = 0
        for (const prereqISBN13 of book.prerequisites) {
          const prereqBook = findBookByISBN13(prereqISBN13)
          if (prereqBook) {
            maxPrereqLevel = Math.max(maxPrereqLevel, calculateBookLevel(prereqBook))
          }
        }
        const level = maxPrereqLevel + 1
        bookLevels.set(book.id, level)
        return level
      }

      books.forEach(calculateBookLevel)

      books.forEach((book) => {
        book.prerequisites.forEach((prereqISBN13) => {
          const prereqBook = findBookByISBN13(prereqISBN13)
          if (prereqBook) {
            if (!childrenMap.has(prereqBook.id)) childrenMap.set(prereqBook.id, [])
            childrenMap.get(prereqBook.id)!.push(book)
          }
        })
      })

      const levelGroups: { [level: number]: BookNode[] } = {}
      books.forEach((book) => {
        const level = bookLevels.get(book.id) || 1
        if (!levelGroups[level]) levelGroups[level] = []
        levelGroups[level].push(book)
      })

      const totalLevels = Object.keys(levelGroups).length
      const maxBooksInLevel = Math.max(1, ...Object.values(levelGroups).map((levelBooks) => levelBooks.length))

      const baseNodeWidth = Math.max(120, Math.min(300, drawableCanvasWidth / maxBooksInLevel - 30))
      const baseNodeHeight = Math.max(60, Math.min(120, drawableCanvasHeight / Math.max(totalLevels, 1) - 30))

      const screenScale = Math.min(screenDimensions.width / 1200, screenDimensions.height / 800)
      const scaledNodeWidth = baseNodeWidth * Math.max(0.7, Math.min(1.2, screenScale))
      const scaledNodeHeight = baseNodeHeight * Math.max(0.7, Math.min(1.2, screenScale))

      const positions = new Map<string, { x: number; y: number }>()

      let actualVerticalGap = Math.max(20, scaledNodeHeight * 0.3)
      if (totalLevels > 1) {
        const requiredHeightForNodes = totalLevels * scaledNodeHeight
        const requiredHeightForGaps = (totalLevels - 1) * actualVerticalGap
        const totalContentTreeHeight = requiredHeightForNodes + requiredHeightForGaps
        if (totalContentTreeHeight > drawableCanvasHeight) {
          actualVerticalGap = Math.max(10, (drawableCanvasHeight - requiredHeightForNodes) / (totalLevels - 1))
        }
      }

      const finalContentTreeHeight = totalLevels * scaledNodeHeight + Math.max(0, totalLevels - 1) * actualVerticalGap
      const topOffset =
        headerBarHeight + verticalPadding + Math.max(0, (drawableCanvasHeight - finalContentTreeHeight) / 2)

      Object.entries(levelGroups).forEach(([levelStr, levelBooks]) => {
        const level = Number.parseInt(levelStr, 10)
        const y = topOffset + (level - 1) * (scaledNodeHeight + actualVerticalGap) + scaledNodeHeight / 2
        const currentLevelBookCount = levelBooks.length
        let actualHorizontalGap = Math.max(15, scaledNodeWidth * 0.15)

        if (currentLevelBookCount > 1) {
          const requiredWidthForNodesInLevel = currentLevelBookCount * scaledNodeWidth
          const requiredWidthForGapsInLevel = (currentLevelBookCount - 1) * actualHorizontalGap
          const totalLevelContentWidth = requiredWidthForNodesInLevel + requiredWidthForGapsInLevel
          if (totalLevelContentWidth > drawableCanvasWidth) {
            actualHorizontalGap = Math.max(
              5,
              (drawableCanvasWidth - requiredWidthForNodesInLevel) / (currentLevelBookCount - 1),
            )
          }
        }

        const finalLevelContentWidth =
          currentLevelBookCount * scaledNodeWidth + Math.max(0, currentLevelBookCount - 1) * actualHorizontalGap
        const levelStartX =
          sidePadding / 2 + Math.max(0, (drawableCanvasWidth - finalLevelContentWidth) / 2) + horizontalOffset

        levelBooks.forEach((book, index) => {
          const x = levelStartX + index * (scaledNodeWidth + actualHorizontalGap) + scaledNodeWidth / 2
          positions.set(book.id, { x, y })
        })
      })

      const positioned: PositionedNode[] = books.map((book) => {
        const pos = positions.get(book.id) || { x: 0, y: 0 }
        const level = bookLevels.get(book.id) || 1
        const parentISBN13 = book.prerequisites[0]
        const parentBook = parentISBN13 ? findBookByISBN13(parentISBN13) : null
        return {
          id: book.id,
          book,
          x: pos.x,
          y: pos.y,
          level,
          parent: parentBook?.id,
          children: childrenMap.get(book.id)?.map((c) => c.id) || [],
          width: scaledNodeWidth,
          height: scaledNodeHeight,
        }
      })
      setPositionedNodes(positioned)
    }
    calculatePositions()
  }, [books, findBookByISBN13, screenDimensions, getContainerDimensions, horizontalOffset])

  const getNodeById = useCallback((id: string) => positionedNodes.find((node) => node.id === id), [positionedNodes])

  const getConnections = useCallback(() => {
    const connections: { source: string; target: string; id: string }[] = []
    books.forEach((book) => {
      book.prerequisites.forEach((prereqISBN13) => {
        const prereqBook = findBookByISBN13(prereqISBN13)
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
  }, [books, findBookByISBN13])

  const isConnectionHighlighted = useCallback(
    (sourceId: string, targetId: string) => {
      const connectionId = `${sourceId}-${targetId}`
      if (hoveredConnection === connectionId) return true
      if (hoveredBook) {
        const sourceNode = getNodeById(sourceId)
        if (sourceNode && hoveredBook.id === targetId && hoveredBook.prerequisites.includes(sourceNode.book.isbn13))
          return true
      }
      if (selectedBook) {
        const sourceNode = getNodeById(sourceId)
        if (sourceNode && selectedBook.id === targetId && selectedBook.prerequisites.includes(sourceNode.book.isbn13))
          return true
      }
      return false
    },
    [hoveredConnection, hoveredBook, selectedBook, getNodeById],
  )

  if (positionedNodes.length === 0) {
    return (
      <main className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </main>
    )
  }

  const containerDimensions = getContainerDimensions()

  return (
    <main className="w-full h-screen overflow-hidden bg-gradient-to-b from-orange-50 to-yellow-50">
      <div className="w-full h-full flex flex-col">
        <div
          id="roadmap-tree-full"
          className="flex-1 bg-white rounded-lg shadow-lg m-4 overflow-hidden relative"
          style={{
            width: `${containerDimensions.width}px`,
            height: `${containerDimensions.height}px`,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "calc(100vh - 32px)",
          }}
        >
          {/* Header with title and action buttons */}
          <div className="absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200 text-sm"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (selectedBook) {
                      handleDeleteNode(selectedBook.id)
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Roadmap #1</h2>
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Roadmap content area */}
          <div
            id="roadmap-tree-content-area"
            className="absolute inset-0 pt-20" // pt-20 is for the header bar above
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {/* SVG for animated connections */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width="100%"
              height="100%"
              style={{ zIndex: 1, overflow: "visible" }}
            >
              <ArrowDefinitions />
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
                onDelete={handleDeleteNode}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
