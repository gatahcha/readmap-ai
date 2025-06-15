"use client"

import { useCallback, useEffect, useState } from "react"
import type { BookNode } from "@/book/bookNode"
import { TreeNodePositioned } from "@/components/roadmap_components/TreeNodePositioned"
import { BookConnection } from "@/components/roadmap_components/BookConnection"
import { ArrowDefinitions } from "@/components/roadmap_components/ArrowDefinition"
import { Download, Trash2, Menu, Edit3 } from "lucide-react"
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
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [roadmapTitle, setRoadmapTitle] = useState("Roadmap #1")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState("")

  useEffect(() => {
    const updateScreenDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenDimensions({ width, height })
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    
    updateScreenDimensions()
    window.addEventListener("resize", updateScreenDimensions)
    return () => window.removeEventListener("resize", updateScreenDimensions)
  }, [])

  const getContainerDimensions = useCallback(() => {
    if (isMobile) {
      return {
        width: screenDimensions.width - 4, // Even more minimal margin on mobile
        height: screenDimensions.height - 8
      }
    } else if (isTablet) {
      return {
        width: screenDimensions.width - 16,
        height: screenDimensions.height - 32
      }
    } else {
      // Desktop - original logic
      const containerWidth = Math.min(
        Math.max(screenDimensions.width - 40, 1400),
        screenDimensions.width * 0.97
      )
      const containerHeight = Math.min(
        Math.max(screenDimensions.height - 60, 1200),
        screenDimensions.height * 0.99
      )
      return { width: containerWidth, height: containerHeight }
    }
  }, [screenDimensions, isMobile, isTablet])

  const handleDownload = useCallback(async () => {
    try {
      await generateRoadmapPDF(books, roadmapTitle)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }, [books, roadmapTitle])

  const handleTitleEdit = useCallback(() => {
    setTempTitle(roadmapTitle)
    setIsEditingTitle(true)
  }, [roadmapTitle])

  const handleTitleSave = useCallback(() => {
    if (tempTitle.trim()) {
      setRoadmapTitle(tempTitle.trim())
    }
    setIsEditingTitle(false)
  }, [tempTitle])

  const handleTitleCancel = useCallback(() => {
    setIsEditingTitle(false)
    setTempTitle("")
  }, [])

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }, [handleTitleSave, handleTitleCancel])

  const findBookByISBN13 = useCallback((isbn13: number) => books.find((book) => book.isbn13 === isbn13), [books])

  useEffect(() => {
    const calculatePositions = () => {
      if (books.length === 0) return

      const containerDimensions = getContainerDimensions()
      
      // Mobile-responsive header and padding
      const headerBarHeight = isMobile ? 120 : 80 // Taller header on mobile for stacked buttons
      const sidePadding = isMobile ? 8 : isTablet ? 32 : 60 // Reduced mobile padding from 16 to 8
      const verticalPadding = isMobile ? 4 : 10 // Reduced mobile padding
      const bottomPadding = isMobile ? 40 : isTablet ? 100 : 120 // Reduced mobile bottom padding

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

      // Mobile-responsive node sizing with better constraints
      let minNodeWidth: number, maxNodeWidth: number, minNodeHeight: number, maxNodeHeight: number
      
      if (isMobile) {
        minNodeWidth = 120 // Reduced from 140
        maxNodeWidth = 180 // Reduced from 200
        minNodeHeight = 70 // Reduced from 80
        maxNodeHeight = 90 // Reduced from 100
      } else if (isTablet) {
        minNodeWidth = 160
        maxNodeWidth = 260
        minNodeHeight = 90
        maxNodeHeight = 120
      } else {
        minNodeWidth = 180
        maxNodeWidth = 320
        minNodeHeight = 100
        maxNodeHeight = 140
      }

      // Responsive spacing - reduced for mobile
      const horizontalSpacing = isMobile ? 12 : isTablet ? 30 : 35 // Reduced from 20
      const verticalSpacing = isMobile ? 30 : isTablet ? 45 : 50 // Reduced from 40

      const baseNodeWidth = Math.max(
        minNodeWidth, 
        Math.min(maxNodeWidth, (drawableCanvasWidth - (maxBooksInLevel - 1) * horizontalSpacing) / maxBooksInLevel)
      )
      const baseNodeHeight = Math.max(
        minNodeHeight, 
        Math.min(maxNodeHeight, (drawableCanvasHeight - (totalLevels - 1) * verticalSpacing) / totalLevels)
      )

      // Apply responsive scaling with tighter constraints for mobile
      const screenScale = isMobile 
        ? Math.min(screenDimensions.width / 360, screenDimensions.height / 600) // Changed from 400 to 360
        : isTablet 
        ? Math.min(screenDimensions.width / 800, screenDimensions.height / 700)
        : Math.min(screenDimensions.width / 1400, screenDimensions.height / 900)
      
      const scaledNodeWidth = baseNodeWidth * Math.max(0.75, Math.min(1.0, screenScale)) // Tighter scaling for mobile
      const scaledNodeHeight = baseNodeHeight * Math.max(0.75, Math.min(1.0, screenScale))

      const positions = new Map<string, { x: number; y: number }>()

      // Responsive vertical gap
      let actualVerticalGap = Math.max(
        isMobile ? 35 : isTablet ? 45 : 50, 
        scaledNodeHeight * (isMobile ? 0.5 : 0.6)
      )
      
      if (totalLevels > 1) {
        const requiredHeightForNodes = totalLevels * scaledNodeHeight
        const requiredHeightForGaps = (totalLevels - 1) * actualVerticalGap
        const totalContentTreeHeight = requiredHeightForNodes + requiredHeightForGaps
        if (totalContentTreeHeight > drawableCanvasHeight) {
          actualVerticalGap = Math.max(
            isMobile ? 25 : isTablet ? 35 : 40, 
            (drawableCanvasHeight - requiredHeightForNodes) / (totalLevels - 1)
          )
        }
      }

      const finalContentTreeHeight = totalLevels * scaledNodeHeight + Math.max(0, totalLevels - 1) * actualVerticalGap
      const topOffset = headerBarHeight + verticalPadding + Math.max(10, (drawableCanvasHeight - finalContentTreeHeight) / (isMobile ? 6 : 4))

      Object.entries(levelGroups).forEach(([levelStr, levelBooks]) => {
        const level = Number.parseInt(levelStr, 10)
        const y = topOffset + (level - 1) * (scaledNodeHeight + actualVerticalGap) + scaledNodeHeight / 2
        const currentLevelBookCount = levelBooks.length
        
        let actualHorizontalGap = Math.max(
          isMobile ? 10 : isTablet ? 30 : 35, // Reduced from 20
          scaledNodeWidth * (isMobile ? 0.08 : 0.15) // Reduced mobile ratio from 0.12
        )

        if (currentLevelBookCount > 1) {
          const requiredWidthForNodesInLevel = currentLevelBookCount * scaledNodeWidth
          const requiredWidthForGapsInLevel = (currentLevelBookCount - 1) * actualHorizontalGap
          const totalLevelContentWidth = requiredWidthForNodesInLevel + requiredWidthForGapsInLevel
          
          if (totalLevelContentWidth > drawableCanvasWidth) {
            actualHorizontalGap = Math.max(
              isMobile ? 8 : isTablet ? 20 : 25, // Reduced minimum from 15
              (drawableCanvasWidth - requiredWidthForNodesInLevel) / (currentLevelBookCount - 1)
            )
          }
        }

        const finalLevelContentWidth =
          currentLevelBookCount * scaledNodeWidth + Math.max(0, currentLevelBookCount - 1) * actualHorizontalGap
        
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
  }, [books, findBookByISBN13, screenDimensions, getContainerDimensions, isMobile, isTablet])

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
    <main className={`w-full h-screen overflow-hidden bg-gradient-to-b from-orange-50 to-yellow-50 flex items-start justify-center ${isMobile ? 'px-0 pt-1' : 'px-2 pt-4'}`}>
      <div className="flex flex-col items-center w-full">
        <div
          id="roadmap-tree-full"
          className="bg-white rounded-lg shadow-lg overflow-auto relative mx-auto"
          style={{
            width: `${containerDimensions.width}px`,
            height: `${containerDimensions.height}px`,
            maxWidth: "100vw",
            maxHeight: "100vh",
          }}
        >
          {/* Mobile/Desktop Header */}
          <div className="sticky top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b">
            {isMobile ? (
              // Mobile Header Layout
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  {isEditingTitle ? (
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={handleTitleSave}
                      onKeyDown={handleTitleKeyDown}
                      className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none flex-1 mr-2"
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="flex items-center group cursor-pointer"
                      onClick={handleTitleEdit}
                      title="Click to edit title"
                    >
                      <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        {roadmapTitle}
                      </h2>
                      <Edit3 className="w-4 h-4 ml-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  )}
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
                
                {showMobileMenu && (
                  <div className="flex flex-col gap-2 pb-2 border-t pt-2">
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-2 text-green-600 border border-green-300 hover:text-green-700 hover:bg-green-50 hover:border-green-400 rounded-lg transition-all duration-200 text-sm"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-white border border-red-300 hover:text-red-700 hover:bg-red-50 hover:border-red-400 rounded-lg transition-all duration-200 text-sm w-full"
                      onClick={onClearRoadmap}
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    📸 Screenshot for image • PDF for details
                  </p>
                  <p className="text-xs text-blue-600">
                    💡 Tap menu for options
                  </p>
                </div>
              </div>
            ) : (
              // Desktop Header Layout (original)
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-green-600 border border-green-300 hover:text-green-700 hover:bg-green-50 hover:border-green-400 rounded-lg transition-all duration-200 text-sm h-9"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-red-600 bg-white border border-red-300 hover:text-red-700 hover:bg-red-50 hover:border-red-400 rounded-lg transition-all duration-200 text-sm h-9"
                    onClick={onClearRoadmap}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
                <div className="text-center flex-1">
                  {isEditingTitle ? (
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={handleTitleSave}
                      onKeyDown={handleTitleKeyDown}
                      className="text-2xl md:text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none text-center"
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="group cursor-pointer"
                      onClick={handleTitleEdit}
                      title="Click to edit title"
                    >
                      <div className="flex items-center justify-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                          {roadmapTitle}
                        </h2>
                        <Edit3 className="w-5 h-5 ml-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    📸 For roadmap image: Please take a screenshot • Download creates book details PDF
                  </p>
                </div>
                <div className="w-32"></div>
              </div>
            )}
          </div>

          {/* Roadmap content area */}
          <div
            id="roadmap-tree-content-area"
            className="relative"
            style={{
              width: "100%",
              minHeight: "100%",
              paddingBottom: isMobile ? "60px" : "100px",
            }}
          >
            {/* SVG for connections - hide on very small screens or when there are too many nodes */}
            {(!isMobile || books.length <= 8) && (
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
            )}

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
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}