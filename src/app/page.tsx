// src/app/page.tsx (Server Component)
import { bookPipeline } from "@/book/bookPipeline"
import { BookNode } from "@/book/bookNode"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/sections/HeroSection"
import { RoadmapSection } from "@/components/sections/RoadmapSection"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
      <Header />

      <div className="flex-1">
        <main>
          <HeroSection
            initialQuery={query}
            finalResponse={finalResponse}
          />
        </main>

        <RoadmapSection books={books} />
      </div>

      <Footer />
    </div>
  )
}