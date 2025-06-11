// src/app/page.tsx
import { bookPipeline } from "@/book/bookPipeline"
import { bookNode } from "@/book/bookNode"

import Header          from "@/components/layout/Header"
import Footer         from "@/components/layout/Footer"

import HeroSection      from "@/components/sections/HeroSection"
import HelpSection      from "@/components/sections/HelpSection"
import ReadingRoadmapSection from "@/components/sections/ReadingRoadmapSection"

interface HomeProps {
  searchParams: { query?: string }
}

export default async function Home({ searchParams }: HomeProps) {
  const query = searchParams.query ?? ""
  let finalResponse = ""
  let books: bookNode[] = []

  if (query) {
    try {
      const result = await bookPipeline(query)
      finalResponse = result.finalResponse
      books = result.books
    } catch (err) {
      console.error("Search failed:", err)
    }
  }

   return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />

      <main>
        <HeroSection
          initialQuery={query}
          finalResponse={finalResponse}
        />

        {books.length > 0 && (
          <ReadingRoadmapSection books={books} />
        )}
        <HelpSection />
      </main>

      <Footer />
    </div>
  )
}