"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Save, Search } from "lucide-react"
import { NetworkBackground } from "@/components/NetworkBackground"

interface HeroSectionProps {
  initialQuery: string
  finalResponse: string
}

export default function HeroSection({
  initialQuery,
  finalResponse,
}: HeroSectionProps) {
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
    defaultValue={initialQuery}
    placeholder="What would you like to learn about?"
    className="
      w-full h-14 pl-6 pr-32 text-lg
      bg-white                      /* fill = #FFFFFF */
      text-[#B0B3BF]                /* input text = #B0B3BF */
      placeholder-[#B0B3BF]         /* placeholder text = #B0B3BF */
      border-2 border-orange-200/50
      rounded-2xl focus:border-orange-500 focus:ring-0
      shadow-xl
    "
  />
  <Button
    size="lg"
    className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl px-8 shadow-lg text-orange-50"
  >
    Generate
  </Button>
</div>

        {/* Trending Topics */}
        <div className="flex flex-wrap justify-center gap-6 mt-3">
          {["#1", "#2", "#3"].map((item) => (
            <Button
              key={item}
              variant="outline"
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
                <span>trending topic {item}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* View Saved Maps */}
        <div className="flex justify-center mt-8">
          <Link href="/saved">
            <Button
              size="lg"
              className="
                bg-gradient-to-r from-orange-500 to-orange-600
                hover:from-orange-600 hover:to-orange-700
                rounded-xl px-8 py-2
                shadow-lg text-orange-50
                transform transition-all duration-300
                hover:scale-105
              "
            >
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-orange-50" />
                View Saved Maps
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
