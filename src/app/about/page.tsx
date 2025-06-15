// src/app/about/page.tsx
"use client"

import { BookOpen, ListChecks, RefreshCcw, Users} from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { NetworkBackground } from "@/components/NetworkBackground"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Callixta Fidelia Cahyaningrum",
      linkedin: "https://www.linkedin.com/in/callixta-fidelia-cahyaningrum/",
      github: "https://github.com/callixtafidelia"
    },
    {
      name: "Syifa Nadira Nurul Izzah",
      linkedin: "https://www.linkedin.com/in/syifa-izzah/",
      github: "https://github.com/syifandh"
    },
    {
      name: "Alifais Farrel Ramdhani",
      linkedin: "https://www.linkedin.com/in/alifaisfarrelramdhani/",
      github: "https://github.com/FarrelRamdhani"
    },
    {
      name: "Charisma Rusdiyanto",
      linkedin: "https://www.linkedin.com/in/charisma-pramudya-286ab3230/",
      github: "https://github.com/gatahcha"
    }
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden flex flex-col">
      {/* Ensure Header is on top */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Background decor – pointer-events-none so nav stays clickable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-100/30 via-amber-100/30 to-yellow-100/30" />
      <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" />
      <div className="pointer-events-none absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-1000" />
      <div className="pointer-events-none absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000" />
      
      {/* Network canvas background */}
      <NetworkBackground className="absolute inset-0 z-0" />

      <main className="relative z-10 py-24 flex-1">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe that the right book at the right time can transform
              your life. Our AI-powered platform creates personalized reading
              journeys that adapt to your goals, interests, and learning style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start mb-16">
            {/* What makes us different */}
            <div className="md:col-span-3">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                What makes us different?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: <BookOpen className="w-6 h-6 text-orange-500 mb-3" />,
                    title: "Curated Quality",
                    desc: "Every book in our database is carefully evaluated for quality, relevance, and educational value.",
                  },
                  {
                    icon: <ListChecks className="w-6 h-6 text-orange-500 mb-3" />,
                    title: "Smart Sequencing",
                    desc: "Our AI understands prerequisite knowledge and creates logical learning progressions.",
                  },
                  {
                    icon: <RefreshCcw className="w-6 h-6 text-orange-500 mb-3" />,
                    title: "Adaptive Learning",
                    desc: "Your reading map evolves based on your progress, interests, and feedback.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="
                      bg-gradient-to-br from-orange-50 to-orange-100
                      border border-orange-200
                      rounded-2xl p-6 text-center shadow-sm
                      hover:scale-105 hover:shadow-lg
                      transition-all duration-300
                      backdrop-blur-sm
                    "
                  >
                    {item.icon}
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission */}
            <div className="md:col-span-1 mt-12 md:mt-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                In a world overflowing with information, finding the right books
                to read can be overwhelming. We&apos;re here to cut through the noise
                and create clear, personalized pathways to knowledge.
              </p>
              <p className="text-gray-600 text-sm">
                Whether you&apos;re looking to master a new skill, explore a
                fascinating topic, or simply discover your next great read, our
                AI understands your unique learning journey and recommends
                books that build upon each other progressively.
              </p>
            </div>
          </div>

          {/* Hackathon Section */}
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 border border-orange-200 rounded-2xl p-8 shadow-xl backdrop-blur-sm overflow-hidden">
              {/* Futuristic Background Elements */}
              <div className="absolute inset-0 opacity-10">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent" 
                     style={{
                       backgroundImage: `
                         linear-gradient(90deg, rgba(251,146,60,0.1) 1px, transparent 1px),
                         linear-gradient(180deg, rgba(251,146,60,0.1) 1px, transparent 1px)
                       `,
                       backgroundSize: '40px 40px'
                     }}>
                </div>
                
                {/* Geometric Shapes */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-amber-300 to-orange-400 rotate-45 opacity-15 blur-lg"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg rotate-12 opacity-10 blur-md"></div>
                
                {/* Circuit-like Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,20 Q25,10 50,20 T100,20" stroke="url(#orange-gradient)" strokeWidth="0.5" fill="none"/>
                  <path d="M0,50 Q25,40 50,50 T100,50" stroke="url(#orange-gradient)" strokeWidth="0.3" fill="none"/>
                  <path d="M0,80 Q25,70 50,80 T100,80" stroke="url(#orange-gradient)" strokeWidth="0.4" fill="none"/>
                  <defs>
                    <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fb923c" stopOpacity="0"/>
                      <stop offset="50%" stopColor="#f97316" stopOpacity="1"/>
                      <stop offset="100%" stopColor="#fb923c" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <Users className="w-12 h-12 text-orange-600 mx-auto mb-4 drop-shadow-lg" />
                    <div className="absolute inset-0 w-12 h-12 bg-orange-400 rounded-full blur-xl opacity-30 mx-auto"></div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 drop-shadow-sm">
                    Hackathon Project
                  </h2>
                  <p className="text-lg text-gray-700 mb-2">
                    This project was submitted to
                  </p>
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                    &quot;AI in Action: Innovate Together&quot;
                  </h3>
                  <p className="text-lg text-gray-700">
                    A Multi-Partner Google Cloud Hackathon
                  </p>
                </div>

                <div className="relative">
                  {/* Motion Background for Members */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    {/* Floating particles */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-300 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
                    <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-amber-400 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
                    <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-orange-400 rounded-full opacity-70 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}></div>
                    <div className="absolute top-1/6 right-1/3 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-40 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4.5s'}}></div>
                    
                    {/* Moving gradient waves */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-orange-200 to-transparent transform -skew-y-12 animate-pulse" style={{animationDuration: '4s'}}></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-amber-200 to-transparent transform skew-y-12 animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {teamMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-200 hover:scale-105 group overflow-hidden"
                      >
                        {/* Card Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10">
                          <h4 className="font-semibold text-lg text-gray-900 mb-4 group-hover:text-orange-800 transition-colors">
                            {member.name}
                          </h4>
                          <div className="flex justify-center gap-4">
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                              title="LinkedIn Profile"
                            >
                              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                              title="GitHub Profile"
                            >
                              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}