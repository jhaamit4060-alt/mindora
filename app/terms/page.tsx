import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Terms of Service - Mindora",
  description: "Read Mindora's terms of service and legal agreements",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 md:py-24 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Last updated: March 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <TermSection
            title="1. Acceptance of Terms"
            content="By accessing and using Mindora, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
          />

          <TermSection
            title="2. Use License"
            content="Permission is granted to temporarily download one copy of the materials (information or software) on Mindora for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:"
          />

          <div className="bg-muted/40 rounded-lg p-6 space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Modifying or copying the materials</li>
              <li>• Using the materials for any commercial purpose or for any public display</li>
              <li>• Attempting to decompile or reverse engineer any software contained on Mindora</li>
              <li>• Removing any copyright or other proprietary notations from the materials</li>
              <li>• Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </div>

          <TermSection
            title="3. Disclaimer"
            content="The materials on Mindora are provided on an 'as is' basis. Mindora makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
          />

          <TermSection
            title="4. Limitations"
            content="In no event shall Mindora or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Mindora, even if Mindora or an authorized representative has been notified orally or in writing of the possibility of such damage."
          />

          <TermSection
            title="5. User Accounts"
            content="When you create an account with Mindora, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account."
          />

          <TermSection
            title="6. User Content"
            content="You retain all rights to any content you submit, post or display on or through Mindora. By submitting content, you grant Mindora a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute the content for the purpose of providing Mindora services."
          />

          <TermSection
            title="7. Prohibited Conduct"
            content="You agree not to engage in any of the following prohibited activities:"
          />

          <div className="bg-muted/40 rounded-lg p-6 space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Harassing or causing distress or inconvenience to any person</li>
              <li>• Offensive, obscene, or sexually explicit content</li>
              <li>• Disrupting the normal flow of dialogue within Mindora</li>
              <li>• Attempting to gain unauthorized access to systems</li>
              <li>• Transmitting viruses, worms, or other malicious code</li>
              <li>• Commercial solicitation or spam</li>
            </ul>
          </div>

          <TermSection
            title="8. Privacy Policy"
            content="Your use of Mindora is also governed by our Privacy Policy. Please review our Privacy & Security page to understand our privacy practices regarding the collection and use of your information."
          />

          <TermSection
            title="9. Modifications to Service"
            content="Mindora reserves the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. You agree that Mindora shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service."
          />

          <TermSection
            title="10. Governing Law"
            content="These terms and conditions are governed by and construed in accordance with the laws of California, United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
          />

          <Card className="border-border/50 shadow-premium-sm">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@mindora.app" className="text-primary hover:underline">
                  legal@mindora.app
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function TermSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground leading-relaxed text-base">{content}</p>
    </div>
  )
}
