import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Target, Zap, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { NavHeaderPublic } from "@/components/nav-header-public"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "About Mindora - Our Mission & Vision",
  description: "Learn about Mindora's mission to democratize emotional intelligence analytics for everyone",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavHeaderPublic />
      {/* Header */}
      <section className="py-20 md:py-32 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-3xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              About Mindora
            </h1>
            <p className="text-xl text-muted-foreground font-light">
              Democratizing emotional intelligence through advanced analytics and AI
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto items-center mb-20">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-primary" />
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To empower individuals with advanced emotional intelligence analytics, helping them understand their emotions,
                  identify triggers, and build lasting resilience through data-driven insights.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-secondary" />
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A world where emotional health is prioritized as much as physical health, and everyone has access to
                  tools that help them understand and manage their emotions effectively.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="border-primary/20 shadow-premium-lg">
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/15 text-primary flex-shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">10,000+</p>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-secondary/15 text-secondary flex-shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">1M+</p>
                        <p className="text-sm text-muted-foreground">Moods Tracked</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-accent/15 text-accent flex-shrink-0">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">98%</p>
                        <p className="text-sm text-muted-foreground">User Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-transparent border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground">Principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ValueCard
              title="Privacy First"
              desc="Your emotional data is sacred. End-to-end encryption and zero third-party sharing, always."
            />
            <ValueCard
              title="Accessibility"
              desc="Emotional intelligence tools should be accessible to everyone, regardless of background or budget."
            />
            <ValueCard
              title="Evidence-Based"
              desc="All recommendations are grounded in psychology and data science, never pseudoscience."
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Backed by Experts</h2>
              <p className="text-lg text-muted-foreground">
                Our team includes psychologists, data scientists, and wellness experts dedicated to your emotional growth
              </p>
            </div>

            <Card className="border-border/50 shadow-premium-md">
              <CardHeader>
                <CardTitle>Leadership</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-left space-y-2">
                  <p className="font-semibold text-lg">Founded by emotional intelligence pioneers</p>
                  <p className="text-muted-foreground">
                    With combined 50+ years in psychology, data science, and mental health technology
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/8 to-transparent border-t border-border/50">
        <div className="container mx-auto px-4 text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Join the Emotional Intelligence Revolution</h2>
            <p className="text-lg text-muted-foreground">Start your journey to emotional mastery today</p>
          </div>
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/signup" className="flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="border-border/50 shadow-premium-sm hover:shadow-premium-md card-hover">
      <CardContent className="pt-8">
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  )
}
