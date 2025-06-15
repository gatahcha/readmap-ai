// app/terms/page.tsx
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { NetworkBackground } from "@/components/NetworkBackground"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
      <Header />
      
      <main className="flex-1 relative overflow-hidden">
        {/* Hero-style background */}
        <NetworkBackground className="absolute inset-0 z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 via-amber-100/30 to-yellow-100/30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-60" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-40" />
        
        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Terms of
              </span>
              <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent block">
                Service
              </span>
            </h1>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200/50 shadow-lg p-8 md:p-12">
              <p className="text-sm text-gray-500 mb-8">
                <strong>Last Updated:</strong> December 14, 2024
              </p>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using ReadMap AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
                  <p>
                    ReadMap AI is an AI-powered reading assistant that provides personalized book recommendations and creates learning roadmaps tailored to users' goals and interests. Our service uses artificial intelligence to analyze user queries and recommend relevant books from our database.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
                  <p>You agree to:</p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li>Provide accurate information when using our service</li>
                    <li>Use the service only for lawful purposes</li>
                    <li>Not attempt to interfere with or disrupt the service</li>
                    <li>Not use automated tools to access the service excessively</li>
                    <li>Respect intellectual property rights of books and authors recommended</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Intellectual Property</h2>
                  <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive property of ReadMap AI and its licensors. The service is protected by copyright, trademark, and other laws. Book recommendations are based on publicly available information and metadata.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. User-Generated Content</h2>
                  <p>
                    Users may save reading roadmaps and preferences. By using our service, you grant us the right to store and process this information to provide personalized recommendations. You retain ownership of your personal data and can request its deletion at any time.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Third-Party Services</h2>
                  <p>
                    Our service integrates with third-party AI services (including Google AI) to provide recommendations. These services have their own terms of service and privacy policies. We are not responsible for the practices of these third-party services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Disclaimers and Limitations</h2>
                  <p>
                    ReadMap AI provides book recommendations "as is" without warranty of any kind. We do not guarantee the accuracy, completeness, or usefulness of any recommendations. The service is provided for informational purposes only and should not be considered as professional advice.
                  </p>
                  <p className="mt-4">
                    In no event shall ReadMap AI be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Account Termination</h2>
                  <p>
                    We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to Terms</h2>
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Governing Law</h2>
                  <p>
                    These Terms shall be interpreted and governed by the laws of the jurisdiction in which ReadMap AI operates, without regard to conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us through our website or social media channels listed in the footer.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}