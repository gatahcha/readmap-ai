import Link from "next/link"
import { BookOpen, Facebook, Linkedin, Youtube, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="pt-16 pb-6 relative bg-[#FFFAF1]">
      {/* if you still want a subtle gradient, update all stops to your new color */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFFAF1] via-[#FFFAF1] to-[#FFFAF1]"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:items-start">
          {/* Left Section */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-orange-50" />
              </div>
              <span className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                readmap.ai
              </span>
            </div>
            <p className="text-gray-600">AI-powered reading journeys</p>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section - Contact Us */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Us:</h3>
            <div className="flex justify-center md:justify-end gap-4 mt-2">
              <a href="#" aria-label="Facebook" className="text-gray-800 hover:text-orange-600">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-800 hover:text-orange-600">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-800 hover:text-orange-600">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-800 hover:text-orange-600">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-200 mt-12 pt-8 text-center">
          <p className="text-gray-500">© 2025 readmap.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}