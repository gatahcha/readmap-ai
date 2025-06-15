"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Search, Loader2, X } from "lucide-react"
import { NetworkBackground } from "@/components/NetworkBackground"
import { BookNode } from "@/book/bookNode"
// Import the predefined examples
import { getExampleByTopic, trendingTopics } from "@/data/examples"

interface HeroSectionProps {
  onSearchResults?: (results: { roadmapTitle: string; books: BookNode[] }) => void
}

export default function HeroSection({ onSearchResults }: HeroSectionProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [roadmapTitle, setRoadmapTitle] = useState("")
  const [showInvalidInputPopup, setShowInvalidInputPopup] = useState(false)
  const [showServerBusyPopup, setShowServerBusyPopup] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!response.ok) {
        setShowServerBusyPopup(true)
        return
      }

      const result = await response.json()
      
      // Check if the response indicates invalid input
      if (result.roadmapTitle === "Invalid Input") {
        setShowInvalidInputPopup(true)
        setRoadmapTitle("")
        return
      }
      
      setRoadmapTitle(result.roadmapTitle)
      
      // Pass results to parent component only if input is valid
      if (onSearchResults) {
        onSearchResults(result)
        // Clear the hero response after passing to parent
        setRoadmapTitle("")
      }
    } catch (error) {
      console.error('Search error:', error)
      setShowServerBusyPopup(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Updated function to load predefined examples
  const handleTrendingClick = (topic: string) => {
    setQuery(topic)
    
    // Check if it's a predefined topic
    const predefinedExample = getExampleByTopic(topic)
    
    if (predefinedExample) {
      // Load predefined data instantly
      setRoadmapTitle(predefinedExample.roadmapTitle)
      
      // Pass results to parent component
      if (onSearchResults) {
        onSearchResults({
          roadmapTitle: predefinedExample.roadmapTitle,
          books: predefinedExample.books
        })
        // Clear the hero response after passing to parent
        setRoadmapTitle("")
      }
    }
    // If no predefined example, user can still click Generate to search via API
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* 1) Network canvas background */}
      <NetworkBackground className="absolute inset-0 z-0" />

      {/* 2) Static gradient blobs (no more animate-pulse) */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 via-amber-100/30 to-yellow-100/30" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-60" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60" />
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-40" />

      {/* 3) Your content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Sparkles badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-orange-200/50 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              AI-Powered Reading Assistant
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Your AI Book
          </span>
          <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent block">
            Mentor
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Create personalized reading roadmaps tailored to your goals and interests
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What would you like to learn about?"
            disabled={isLoading}
            className="
              w-full h-14 pl-6 pr-32 text-lg
              bg-white
              text-[#B0B3BF]
              placeholder-[#B0B3BF]
              border-2 border-orange-200/50
              rounded-2xl focus:border-orange-500 focus:ring-0
              shadow-xl
              disabled:opacity-50
            "
          />
          <Button
            size="lg"
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl px-8 shadow-lg text-orange-50 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </div>

        {/* Search Results */}
        {roadmapTitle && (
          <div className="max-w-4xl mx-auto mb-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200/50 shadow-lg">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{roadmapTitle}</p>
          </div>
        )}

        {/* Trending Topics */}
        <div className="flex flex-wrap justify-center gap-6 mt-3">
          {trendingTopics.map((topic) => (
            <Button
              key={topic}
              variant="outline"
              onClick={() => handleTrendingClick(topic)}
              className="
                transform transition-all duration-300
                border-[1.5px] border-[#F17503]
                text-[#F17503]
                bg-[#FBE5C9]
                hover:bg-[#FBE5C9]
                hover:text-[#F17503]
                hover:border-[#F17503]
                rounded-full px-6 py-1
                shadow-md font-medium text-sm tracking-wide
                hover:scale-105 hover:shadow-lg
              "
            >
              <div className="flex items-center justify-center">
                <Search className="w-3 h-3 text-[#F17503] mr-2" />
                <span>{topic}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Invalid Input Popup */}
      {showInvalidInputPopup && (
        <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <button
              onClick={() => setShowInvalidInputPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Invalid Input
              </h3>
              
              <p className="text-gray-600 mb-6">
                Please enter a valid topic or question to generate your reading roadmap. Try being more specific about what you'd like to learn.
              </p>
              
              <Button
                onClick={() => setShowInvalidInputPopup(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl py-2 shadow-lg"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Server Busy Popup */}
      {showServerBusyPopup && (
        <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <button
              onClick={() => setShowServerBusyPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Server Currently Busy
              </h3>
              
              <p className="text-gray-600 mb-6">
                Our server is currently experiencing high traffic. Please try again in a few moments.
              </p>
              
              <Button
                onClick={() => setShowServerBusyPopup(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl py-2 shadow-lg"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}