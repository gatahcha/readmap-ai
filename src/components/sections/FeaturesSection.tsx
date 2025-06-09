import { Search, Target, TrendingUp } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: "Tell us your goal",
      description: "Share what you want to learn or explore, and we'll understand your interests",
      gradient: "from-orange-400 to-red-400",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      icon: Target,
      title: "Get your roadmap",
      description: "Receive a curated sequence of books designed to build your knowledge progressively",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
    {
      icon: TrendingUp,
      title: "Track progress",
      description: "Monitor your reading journey and discover new paths as you grow",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
    },
  ]

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/90 to-amber-50/90 backdrop-blur-sm"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to create your personalized reading journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map(({ icon: Icon, title, description, gradient, bgGradient }, index) => (
            <div key={index} className="text-center group">
              <div
                className={`bg-gradient-to-br ${bgGradient} p-8 rounded-3xl mb-6 group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-orange-50" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
