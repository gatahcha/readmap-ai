import { BookOpen, ListChecks, RefreshCcw } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function AboutPage() {
  return (
    <>
    <Header />

    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 -z-10"></div>
      <div className="absolute top-10 right-20 w-64 h-64 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe that the right book at the right time can transform your life. Our AI-powered platform creates personalized reading journeys that adapt to your goals, interests, and learning style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          {/* What makes us different */}
          <div className="md:col-span-3">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">What makes us different?</h2>
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
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 text-center shadow-sm
                  hover:scale-105 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                >
                  {item.icon}
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission */}
          <div className="md:col-span-1 mt-12 md:mt-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our mission</h2>
            <p className="text-gray-600 text-sm mb-4">
              In a world overflowing with information, finding the right books to read can be overwhelming. We're here to cut through the noise and create clear, personalized pathways to knowledge.
            </p>
            <p className="text-gray-600 text-sm">
              Whether you're looking to master a new skill, explore a fascinating topic, or simply discover your next great read, our AI understands your unique learning journey and recommends books that build upon each other progressively.
            </p>
          </div>
        </div>
      </div>
    </section>

  <Footer />

  </>
)}
