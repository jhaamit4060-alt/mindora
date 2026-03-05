import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Briefcase, Users, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { NavHeaderPublic } from "@/components/nav-header-public"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Careers at Mindora - Join Our Team",
  description: "Help us transform emotional health. Explore career opportunities at Mindora",
}

const jobs = [
  {
    id: 1,
    title: "Senior Product Designer",
    dept: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    level: "Senior",
  },
  {
    id: 2,
    title: "Machine Learning Engineer",
    dept: "Engineering",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
  },
  {
    id: 3,
    title: "Clinical Psychologist",
    dept: "Content",
    location: "San Francisco, CA",
    type: "Full-time",
    level: "Senior",
  },
  {
    id: 4,
    title: "Frontend Developer",
    dept: "Engineering",
    location: "Remote",
    type: "Full-time",
    level: "Mid-level",
  },
  {
    id: 5,
    title: "Marketing Manager",
    dept: "Marketing",
    location: "San Francisco, CA",
    type: "Full-time",
    level: "Mid-level",
  },
  {
    id: 6,
    title: "Customer Success Manager",
    dept: "Support",
    location: "Remote",
    type: "Full-time",
    level: "Mid-level",
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavHeaderPublic />
      {/* Header */}
      <section className="py-20 md:py-32 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-3xl space-y-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Join Our Mission
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Help us democratize emotional intelligence and transform how people understand themselves
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold mb-8 text-center">Why Work at Mindora?</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <BenefitCard
                icon={<Zap className="w-8 h-8" />}
                title="Meaningful Impact"
                desc="Work on technology that directly improves mental health and emotional wellbeing for millions"
              />
              <BenefitCard
                icon={<Users className="w-8 h-8" />}
                title="Great Team"
                desc="Collaborate with world-class designers, engineers, and wellness experts"
              />
              <BenefitCard
                icon={<Briefcase className="w-8 h-8" />}
                title="Growth"
                desc="Fast-growing startup with endless learning opportunities and career development"
              />
              <BenefitCard
                icon={<ArrowRight className="w-8 h-8" />}
                title="Benefits"
                desc="Competitive salary, health insurance, unlimited PTO, and equity options"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-transparent border-y border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Open Positions</h2>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {jobs.map((job) => (
              <Card key={job.id} className="border-border/50 shadow-premium-sm hover:shadow-premium-md card-hover">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <h3 className="text-xl font-semibold">{job.title}</h3>

                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="w-4 h-4" />
                          {job.dept}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {job.type}
                        </span>
                      </div>
                    </div>

                    <Button variant="outline">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Don't see your role?</p>
            <Button variant="outline">Send Your Resume</Button>
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Our Culture</h2>
              <p className="text-lg text-muted-foreground">
                We're passionate about building a company where great work happens
              </p>
            </div>

            <Card className="border-border/50 shadow-premium-lg">
              <CardContent className="pt-8 space-y-6">
                <CulturePoint
                  title="Remote-First"
                  desc="Work from anywhere. We have team members across timezones and value flexibility"
                />
                <CulturePoint
                  title="Learning-Focused"
                  desc="Continuous learning budget, conference attendance, and professional development"
                />
                <CulturePoint
                  title="Diverse & Inclusive"
                  desc="We celebrate diverse perspectives and actively foster an inclusive environment"
                />
                <CulturePoint
                  title="Work-Life Balance"
                  desc="Unlimited PTO, mental health days, and a supportive team culture"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/8 to-transparent border-t border-border/50">
        <div className="container mx-auto px-4 text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Ready to Make a Difference?</h2>
            <p className="text-lg text-muted-foreground">Apply now and help transform emotional health globally</p>
          </div>
          <Button asChild size="lg" className="h-12 px-8">
            <a href="mailto:careers@mindora.app" className="flex items-center gap-2">
              Apply Now <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border-border/50 shadow-premium-sm">
      <CardContent className="pt-8">
        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">{icon}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  )
}

function CulturePoint({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border-l-2 border-primary/30 pl-6 py-4">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}
