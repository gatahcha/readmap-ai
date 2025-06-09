import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface HelpCategoryCardProps {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  bg: string
  buttonLabel?: string
}

export default function HelpCategoryCard({
  title,
  description,
  icon: Icon,
  gradient,
  bg,
  buttonLabel = "Learn More",
}: HelpCategoryCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${bg} border border-orange-200 rounded-2xl p-6 group hover:scale-105 transition-all duration-300 cursor-pointer`}
    >
      <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
        <Icon className="w-6 h-6 text-orange-50" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed text-center mb-4">{description}</p>
      <div className="text-center">
        <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
          {buttonLabel}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

