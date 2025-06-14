"use client"

import type { BookNode } from "@/book/bookNode"
import { Button } from "@/components/ui/button"
import { X, Star } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface BookDetailPanelProps {
  book: BookNode | null
  isOpen: boolean
  onClose: () => void
  showOnLeft?: boolean
}

export function BookDetailPanel({ book, isOpen, onClose, showOnLeft = false }: BookDetailPanelProps) {
  const [imageError, setImageError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
      
      // Prevent background scrolling on mobile
      if (isMobile) {
        document.body.style.overflow = 'hidden'
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      
      // Restore scrolling
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, isMobile])

  if (!isOpen || !book) return null

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Mobile: Full screen overlay
  if (isMobile) {
    return (
      <>
        {/* Full screen backdrop */}
        <div className="fixed inset-0 bg-black/50 z-50" />
        
        {/* Full screen panel */}
        <div 
          ref={panelRef}
          className="fixed inset-0 bg-white z-50 overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Mobile header - sticky */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-gray-900 truncate pr-4">{book.title}</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile content */}
          <div className="p-4 pb-8">
            {/* Book Cover - centered and larger on mobile */}
            <div className="mb-6 text-center">
              {!imageError && book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="rounded-lg shadow-md mx-auto object-cover"
                  style={{ maxWidth: '200px', maxHeight: '280px' }}
                  onError={handleImageError}
                />
              ) : (
                <div className="w-[160px] h-[220px] bg-gray-200 rounded-lg shadow-md mx-auto flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-5xl mb-2">📚</div>
                    <div className="text-sm">No Image</div>
                  </div>
                </div>
              )}
            </div>

            {/* Book Info - optimized for mobile */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Author</h3>
                <p className="text-gray-700">{book.author}</p>
              </div>

              {book.subtitle && (
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Subtitle</h3>
                  <p className="text-gray-700 text-sm">{book.subtitle}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Categories</h3>
                <p className="text-gray-700 text-sm">{book.categories}</p>
              </div>

              {/* Rating and Pages in a row on mobile */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Rating</h3>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {renderStars(book.average_rating)}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">({book.average_rating.toFixed(1)})</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Pages</h3>
                  <p className="text-gray-700">{book.num_pages}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Published</h3>
                <p className="text-gray-700">{book.published_year}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm">ISBN</h3>
                <p className="text-gray-700 text-xs">
                  ISBN-13: {book.isbn13}
                  <br />
                  ISBN-10: {book.isbn10}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{book.description}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Tablet and Desktop: Side panel
  const positionClasses = showOnLeft 
    ? "fixed inset-y-0 left-0 border-r"
    : "fixed inset-y-0 right-0 border-l"

  const panelWidth = isTablet ? "w-80" : "w-96"

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/10 z-40" />
      
      {/* Side Panel */}
      <div 
        ref={panelRef}
        className={`${positionClasses} ${panelWidth} bg-white shadow-2xl border-gray-200 z-50 overflow-y-auto`}
      >
        <div className={`${isTablet ? 'p-4' : 'p-6'}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h2 className={`${isTablet ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 pr-4`}>
              {book.title}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Book Cover */}
          <div className="mb-6">
            {!imageError && book.thumbnail ? (
              <img
                src={book.thumbnail}
                alt={book.title}
                width={isTablet ? 120 : 150}
                height={isTablet ? 160 : 200}
                className="rounded-lg shadow-md mx-auto object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className={`${isTablet ? 'w-[120px] h-[160px]' : 'w-[150px] h-[200px]'} bg-gray-200 rounded-lg shadow-md mx-auto flex items-center justify-center`}>
                <div className="text-center text-gray-500">
                  <div className={`${isTablet ? 'text-3xl' : 'text-4xl'} mb-2`}>📚</div>
                  <div className="text-sm">No Image</div>
                </div>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Author</h3>
              <p className={`text-gray-700 ${isTablet ? 'text-sm' : ''}`}>{book.author}</p>
            </div>

            {book.subtitle && (
              <div>
                <h3 className="font-semibold text-gray-900">Subtitle</h3>
                <p className={`text-gray-700 ${isTablet ? 'text-sm' : ''}`}>{book.subtitle}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900">Categories</h3>
              <p className={`text-gray-700 ${isTablet ? 'text-sm' : ''}`}>{book.categories}</p>
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
            <p className={`text-gray-700 leading-relaxed ${isTablet ? 'text-sm' : 'text-sm'}`}>
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}