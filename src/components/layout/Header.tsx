"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Menu } from "lucide-react"

export default function Header() {
  return (
    <header className="backdrop-blur-md bg-orange-50/90 border-b border-orange-200/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-orange-50" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            readmap.ai
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            About
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Help
          </a>
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-orange-50 px-6 shadow-lg"
          >
            Sign In
          </Button>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}