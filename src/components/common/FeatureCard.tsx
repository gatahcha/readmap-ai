import React from "react"
import type { LucideProps } from "lucide-react"


interface FeatureCardProps {
  icon: React.ComponentType<LucideProps>
  title: string
  description: string
  gradient: string
  bgGradient: string
}

export default function FeatureCard({ icon: Icon, title, description, gradient, bgGradient }: FeatureCardProps) {
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