// app/privacy/page.tsx
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { NetworkBackground } from "@/components/NetworkBackground"

export default function PrivacyPolicy() {
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
                Privacy
              </span>
              <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent block">
                Policy
              </span>
            </h1>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200/50 shadow-lg p-8 md:p-12">

              <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
                  <p>
                    ReadMap AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered reading assistant service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">Information You Provide</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Search queries and learning goals you enter</li>
                    <li>Saved reading roadmaps and preferences</li>
                    <li>Account information (if you create an account)</li>
                    <li>Feedback and communications with us</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Device information (browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, features used)</li>
                    <li>IP address and general location information</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
                  <p>We use the collected information to:</p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li>Provide personalized book recommendations</li>
                    <li>Generate AI-powered learning roadmaps</li>
                    <li>Improve our AI algorithms and service quality</li>
                    <li>Save and retrieve your reading preferences</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                    <li>Prevent fraud and ensure service security</li>
                    <li>Communicate with you about service updates</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Third-Party Services</h2>
                  <p>
                    Our service integrates with third-party AI providers to generate recommendations:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li><strong>Google AI Services:</strong> We use Google's AI models to process your queries and generate book recommendations. Your queries may be processed by Google's servers subject to their privacy policy.</li>
                    <li><strong>Database Providers:</strong> We use cloud database services to store book information and user preferences.</li>
                    <li><strong>Analytics Tools:</strong> We may use analytics services to understand how users interact with our service.</li>
                  </ul>
                  <p className="mt-4">
                    These third-party services have their own privacy policies and terms of service. We encourage you to review them.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Sharing and Disclosure</h2>
                  <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li>With third-party AI services to provide recommendations (as described above)</li>
                    <li>When required by law or to protect our legal rights</li>
                    <li>In connection with a business transfer or acquisition</li>
                    <li>With your explicit consent</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Data Retention</h2>
                  <p>
                    We retain your information for as long as necessary to provide our services and comply with legal obligations. Search queries may be retained to improve our AI models. Saved roadmaps are retained until you delete them or close your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Your Rights and Choices</h2>
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li>Access and review your personal information</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Delete your account and associated data</li>
                    <li>Opt out of certain communications</li>
                    <li>Request a copy of your data</li>
                    <li>Restrict or object to certain processing activities</li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, please contact us through the methods listed below.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Cookies and Tracking</h2>
                  <p>
                    We use cookies and similar technologies to enhance your experience, remember preferences, and analyze usage. You can control cookie settings through your browser, but some features may not function properly if cookies are disabled.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Children's Privacy</h2>
                  <p>
                    Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. International Users</h2>
                  <p>
                    If you are accessing our service from outside the country where our servers are located, your information may be transferred across borders. By using our service, you consent to such transfers.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Changes to This Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li>Through our website contact form</li>
                    <li>Via social media channels listed in our footer</li>
                    <li>By email (contact information available on our website)</li>
                  </ul>
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