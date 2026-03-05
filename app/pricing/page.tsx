import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, Sparkles, Shield, Zap } from "lucide-react"
import { NavHeaderPublic } from "@/components/nav-header-public"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Pricing - Mindora Emotional Intelligence Analytics",
  description: "Choose the perfect plan for your emotional wellness journey",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavHeaderPublic />
      {/* Header */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your emotional intelligence journey
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="text-sm font-medium">Pay Monthly</span>
            <div className="w-12 h-6 rounded-full bg-primary/20 border border-primary/50 flex items-center pl-1">
              <div className="w-5 h-5 rounded-full bg-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Save 20% Annually</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-border/50 flex flex-col">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div>
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground ml-2">forever</span>
                </div>
                <ul className="space-y-3">
                  <PricingFeature text="Unlimited mood tracking" />
                  <PricingFeature text="Basic journaling" />
                  <PricingFeature text="3 calming exercises" />
                  <PricingFeature text="7-day mood history" disabled />
                  <PricingFeature text="AI insights" disabled />
                  <PricingFeature text="Advanced analytics" disabled />
                </ul>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan - Featured */}
            <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/5 relative flex flex-col transform md:scale-105 md:shadow-2xl">
              <div className="absolute -top-4 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>For serious emotional growth</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div>
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <ul className="space-y-3">
                  <PricingFeature text="Unlimited mood tracking" />
                  <PricingFeature text="Advanced journaling" />
                  <PricingFeature text="All calming exercises" />
                  <PricingFeature text="30-day mood history" />
                  <PricingFeature text="AI-powered insights" />
                  <PricingFeature text="Custom analytics reports" />
                </ul>
                <Button asChild className="w-full" size="lg">
                  <Link href="/signup?plan=premium" className="flex items-center gap-2">
                    Start Free Trial <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">7 days free. No credit card required.</p>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-border/50 flex flex-col">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For organizations</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div>
                  <span className="text-2xl font-bold">Custom</span>
                  <span className="text-muted-foreground text-sm ml-2">Volume pricing</span>
                </div>
                <ul className="space-y-3">
                  <PricingFeature text="Everything in Premium" />
                  <PricingFeature text="Organization dashboard" />
                  <PricingFeature text="Anonymous aggregated analytics" />
                  <PricingFeature text="Engagement metrics" />
                  <PricingFeature text="Compliance reports" />
                  <PricingFeature text="Dedicated support" />
                </ul>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="mailto:contact@mindora.app">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="space-y-12 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Feature Comparison</h2>
              <p className="text-muted-foreground">See what's included in each plan</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold">Free</th>
                    <th className="text-center py-3 px-4 font-semibold">Premium</th>
                    <th className="text-center py-3 px-4 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow feature="Mood Tracking" free={true} premium={true} enterprise={true} />
                  <ComparisonRow feature="Journaling" free={true} premium={true} enterprise={true} />
                  <ComparisonRow feature="Calming Exercises" free={true} premium={true} enterprise={true} />
                  <ComparisonRow feature="Mood History" free="7 days" premium="30 days" enterprise="Unlimited" />
                  <ComparisonRow feature="AI Insights" free={false} premium={true} enterprise={true} />
                  <ComparisonRow feature="Analytics Reports" free={false} premium={true} enterprise={true} />
                  <ComparisonRow feature="Export Data" free={false} premium={true} enterprise={true} />
                  <ComparisonRow feature="Organization Dashboard" free={false} premium={false} enterprise={true} />
                  <ComparisonRow feature="Compliance Reports" free={false} premium={false} enterprise={true} />
                  <ComparisonRow feature="Priority Support" free={false} premium={false} enterprise={true} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem
              question="Can I switch plans anytime?"
              answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
            />
            <FAQItem
              question="Is there a free trial for Premium?"
              answer="Yes, we offer a 7-day free trial for Premium. No credit card required to start."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, PayPal, and bank transfers for Enterprise customers."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="We offer a 30-day money-back guarantee if you're not satisfied with Premium."
            />
            <FAQItem
              question="Is my data encrypted?"
              answer="Yes, all data is encrypted end-to-end. We never share your personal information with third parties."
            />
            <FAQItem
              question="Can I export my data?"
              answer="Yes, Premium and Enterprise users can download their complete emotional data in JSON format anytime."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-t border-border">
        <div className="container mx-auto px-4 text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Ready to transform your emotional intelligence?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start your free trial today. No credit card required.
            </p>
          </div>
          <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
            <Link href="/signup" className="flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function PricingFeature({ text, disabled }: { text: string; disabled?: boolean }) {
  return (
    <li className={`flex items-center gap-3 ${disabled ? "opacity-50" : ""}`}>
      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${disabled ? "text-muted-foreground" : "text-accent"}`} />
      <span className={disabled ? "text-muted-foreground" : ""}>{text}</span>
    </li>
  )
}

function ComparisonRow({
  feature,
  free,
  premium,
  enterprise,
}: {
  feature: string
  free: boolean | string
  premium: boolean | string
  enterprise: boolean | string
}) {
  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
      <td className="py-3 px-4 font-medium">{feature}</td>
      <td className="py-3 px-4 text-center">
        {typeof free === "boolean" ? (
          free ? (
            <CheckCircle2 className="w-5 h-5 text-accent mx-auto" />
          ) : (
            <div className="w-5 h-5 mx-auto opacity-20">—</div>
          )
        ) : (
          <span className="text-sm">{free}</span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {typeof premium === "boolean" ? (
          premium ? (
            <CheckCircle2 className="w-5 h-5 text-accent mx-auto" />
          ) : (
            <div className="w-5 h-5 mx-auto opacity-20">—</div>
          )
        ) : (
          <span className="text-sm font-semibold">{premium}</span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {typeof enterprise === "boolean" ? (
          enterprise ? (
            <CheckCircle2 className="w-5 h-5 text-accent mx-auto" />
          ) : (
            <div className="w-5 h-5 mx-auto opacity-20">—</div>
          )
        ) : (
          <span className="text-sm font-semibold">{enterprise}</span>
        )}
      </td>
    </tr>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/50 transition-colors">
      <h3 className="font-semibold text-lg">{question}</h3>
      <p className="text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  )
}
