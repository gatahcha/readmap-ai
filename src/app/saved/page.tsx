import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function SavedMapsPage() {
  const savedMaps = [
    { title: "Roadmap #1", isNew: true },
    { title: "Roadmap #2", isNew: false },
    { title: "Roadmap #3", isNew: false },
    { title: "Roadmap #4", isNew: false },
  ]

  return (
    <>
    
    <Header />
    
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">My Saved Maps</h1>

        <div className="space-y-4">
          {savedMaps.map((map, idx) => (
            <div
              key={idx}
              className="transform flex items-center justify-between border border-orange-300 bg-orange-100/40 rounded-xl px-6 py-4 text-left 
              text-orange-600 font-medium shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <span>{map.title}</span>
                {map.isNew && (
                  <span className="text-xs font-semibold px-2 py-1 bg-orange-400 text-white rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" className="text-orange-600">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>

    <Footer />
    </>
  )
}


