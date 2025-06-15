import type { LucideProps } from "lucide-react"
import React from "react"

interface HelpCategoryCardProps {
  icon: React.ComponentType<LucideProps>
  title: string
  description: string
  gradient: string
  bgGradient: string
}

export default function HelpCategoryCard({
  icon: Icon,
  title,
  description,
  gradient,
  bgGradient
}: HelpCategoryCardProps) {
  return (
    <div className={`bg-gradient-to-br ${bgGradient} border border-orange-200 rounded-2xl p-6 group hover:scale-105 transition-all duration-300 cursor-pointer`}>
      <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
        <Icon className="w-6 h-6 text-orange-50" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed text-center mb-4">
        {description}
      </p>
    </div>
  )
}