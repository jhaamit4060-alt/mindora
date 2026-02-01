import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, Activity, BookOpen, Layout, ArrowRight, GraduationCap, Briefcase, Heart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-foreground selection:bg-primary/20">
      <section className="relative pt-24 pb-16 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-10">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image src="/images/image.png" alt="Mindora" fill className="object-contain" priority />
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              Mental wellness made simple
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Track your mood. Journal freely. Find calm. A private, judgment-free space for your emotional wellness.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold border-2 bg-transparent"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
            No credit card required • Free to use
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Everything you need</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Built for your mental wellness journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="Mood Tracking"
              desc="Daily check-ins to understand your emotional patterns"
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Private Journal"
              desc="Expressive space to reflect and process your thoughts"
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="Calming Exercises"
              desc="Guided breathing and grounding techniques"
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">For everyone</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Whether you're a student, professional, or simply seeking balance</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Students</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage exam stress and academic pressure with daily support.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Exam Aspirants</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stay focused and calm during intensive preparation phases.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professionals</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Navigate workplace stress and maintain mental clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Your wellness journey starts here
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Join thousands already taking steps toward better mental health.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 px-10 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              Mindora is a self-care tool, not medical advice. Always consult healthcare professionals for mental health concerns.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  )
}
