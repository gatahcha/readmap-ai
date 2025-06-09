"use client"

import { useState } from "react"
import { BookOpen, HelpCircle, Mail, MessageCircle, Phone, Search, Target, ChevronRight, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function HelpSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

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
        "We have over 50,000 carefully curated books across 500+ topics including business, science, technology, history, philosophy, self-improvement, fiction, and more. Our team continuously adds new releases and classic works to ensure comprehensive coverage.",
    },
    {
      question: "Is readmap.ai free to use?",
      answer:
        "We offer a free tier that includes basic roadmap creation and up to 3 personalized reading lists. Our premium plans provide unlimited roadmaps, advanced AI features, progress tracking, and priority support starting at $9.99/month.",
    },
    {
      question: "How do I track my reading progress?",
      answer:
        "You can mark books as 'reading', 'completed', or 'want to read'. Our progress tracker shows your completion percentage, reading streaks, and suggests when to move to the next book. You can also add personal notes and ratings.",
    },
    {
      question: "Can I share my reading roadmaps with others?",
      answer:
        "Yes! You can share your roadmaps publicly or with specific people. This is great for book clubs, study groups, or recommending learning paths to friends and colleagues.",
    },
  ]

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
      <div className="absolute top-10 right-20 w-64 h-64 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              Help & Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Help search */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for help topics..."
                className="w-full h-14 pl-12 pr-6 text-lg border-2 border-orange-200/50 bg-orange-50/80 backdrop-blur-sm rounded-2xl focus:border-orange-500 focus:ring-0 shadow-xl"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Help categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "Getting Started",
                description: "Learn how to create your first reading roadmap and navigate the platform",
                icon: BookOpen,
                gradient: "from-orange-400 to-red-400",
                bg: "from-orange-50 to-red-50",
              },
              {
                title: "Using Features",
                description: "Discover advanced features and tips to optimize your reading experience",
                icon: Target,
                gradient: "from-amber-400 to-orange-400",
                bg: "from-amber-50 to-orange-50",
              },
              {
                title: "Troubleshooting",
                description: "Solve common issues and technical problems quickly",
                icon: HelpCircle,
                gradient: "from-yellow-400 to-amber-400",
                bg: "from-yellow-50 to-amber-50",
              },
            ].map(({ title, description, icon: Icon, gradient, bg }, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${bg} border border-orange-200 rounded-2xl p-6 group hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-6 h-6 text-orange-50" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center mb-4">{description}</p>
                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mb-20">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h3>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-orange-100/50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-orange-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-orange-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Options */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                {
                  title: "Live Chat",
                  icon: MessageCircle,
                  desc: "Get instant help from our support team",
                  button: <Button size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-orange-50">Start Chat</Button>
                },
                {
                  title: "Email Support",
                  icon: Mail,
                  desc: "Send us a detailed message",
                  button: <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">Send Email</Button>
                },
                {
                  title: "Phone Support",
                  icon: Phone,
                  desc: "Call us during business hours",
                  button: <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">Call Now</Button>
                }
              ].map(({ title, icon: Icon, desc, button }, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-orange-50" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{desc}</p>
                  {button}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
