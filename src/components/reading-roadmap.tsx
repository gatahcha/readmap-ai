"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { Book, Star, Calendar, User, Hash, Move, ZoomIn, ZoomOut, X } from "lucide-react"
// Remove the cn import

interface BookNode {
  id: string
  isbn13: number
  isbn10: string
  title: string
  subtitle: string
  author: string
  categories: string
  thumbnail: string
  description: string
  published_year: number
  average_rating: number
  num_pages: number
  prerequisites: string[] // IDs of prerequisite books
  position?: { x: number; y: number }
}

// Sample book data
const sampleBooks: BookNode[] = [
  {
    id: "effective-java",
    isbn13: 9780134685991,
    isbn10: "0134685997",
    title: "Effective Java",
    subtitle: "3rd Edition",
    author: "Joshua Bloch",
    categories: "Programming, Java",
    thumbnail: "/placeholder.svg?height=200&width=150&text=Effective+Java",
    description:
      'The definitive guide to Java platform best practices, updated for Java 7, 8, and 9. Each chapter of Effective Java, Third Edition, consists of several "items," each presented in the form of a short, stand-alone essay that provides specific advice, insight into Java platform subtleties, and updated code examples.',
    published_year: 2017,
    average_rating: 4.7,
    num_pages: 412,
    prerequisites: [],
  },
  {
    id: "clean-code",
    isbn13: 9780132350884,
    isbn10: "0132350882",
    title: "Clean Code",
    subtitle: "A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    categories: "Programming, Software Engineering",
    thumbnail: "/placeholder.svg?height=200&width=150&text=Clean+Code",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.",
    published_year: 2008,
    average_rating: 4.6,
    num_pages: 464,
    prerequisites: [],
  },
  {
    id: "clean-architecture",
    isbn13: 9780134494166,
    isbn10: "0134494164",
    title: "Clean Architecture",
    subtitle: "A Craftsman's Guide to Software Structure and Design",
    author: "Robert C. Martin",
    categories: "Programming, Software Architecture",
    thumbnail: "/placeholder.svg?height=200&width=150&text=Clean+Architecture",
    description:
      'By applying universal rules of software architecture, you can dramatically improve developer productivity throughout the life of any software system. Now, building upon the success of his best-selling books Clean Code and The Clean Coder, legendary software craftsman Robert C. Martin ("Uncle Bob") reveals those rules and helps you apply them.',
    published_year: 2017,
    average_rating: 4.4,
    num_pages: 432,
    prerequisites: ["clean-code"],
  },
  {
    id: "design-patterns",
    isbn13: 9780201633610,
    isbn10: "0201633612",
    title: "Design Patterns",
    subtitle: "Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    categories: "Programming, Software Design",
    thumbnail: "/placeholder.svg?height=200&width=150&text=Design+Patterns",
    description:
      "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
    published_year: 1994,
    average_rating: 4.5,
    num_pages: 416,
    prerequisites: ["effective-java", "clean-code"],
  },
  {
    id: "head-first-design-patterns",
    isbn13: 9780596007126,
    isbn10: "0596007124",
    title: "Head First Design Patterns",
    subtitle: "A Brain-Friendly Guide",
    author: "Eric Freeman, Elisabeth Robson, Bert Bates, Kathy Sierra",
    categories: "Programming, Software Design",
    thumbnail: "/placeholder.svg?height=200&width=150&text=Head+First+Design+Patterns",
    description:
      "At any given moment, someone struggles with the same software design problems you have. And, chances are, someone else has already solved your problem. This edition of Head First Design Patterns shows you the tried-and-true, road-tested patterns used by developers to create functional, elegant, reusable, and flexible software.",
    published_year: 2004,
    average_rating: 4.6,
    num_pages: 694,
    prerequisites: ["clean-code"],
  },
  {
    id: "refactoring",
    isbn13: 9780134757599,
    isbn10: "0134757599",
    title: "Refactoring",
    subtitle: "Improving the Design of Existing Code",
    author: "Martin Fowler",
    categories: "Programming, Software Engineering",
    thumbnail: "/placeholder.svg?height=200&width=150&text=Refactoring",
    description:
      "Refactoring is about improving the design of existing code. It is the process of changing a software system in such a way that it does not alter the external behavior of the code, yet improves its internal structure.",
    published_year: 2018,
    average_rating: 4.5,
    num_pages: 448,
    prerequisites: ["design-patterns"],
  },
]

const ReadingRoadmap = () => {
  // State declarations
  const [books, setBooks] = useState<BookNode[]>(sampleBooks)
  const [selectedBook, setSelectedBook] = useState<BookNode | null>(null)
  const [hoveredBook, setHoveredBook] = useState<BookNode | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [isDragging, setIsDragging] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [draggedNode, setDraggedNode] = useState<BookNode | null>(null)
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map())
  const [animationTime, setAnimationTime] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 3000, height: 3000 })

  const canvasRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef<{ x: number; y: number } | null>(null)
  const panStartPos = useRef<{ x: number; y: number; clientX: number; clientY: number } | null>(null)

  // Calculate initial positions based on book dependencies
  useEffect(() => {
    const calculatePositions = () => {
      const positions = new Map<string, { x: number; y: number }>()
      const levels: { [level: number]: string[] } = {}

      // Find books with no prerequisites (level 0)
      levels[0] = books.filter((book) => book.prerequisites.length === 0).map((book) => book.id)

      // Assign levels to other books based on prerequisites
      let currentLevel = 0
      const assignedBooks = new Set(levels[0])

      while (assignedBooks.size < books.length) {
        currentLevel++
        levels[currentLevel] = []

        for (const book of books) {
          if (assignedBooks.has(book.id)) continue

          const allPrereqsAssigned = book.prerequisites.every((prereq) => assignedBooks.has(prereq))

          if (allPrereqsAssigned) {
            levels[currentLevel].push(book.id)
            assignedBooks.add(book.id)
          }
        }

        // Break if no new books were assigned to prevent infinite loop
        if (levels[currentLevel].length === 0) break
      }

      // Calculate positions based on levels
      const levelSpacing = 300
      const nodeSpacing = 200

      Object.entries(levels).forEach(([levelStr, bookIds]) => {
        const level = Number.parseInt(levelStr)
        const x = level * levelSpacing

        bookIds.forEach((bookId, index) => {
          const y = index * nodeSpacing - ((bookIds.length - 1) * nodeSpacing) / 2
          positions.set(bookId, { x, y })
        })
      })

      setNodePositions(positions)
    }

    calculatePositions()
  }, [books])

  // Animation loop for connection animations
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => prev + 0.05)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setPan((prev) => ({
          x: prev.x,
          y: prev.y,
        }))
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle mouse down for panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return // Only left mouse button

      // If clicking on canvas (not a node), start panning
      if ((e.target as HTMLElement).classList.contains("canvas")) {
        setIsPanning(true)
        panStartPos.current = {
          x: pan.x,
          y: pan.y,
          clientX: e.clientX,
          clientY: e.clientY,
        }
        document.body.style.cursor = "grabbing"
      }
    },
    [pan],
  )

  // Handle mouse move for panning and dragging
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Handle panning
      if (isPanning && panStartPos.current) {
        const dx = e.clientX - panStartPos.current.clientX
        const dy = e.clientY - panStartPos.current.clientY

        setPan({
          x: panStartPos.current.x + dx,
          y: panStartPos.current.y + dy,
        })
      }

      // Handle node dragging
      if (isDragging && draggedNode && dragStartPos.current) {
        const dx = e.clientX - dragStartPos.current.x
        const dy = e.clientY - dragStartPos.current.y

        const currentPos = nodePositions.get(draggedNode.id)
        if (currentPos) {
          const newPositions = new Map(nodePositions)
          newPositions.set(draggedNode.id, {
            x: currentPos.x + dx / zoom,
            y: currentPos.y + dy / zoom,
          })
          setNodePositions(newPositions)
          dragStartPos.current = { x: e.clientX, y: e.clientY }
        }
      }
    },
    [isPanning, isDragging, draggedNode, nodePositions, zoom],
  )

  // Handle mouse up to end panning/dragging
  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false)
      panStartPos.current = null
      document.body.style.cursor = "auto"
    }

    if (isDragging) {
      setIsDragging(false)
      setDraggedNode(null)
      dragStartPos.current = null
    }
  }, [isPanning, isDragging])

  // Handle wheel for zooming
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()

      const delta = -e.deltaY * 0.001
      const newZoom = Math.max(0.5, Math.min(2, zoom + delta))

      // Calculate zoom point (mouse position)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Calculate new pan position to zoom toward mouse
      const newPan = {
        x: pan.x - (mouseX - pan.x) * (delta / zoom),
        y: pan.y - (mouseY - pan.y) * (delta / zoom),
      }

      setZoom(newZoom)
      setPan(newPan)
    },
    [zoom, pan],
  )

  // Start dragging a node
  const startDragging = useCallback((e: React.MouseEvent, book: BookNode) => {
    e.stopPropagation()
    setIsDragging(true)
    setDraggedNode(book)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  // Handle node click
  const handleNodeClick = useCallback(
    (e: React.MouseEvent, book: BookNode) => {
      e.stopPropagation()
      if (!isDragging) {
        setSelectedBook(book)
        setDetailsOpen(true)
      }
    },
    [isDragging],
  )

  // Generate connection path between books
  const generateConnectionPath = useCallback(
    (sourceId: string, targetId: string): string => {
      const sourcePos = nodePositions.get(sourceId)
      const targetPos = nodePositions.get(targetId)

      if (!sourcePos || !targetPos) return ""

      // Calculate control points for curved path
      const dx = targetPos.x - sourcePos.x
      const dy = targetPos.y - sourcePos.y
      const midX = sourcePos.x + dx / 2

      // Add subtle animation based on time
      const waveAmplitude = 10
      const waveOffset = Math.sin(animationTime + (Number.parseInt(sourceId + targetId, 36) % 10)) * waveAmplitude

      const controlPoint1 = {
        x: midX,
        y: sourcePos.y + waveOffset,
      }

      const controlPoint2 = {
        x: midX,
        y: targetPos.y - waveOffset,
      }

      return `M ${sourcePos.x + 110} ${sourcePos.y} 
            C ${controlPoint1.x} ${controlPoint1.y}, 
              ${controlPoint2.x} ${controlPoint2.y}, 
              ${targetPos.x - 10} ${targetPos.y}`
    },
    [nodePositions, animationTime],
  )

  // Get all connections between books
  const getConnections = useCallback(() => {
    const connections: { source: string; target: string; id: string }[] = []

    books.forEach((book) => {
      book.prerequisites.forEach((prereqId) => {
        connections.push({
          source: prereqId,
          target: book.id,
          id: `${prereqId}-${book.id}`,
        })
      })
    })

    return connections
  }, [books])

  // Adjust zoom level
  const adjustZoom = useCallback((delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)))
  }, [])

  // Reset zoom and pan
  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  }, [])

  // Find book by ID
  const getBookById = useCallback(
    (id: string) => {
      return books.find((book) => book.id === id)
    },
    [books],
  )

  // Check if a connection is highlighted
  const isConnectionHighlighted = useCallback(
    (sourceId: string, targetId: string) => {
      const connectionId = `${sourceId}-${targetId}`

      if (hoveredConnection === connectionId) return true

      if (hoveredBook) {
        if (hoveredBook.id === targetId && hoveredBook.prerequisites.includes(sourceId)) {
          return true
        }
      }

      if (selectedBook) {
        if (selectedBook.id === targetId && selectedBook.prerequisites.includes(sourceId)) {
          return true
        }
      }

      return false
    },
    [hoveredConnection, hoveredBook, selectedBook],
  )

  return (
    <div className="w-full h-screen bg-orange-50 overflow-hidden flex flex-col">
      {/* Header with controls */}
      <header className="h-14 bg-white border-b border-orange-200 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-2">
          <Book className="text-orange-500" />
          <h1 className="font-semibold text-lg">Reading Adventure Roadmap</h1>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            <Move className="inline h-4 w-4 mr-1" />
            Drag nodes to rearrange • Pan canvas to navigate
          </p>

          <div className="flex items-center gap-2 border rounded-md p-1">
            <button onClick={() => adjustZoom(-0.1)} className="p-1 hover:bg-orange-100 rounded" aria-label="Zoom out">
              <ZoomOut className="h-4 w-4" />
            </button>

            <span className="text-sm font-medium w-16 text-center">{Math.round(zoom * 100)}%</span>

            <button onClick={() => adjustZoom(0.1)} className="p-1 hover:bg-orange-100 rounded" aria-label="Zoom in">
              <ZoomIn className="h-4 w-4" />
            </button>

            <button onClick={resetView} className="ml-1 px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 rounded">
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Canvas with pan/zoom */}
      <div
        ref={canvasRef}
        className="relative flex-1 overflow-hidden canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: isPanning ? "grabbing" : "default",
        }}
      >
        <div
          className="absolute"
          style={{
            width: `${canvasDimensions.width}px`,
            height: `${canvasDimensions.height}px`,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {/* SVG for animated connections */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            {getConnections().map(({ source, target, id }) => {
              const highlighted = isConnectionHighlighted(source, target)
              return (
                <g
                  key={id}
                  onMouseEnter={() => setHoveredConnection(id)}
                  onMouseLeave={() => setHoveredConnection(null)}
                  className="pointer-events-auto"
                >
                  <path
                    d={generateConnectionPath(source, target)}
                    fill="none"
                    stroke={highlighted ? "rgb(249, 115, 22)" : "rgb(209, 213, 219)"}
                    strokeWidth={highlighted ? 2 : 1.5}
                    strokeDasharray={highlighted ? "none" : "5,5"}
                    className="transition-colors duration-300"
                  />

                  {highlighted && (
                    <>
                      <circle r="4" fill="rgb(249, 115, 22)">
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          path={generateConnectionPath(source, target)}
                        />
                      </circle>
                      <circle r="4" fill="rgb(249, 115, 22)">
                        <animateMotion
                          dur="3s"
                          begin="1.5s"
                          repeatCount="indefinite"
                          path={generateConnectionPath(source, target)}
                        />
                      </circle>
                    </>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Book node components */}
          {books.map((book) => {
            const position = nodePositions.get(book.id)
            if (!position) return null

            const isSelected = selectedBook?.id === book.id
            const isHovered = hoveredBook?.id === book.id
            const isDraggingThis = isDragging && draggedNode?.id === book.id

            return (
              <div
                key={book.id}
                className={`absolute bg-white rounded-lg shadow-md w-[220px] p-3 transition-all duration-300 select-none ${
                  isSelected ? "border-2 border-orange-500" : "border border-gray-200"
                } ${isHovered && !isDraggingThis ? "border-orange-300 scale-[1.05] z-10" : ""} ${
                  isDraggingThis ? "scale-110 shadow-lg z-20" : ""
                }`}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  transition: isDraggingThis ? "none" : "all 0.3s ease",
                }}
                onMouseDown={(e) => startDragging(e, book)}
                onClick={(e) => handleNodeClick(e, book)}
                onMouseEnter={() => setHoveredBook(book)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <div className="flex gap-3">
                  <img
                    src={book.thumbnail || "/placeholder.svg"}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{book.author}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-700">
                      <Star className="h-3 w-3 text-orange-400 mr-1" />
                      <span>{book.average_rating}</span>
                      <span className="mx-1">•</span>
                      <Hash className="h-3 w-3 mr-1" />
                      <span>{book.num_pages} pg</span>
                    </div>
                  </div>
                </div>

                {isDraggingThis && (
                  <div className="absolute -bottom-6 left-0 right-0 text-center text-xs font-medium text-orange-600">
                    Drop to place
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Details panel */}
      <div
        className={`fixed top-14 bottom-0 right-0 w-96 bg-white border-l border-orange-200 shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
          detailsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedBook && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-orange-100">
              <h2 className="font-semibold">Book Details</h2>
              <button
                onClick={() => setDetailsOpen(false)}
                className="p-1 hover:bg-orange-100 rounded-full"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex justify-center mb-4">
                <img
                  src={selectedBook.thumbnail || "/placeholder.svg"}
                  alt={selectedBook.title}
                  className="h-48 object-cover rounded shadow-md"
                />
              </div>

              <h3 className="text-xl font-semibold text-center">{selectedBook.title}</h3>
              {selectedBook.subtitle && (
                <p className="text-sm text-gray-600 text-center mt-1">{selectedBook.subtitle}</p>
              )}

              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm font-medium">Author:</span>
                  <span className="text-sm ml-2">{selectedBook.author}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm font-medium">Published:</span>
                  <span className="text-sm ml-2">{selectedBook.published_year}</span>
                </div>

                <div className="flex items-center">
                  <Book className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm font-medium">Category:</span>
                  <span className="text-sm ml-2">{selectedBook.categories}</span>
                </div>

                <div className="flex items-center">
                  <Hash className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm font-medium">Pages:</span>
                  <span className="text-sm ml-2">{selectedBook.num_pages}</span>
                </div>

                <div className="flex items-center">
                  <Star className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm font-medium">Rating:</span>
                  <span className="text-sm ml-2">{selectedBook.average_rating}/5</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-700">{selectedBook.description}</p>
              </div>

              {selectedBook.prerequisites.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Prerequisites</h4>
                  <div className="space-y-2">
                    {selectedBook.prerequisites.map((prereqId) => {
                      const prereqBook = getBookById(prereqId)
                      if (!prereqBook) return null

                      return (
                        <div
                          key={prereqId}
                          className="flex items-center p-2 bg-orange-50 rounded-md cursor-pointer hover:bg-orange-100"
                          onClick={() => setSelectedBook(prereqBook)}
                        >
                          <img
                            src={prereqBook.thumbnail || "/placeholder.svg"}
                            alt={prereqBook.title}
                            className="w-10 h-14 object-cover rounded mr-3"
                          />
                          <div>
                            <h5 className="text-sm font-medium">{prereqBook.title}</h5>
                            <p className="text-xs text-gray-600">{prereqBook.author}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReadingRoadmap
