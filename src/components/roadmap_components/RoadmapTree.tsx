"use client"

import { useCallback, useEffect, useState } from "react"
import type { BookNode } from "@/book/bookNode"
import { TreeNodePositioned } from "@/components/roadmap_components/TreeNodePositioned"
import { BookConnection } from "@/components/roadmap_components/BookConnection"
import { ArrowDefinitions } from "@/components/roadmap_components/ArrowDefinition"
import { Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateRoadmapPDF } from "@/components/utils/pdf-generator"

interface RoadmapTreeProps {
  books: BookNode[]
  onBookSelect: (book: BookNode | null, clickEvent?: React.MouseEvent) => void
  selectedBook: BookNode | null
  onDeleteNode: (bookId: string) => void
  onClearRoadmap: () => void
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

export function RoadmapTree({ books, onBookSelect, selectedBook, onDeleteNode, onClearRoadmap }: RoadmapTreeProps) {
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
    // Improved container sizing with better space utilization
    const containerWidth = Math.min(
      Math.max(screenDimensions.width - 40, 1400), // Reduced margin from 60 to 40
      screenDimensions.width * 0.97 // Increased from 95% to 97%
    )
    const containerHeight = Math.min(
      Math.max(screenDimensions.height - 60, 1200), // Reduced from 100 to 60
      screenDimensions.height * 0.99 // Increased from 98% to 99%
    )
    return { width: containerWidth, height: containerHeight }
  }, [screenDimensions])

  // Updated to use PDF generator for book details only
  const handleDownload = useCallback(async () => {
    try {
      await generateRoadmapPDF(books, "Roadmap #1")
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }, [books])

  const findBookByISBN13 = useCallback((isbn13: number) => books.find((book) => book.isbn13 === isbn13), [books])

  useEffect(() => {
    const calculatePositions = () => {
      if (books.length === 0) return

      const containerDimensions = getContainerDimensions()
      const headerBarHeight = 80
      const sidePadding = 60 // Reduced from 80 to 60
      const verticalPadding = 10 // Keep minimal top padding
      const bottomPadding = 120 // Increased from 80 to 120 for MacBook screens

      // Calculate drawable area with optimized spacing
      const drawableCanvasWidth = containerDimensions.width - (sidePadding * 2)
      const drawableCanvasHeight = containerDimensions.height - headerBarHeight - verticalPadding - bottomPadding

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

      // Optimized node sizing calculation
      const minNodeWidth = 180
      const maxNodeWidth = 320
      const minNodeHeight = 100
      const maxNodeHeight = 140

      // Better base dimensions calculation
      const baseNodeWidth = Math.max(
        minNodeWidth, 
        Math.min(maxNodeWidth, (drawableCanvasWidth - (maxBooksInLevel - 1) * 35) / maxBooksInLevel) // Reduced spacing from 40 to 35
      )
      const baseNodeHeight = Math.max(
        minNodeHeight, 
        Math.min(maxNodeHeight, (drawableCanvasHeight - (totalLevels - 1) * 50) / totalLevels) // Reduced spacing from 60 to 50
      )

      // Apply responsive scaling
      const screenScale = Math.min(screenDimensions.width / 1400, screenDimensions.height / 900)
      const scaledNodeWidth = baseNodeWidth * Math.max(0.85, Math.min(1.1, screenScale))
      const scaledNodeHeight = baseNodeHeight * Math.max(0.85, Math.min(1.1, screenScale))

      const positions = new Map<string, { x: number; y: number }>()

      // Optimized vertical gap calculation
      let actualVerticalGap = Math.max(50, scaledNodeHeight * 0.6) // Reduced from 60 and 0.7
      if (totalLevels > 1) {
        const requiredHeightForNodes = totalLevels * scaledNodeHeight
        const requiredHeightForGaps = (totalLevels - 1) * actualVerticalGap
        const totalContentTreeHeight = requiredHeightForNodes + requiredHeightForGaps
        if (totalContentTreeHeight > drawableCanvasHeight) {
          actualVerticalGap = Math.max(35, (drawableCanvasHeight - requiredHeightForNodes) / (totalLevels - 1)) // Reduced from 40
        }
      }

      const finalContentTreeHeight = totalLevels * scaledNodeHeight + Math.max(0, totalLevels - 1) * actualVerticalGap
      // Better positioning - use more of the available space
      const topOffset = headerBarHeight + verticalPadding + Math.max(15, (drawableCanvasHeight - finalContentTreeHeight) / 4) // Changed from /2 to /4

      Object.entries(levelGroups).forEach(([levelStr, levelBooks]) => {
        const level = Number.parseInt(levelStr, 10)
        const y = topOffset + (level - 1) * (scaledNodeHeight + actualVerticalGap) + scaledNodeHeight / 2
        const currentLevelBookCount = levelBooks.length
        
        // Optimized horizontal spacing calculation
        let actualHorizontalGap = Math.max(35, scaledNodeWidth * 0.15) // Reduced from 40 and 0.18

        if (currentLevelBookCount > 1) {
          const requiredWidthForNodesInLevel = currentLevelBookCount * scaledNodeWidth
          const requiredWidthForGapsInLevel = (currentLevelBookCount - 1) * actualHorizontalGap
          const totalLevelContentWidth = requiredWidthForNodesInLevel + requiredWidthForGapsInLevel
          
          if (totalLevelContentWidth > drawableCanvasWidth) {
            actualHorizontalGap = Math.max(
              20, // Reduced from 25
              (drawableCanvasWidth - requiredWidthForNodesInLevel) / (currentLevelBookCount - 1)
            )
          }
        }

        const finalLevelContentWidth =
          currentLevelBookCount * scaledNodeWidth + Math.max(0, currentLevelBookCount - 1) * actualHorizontalGap
        
        // Perfect center alignment
        const levelStartX = sidePadding + (drawableCanvasWidth - finalLevelContentWidth) / 2

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
    <main className="w-full h-screen overflow-hidden bg-gradient-to-b from-orange-50 to-yellow-50 flex items-start justify-center px-2 pt-4">
      <div className="flex flex-col items-center">
        <div
          id="roadmap-tree-full"
          className="bg-white rounded-lg shadow-lg overflow-auto relative mx-auto"
          style={{
            width: `${containerDimensions.width}px`,
            height: `${containerDimensions.height}px`,
            maxWidth: "calc(100vw - 16px)",
            maxHeight: "calc(100vh - 32px)",
          }}
        >
          {/* Header with title and action buttons - now sticky */}
          <div className="sticky top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-3 py-2 text-green-600 border border-green-300 hover:text-green-700 hover:bg-green-50 hover:border-green-400 rounded-lg transition-all duration-200 text-sm h-9"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearRoadmap}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 text-sm h-9"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              </div>
              <div className="text-center flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Roadmap #1</h2>
                <p className="text-xs text-gray-500 mt-1">
                  📸 For roadmap image: Please take a screenshot • Download creates book details PDF
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  💡 Working on improved download features - stay tuned!
                </p>
              </div>
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Roadmap content area */}
          <div
            id="roadmap-tree-content-area"
            className="relative"
            style={{
              width: "100%",
              minHeight: "100%",
              paddingBottom: "100px",
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
                onSelect={(book, clickEvent) => onBookSelect(book, clickEvent)}
                isSelected={selectedBook?.id === node.id}
                isHovered={hoveredBook?.id === node.id}
                onHover={setHoveredBook}
                onDelete={onDeleteNode} 
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}