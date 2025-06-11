// src/app/help/page.tsx
"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HelpSection from "@/components/sections/HelpSection"

export default function HelpPage() {
  return (
    <div className="relative min-h-screen bg-[#FEFADE] overflow-hidden">
      {/* Header above all background decor */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Hero‐style pulsing circles (no network animation) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-100/30 via-amber-100/30 to-yellow-100/30" />
      <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" />
      <div className="pointer-events-none absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-1000" />
      <div className="pointer-events-none absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000" />

      <main className="relative z-20 pt-16 pb-24">
        <div className="container mx-auto px-6">
          <HelpSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}

