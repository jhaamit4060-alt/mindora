import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Download, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Privacy & Security - Mindora",
  description: "Learn how Mindora protects your emotional data with enterprise-grade security",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-sm font-semibold text-primary">Your Privacy Matters</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              Privacy & Security
            </h1>
            <p className="text-xl text-muted-foreground">
              Your emotional data is deeply personal. We treat it with the utmost care and security.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Dashboard */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Data Transparency */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  <CardTitle>Data Transparency</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  See exactly what data we collect and how it's used.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Mood entries and timestamps
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Journal entries (encrypted)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Exercise sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Profile information
                  </li>
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">
                    <strong>What we DON'T collect:</strong>
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Location data</li>
                    <li>• Browsing history</li>
                    <li>• Device information</li>
                    <li>• Third-party data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* End-to-End Encryption */}
            <Card className="border-secondary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-secondary" />
                  <CardTitle>End-to-End Encryption</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your data is encrypted with military-grade security protocols.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="font-semibold text-secondary mb-1">In Transit</p>
                    <p className="text-xs text-muted-foreground">TLS 1.3 encryption</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="font-semibold text-secondary mb-1">At Rest</p>
                    <p className="text-xs text-muted-foreground">AES-256 encryption</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="font-semibold text-secondary mb-1">Database</p>
                    <p className="text-xs text-muted-foreground">AWS RDS with encryption</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Your Data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-accent" />
                    <CardTitle className="text-lg">Download Your Data</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Export all your emotional data in a machine-readable format. Your data, your control.
                  </p>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <CardTitle className="text-lg">Delete Account</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button className="w-full" variant="destructive">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security Standards */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Security Standards & Compliance</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <SecurityBadge title="GDPR Compliant" description="Your data rights are protected under EU regulations" />
            <SecurityBadge title="HIPAA Ready" description="Healthcare-compatible privacy standards" />
            <SecurityBadge title="SOC 2 Certified" description="Industry-standard security controls" />
            <SecurityBadge title="Data Protection" description="CCPA and privacy law compliance" />
            <SecurityBadge title="Regular Audits" description="Third-party security assessments" />
            <SecurityBadge title="Backup & Recovery" description="Automatic daily encrypted backups" />
          </div>
        </div>
      </section>

      {/* Privacy Policy Details */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Data Collection & Usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect minimal data necessary to provide our service. This includes mood entries, journal content, exercise
              sessions, and basic profile information. We never sell, trade, or share your data with third parties. Your data
              remains 100% private and is used solely for analytics and personalization within your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is retained as long as your account is active. You can delete any entry at any time. Upon account
              deletion, all personal data is permanently removed from our systems within 30 days. Backup copies are destroyed
              after 90 days per our disaster recovery policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Mindora uses only essential third-party services for infrastructure and security:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>AWS:</strong> Cloud hosting with encryption</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Stripe:</strong> Payment processing (PCI-DSS compliant)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Auth0:</strong> Authentication and security</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              None of these services access your emotional data directly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <div className="space-y-3">
              <RightItem title="Right to Access" description="Request a copy of all data we hold about you" />
              <RightItem title="Right to Rectification" description="Correct any inaccurate personal data" />
              <RightItem title="Right to Erasure" description="Request deletion of your data at any time" />
              <RightItem title="Right to Portability" description="Export your data in a standard format" />
              <RightItem title="Right to Object" description="Opt-out of non-essential data processing" />
            </div>
          </div>

          <div className="p-6 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-2">Contact Our Privacy Team</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Questions about your privacy or data? Contact us directly.
                </p>
                <Button variant="outline" asChild>
                  <a href="mailto:privacy@mindora.app">privacy@mindora.app</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function SecurityBadge({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 border border-border rounded-lg bg-card">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

function RightItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 border border-border rounded-lg bg-muted/30">
      <p className="font-semibold text-sm mb-1">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
