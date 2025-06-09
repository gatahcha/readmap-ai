import { BookOpen } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-orange-50" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                readmap.ai
              </span>
            </div>
            <p className="text-gray-600">AI-powered reading journeys</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:bg-clip-text transition-all duration-300">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:bg-clip-text transition-all duration-300">Terms</a>
              <a href="#" className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:bg-clip-text transition-all duration-300">Support</a>
            </div>
          </div>
        </div>
        <div className="border-t border-orange-200 mt-12 pt-8 text-center">
          <p className="text-gray-500">© 2024 readmap.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
