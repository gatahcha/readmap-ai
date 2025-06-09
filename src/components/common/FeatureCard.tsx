import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  bgGradient: string
}

export default function FeatureCard({ title, description, icon: Icon, gradient, bgGradient }: FeatureCardProps) {
  return (
    <div className="text-center group">
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
  )
}
