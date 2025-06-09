"use client"

import { ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"

interface FAQItemProps {
  question: string
  answer: string
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-orange-100/50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        {open ? (
          <ChevronDown className="w-5 h-5 text-orange-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-orange-500" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
