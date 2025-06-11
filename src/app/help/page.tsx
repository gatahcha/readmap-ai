// src/app/help/page.tsx
"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HelpSection from "@/components/sections/HelpSection"
import { NetworkBackground } from "@/components/NetworkBackground"

export default function HelpPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* 1) Animated network canvas */}
      <NetworkBackground className="absolute inset-0 z-0" />

      {/* 2) Static light-gold overlay + pulsing blobs */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 via-amber-100/30 to-yellow-100/30 pointer-events-none" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-1000 pointer-events-none" />
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000 pointer-events-none" />

      {/* 3) Header */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* 4) Main help content */}
      <main className="relative z-10 pt-16 pb-24">
        <div className="container mx-auto px-6">
          <HelpSection />
        </div>
      </main>

      {/* 5) Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
