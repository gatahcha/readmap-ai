// src/components/sections/ReadingRoadmapSection.tsx

import { bookNode } from "@/book/bookNode"

interface ReadingRoadmapSectionProps {                      
  books: bookNode[]
}

export default function ReadingRoadmapSection({ books }: ReadingRoadmapSectionProps) {
  return (
    <section className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Personalized Roadmap</h2>

      <ol className="space-y-6 max-w-3xl mx-auto">
        {books.map((book, i) => (
          <li key={book.id ?? i} className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-orange-700 mb-2">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.description ?? "No description provided."}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
