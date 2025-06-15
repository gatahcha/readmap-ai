// src/app/page.tsx
"use client"

import { useState } from "react"
import { BookNode } from "@/book/bookNode"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/sections/HeroSection"
import { RoadmapSection } from "@/components/sections/RoadmapSection"

export default function Home() {
  const [books, setBooks] = useState<BookNode[]>([])

  const handleSearchResults = (results: { finalResponse: string; books: BookNode[] }) => {
    console.log('🏠 Page received results! Books count:', results.books.length)
    setBooks(results.books)
    console.log('🏠 Books state updated')
  }

  console.log('🏠 Current books in state:', books.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
      <Header />

      <div className="flex-1">
        <main>
          <HeroSection onSearchResults={handleSearchResults} />
        </main>

        {/* Debug info */}
        {books.length > 0 && (
          <div style={{ padding: '20px', background: 'yellow', margin: '20px' }}>
            <strong>DEBUG: Books loaded! Count: {books.length}</strong>
          </div>
        )}

        <RoadmapSection books={books} />
      </div>

      <Footer />
    </div>
  )
}