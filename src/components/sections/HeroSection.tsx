import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Save } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  initialQuery: string
  finalResponse: string
}

export default function HeroSection({ initialQuery, finalResponse }: HeroSectionProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 via-amber-100/30 to-yellow-100/30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-orange-200/50 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                AI-Powered Reading Assistant
              </span>
            </div>
          </div>

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
            <div className="relative">
              <Input
                type="text"
                defaultValue={initialQuery}
                placeholder="What would you like to learn about?"
                className="w-full h-14 pl-6 pr-32 text-lg border-2 border-orange-200/50 bg-orange-50/80 backdrop-blur-sm rounded-2xl focus:border-orange-500 focus:ring-0 shadow-xl"
              />
              <Button
                size="lg"
                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl px-8 shadow-lg text-orange-50"
              >
                Generate
              </Button>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {[
              { topic: "Trending Topic 1", gradient: "from-orange-400 to-red-400" },
              { topic: "Trending Topic 2", gradient: "from-amber-400 to-orange-400" },
              { topic: "Trending Topic 3", gradient: "from-yellow-400 to-amber-400" },
            ].map(({ topic, gradient }) => (
              <button
                key={topic}
                className={`px-4 py-2 bg-gradient-to-r ${gradient} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm border border-orange-200/30 text-gray-700 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Saved Maps Button */}
          <Link href="/saved">
            <Button
              variant="ghost"
              className="transform border-2 border-orange-200/50 bg-orange-50/30 backdrop-blur-sm 
              hover:bg-orange-50/50 hover:border-orange-500/50 hover:text-orange-600 
              hover:scale-105 hover:shadow-lg px-6 py-3 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-orange-500" />
                View Saved Maps
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
