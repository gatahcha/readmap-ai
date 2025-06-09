// src/app/page.tsx
import { bookPipeline } from "@/book/bookPipeline"
import { bookNode } from "@/book/bookNode"

import Header          from "@/components/layout/Header"
import Footer         from "@/components/layout/Footer"

import HeroSection      from "@/components/sections/HeroSection"
import FeaturesSection  from "@/components/sections/FeaturesSection"
import HelpSection      from "@/components/sections/HelpSection"
import CTASection       from "@/components/sections/CTASection"
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
    <>
      <Header />

      <main className="space-y-24">
        <HeroSection initialQuery={query} finalResponse={finalResponse} />
        {books.length > 0 && <ReadingRoadmapSection books={books} />}
        <FeaturesSection />
        <HelpSection />
        <CTASection />
      </main>

      <Footer />
    </>
  )
}