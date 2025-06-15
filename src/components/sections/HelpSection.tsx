// src/components/sections/HelpSection.tsx
"use client"

import { useState } from "react"
import {
  BookOpen,
  Target,
  HelpCircle,
} from "lucide-react"
import FAQItem from "@/components/common/FAQItem"
import HelpCategoryCard from "@/components/common/HelpCategoryCard"

export default function HelpSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const toggleFaq = (index: number) =>
    setOpenFaq(openFaq === index ? null : index)

  const faqs = [
    {
      question: "How does readmap.ai create personalized reading recommendations?",
      answer:
        "Our AI analyzes your goals, interests, current knowledge level, and reading preferences to create a customized sequence of books. We consider factors like difficulty progression, topic relevance, and learning objectives to ensure each recommendation builds upon the previous one.",
    },
    {
      question: "Can I modify my reading roadmap after it's created?",
      answer:
        "Your reading roadmap is fully customizable. You can add or remove books, change the order, mark books as completed, and even request alternative recommendations. The AI learns from your modifications to improve future suggestions.",
    },
    {
      question: "What types of books are included in your database?",
      answer:
        "We have over 6,800 carefully curated books across 100+ topics including business, science, technology, history, philosophy, self-improvement, fiction, and more. Our team continuously adds new releases and classic works to ensure comprehensive coverage.",
    },
    {
      question: "Is readmap.ai free to use?",
      answer:
        "readmap.ai is publicly available for everyone to use and explore.",
    },
    {
      question: "How do I track my reading progress?",
      answer:
        "Currently we are still developing this webapp. You can take screenshots and record it on your own to track your progress.",
    },
    {
      question: "Can I share my reading roadmaps with others?",
      answer:
        "Yes! You can share your roadmaps publicly or with specific people. This is great for book clubs, study groups, or recommending learning paths to friends and colleagues.",
    },
  ]

  const helpCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description:
        "Learn how to create your first reading roadmap and navigate the platform",
      gradient: "from-orange-400 to-red-400",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      icon: Target,
      title: "Using Features",
      description:
        "Discover advanced features and tips to optimize your reading experience",
      gradient: "from-amber-400 to-orange-400",
      bgGradient: "from-amber-50 to-orange-50",
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "Solve common issues and technical problems quickly",
      gradient: "from-yellow-400 to-amber-400",
      bgGradient: "from-yellow-50 to-amber-50",
    },
  ]

  return (
    <section className="py-24 relative">
      {/* Hero‐style pulsing circles */}
      <div className="pointer-events-none absolute top-10 right-20 w-64 h-64 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" />
      <div className="pointer-events-none absolute bottom-10 left-20 w-80 h-80 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-1000" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Help & Support
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions or get in touch with our support team. We&apos;re here to help you make the
            most of your reading journey.
          </p>
        </div>

        {/* Help Categories */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            How readmap.ai works?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {helpCategories.map((category, index) => (
              <HelpCategoryCard key={index} {...category} />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                {...faq}
                isOpen={openFaq === index}
                onToggle={() => toggleFaq(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}