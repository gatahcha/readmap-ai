import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-600/20 to-transparent"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-50 mb-6">Ready to start your reading journey?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of readers who have discovered their perfect book path
          </p>
          <Button
            size="lg"
            className="bg-orange-50 text-orange-600 hover:bg-orange-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </section>
  )
}