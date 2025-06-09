"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Menu } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Help", href: "/help" },
  ]

  return (
    <header className="backdrop-blur-md bg-red-50/90 border-b border-orange-200/50">
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
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-gray-600 hover:text-gray-900 transition-colors ${
                pathname === href ? "font-semibold text-gray-900" : ""
              }`}
            >
              {label}
            </Link>
          ))}
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
