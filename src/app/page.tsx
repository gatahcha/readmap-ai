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
    setBooks(results.books)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
      <Header />

      <div className="flex-1">
        <main>
          <HeroSection onSearchResults={handleSearchResults} />
        </main>

        <RoadmapSection books={books} />
      </div>

      <Footer />
    </div>
  )
}