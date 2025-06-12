"use client"

// src/app/page.tsx
import { bookPipeline } from "@/book/bookPipeline"
import { BookNode } from "@/book/bookNode"
import Header          from "@/components/layout/Header"
import Footer         from "@/components/layout/Footer"

import HeroSection      from "@/components/sections/HeroSection"
import { RoadmapTree } from "@/components/sections/RoadmapTree"
import { useState } from "react"
import { BookDetailPanel } from "@/components/roadmap_components/BookDetailPanel"
import { sampleBooks } from "@/components/SampleBooks"

interface HomeProps {
  searchParams: { query?: string }
}

export default async function Home({ searchParams }: HomeProps) {
  const query = searchParams.query ?? ""
  let finalResponse = ""
  let books: BookNode[] = []

  if (query) {
    try {
      const result = await bookPipeline(query)
      finalResponse = result.finalResponse
      books = result.books
    } catch (err) {
      console.error("Search failed:", err)
    }
  }

  const [selectedBook, setSelectedBook] = useState<BookNode | null>(null)
  const [roadmapGenerated, setRoadmapGenerated] = useState(false)

  const handleBookSelect = (book: BookNode | null) => {
    setSelectedBook(book)
  }

  const handleClosePanel = () => {
    setSelectedBook(null)
  }

  const handleGenerateRoadmap = () => {
    setRoadmapGenerated(true)
  }

   return (
    // <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
    //   <Header />

    //   <main>
    //     <HeroSection
    //       initialQuery={query}
    //       finalResponse={finalResponse}
    //     />
    //   </main>

    //   <Footer />
    // </div>

    <div className="relative">
        <RoadmapTree books={sampleBooks} onBookSelect={handleBookSelect} selectedBook={selectedBook} />

        <BookDetailPanel book={selectedBook} isOpen={!!selectedBook} onClose={handleClosePanel} />
    </div>

  )
}