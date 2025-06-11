// src/app/about/page.tsx
"use client"

import { BookOpen, ListChecks, RefreshCcw } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { NetworkBackground } from "@/components/NetworkBackground"

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
      {/* Ensure Header is on top */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Background decor – pointer-events-none so nav stays clickable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-100/30 via-amber-100/30 to-yellow-100/30" />
      <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" />
      <div className="pointer-events-none absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-1000" />
      <div className="pointer-events-none absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000" />
      
      {/* Network canvas background */}
      <NetworkBackground className="absolute inset-0 z-0" />


      <main className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe that the right book at the right time can transform
              your life. Our AI-powered platform creates personalized reading
              journeys that adapt to your goals, interests, and learning style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
            {/* What makes us different */}
            <div className="md:col-span-3">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                What makes us different?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: <BookOpen className="w-6 h-6 text-orange-500 mb-3" />,
                    title: "Curated Quality",
                    desc: "Every book in our database is carefully evaluated for quality, relevance, and educational value.",
                  },
                  {
                    icon: <ListChecks className="w-6 h-6 text-orange-500 mb-3" />,
                    title: "Smart Sequencing",
                    desc: "Our AI understands prerequisite knowledge and creates logical learning progressions.",
                  },
                  {
                    icon: <RefreshCcw className="w-6 h-6 text-orange-500 mb-3" />,
                    title: "Adaptive Learning",
                    desc: "Your reading map evolves based on your progress, interests, and feedback.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="
                      bg-gradient-to-br from-orange-50 to-orange-100
                      border border-orange-200
                      rounded-2xl p-6 text-center shadow-sm
                      hover:scale-105 hover:shadow-lg
                      transition-all duration-300
                      backdrop-blur-sm
                    "
                  >
                    {item.icon}
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission */}
            <div className="md:col-span-1 mt-12 md:mt-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                In a world overflowing with information, finding the right books
                to read can be overwhelming. We're here to cut through the noise
                and create clear, personalized pathways to knowledge.
              </p>
              <p className="text-gray-600 text-sm">
                Whether you're looking to master a new skill, explore a
                fascinating topic, or simply discover your next great read, our
                AI understands your unique learning journey and recommends
                books that build upon each other progressively.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
