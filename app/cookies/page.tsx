import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Cookie Policy - Mindora",
  description: "Learn about how Mindora uses cookies and similar tracking technologies",
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 md:py-24 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Cookie Policy
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Last updated: March 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <PolicySection
            title="What are Cookies?"
            content="Cookies are small pieces of text stored on your device (browser or hard drive) that allow websites to remember information about your visit. They are widely used to make websites work more efficiently and provide better user experiences."
          />

          <PolicySection
            title="How We Use Cookies"
            content="Mindora uses cookies for various purposes including:"
          />

          <div className="bg-muted/40 rounded-lg p-6 space-y-4">
            <CookieType
              name="Essential Cookies"
              desc="These cookies are necessary for the website to function properly. They enable you to navigate and use core features like authentication."
            />
            <CookieType
              name="Analytics Cookies"
              desc="We use analytics cookies to understand how you use Mindora, allowing us to improve our service and user experience."
            />
            <CookieType
              name="Preference Cookies"
              desc="These cookies remember your preferences and settings, such as language selection and theme preferences."
            />
            <CookieType
              name="Performance Cookies"
              desc="These cookies help us measure the performance of our website and service, identifying errors and testing new features."
            />
          </div>

          <PolicySection
            title="Third-Party Cookies"
            content="Mindora may use cookies from third-party services for analytics and advertising purposes. These include Google Analytics for understanding user behavior and behavior analysis. You can opt out of these cookies through your browser settings or the providers' opt-out mechanisms."
          />

          <PolicySection
            title="Your Cookie Choices"
            content="You have the right to control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, some features of Mindora may not function properly if cookies are disabled."
          />

          <PolicySection
            title="How to Control Cookies"
            content="You can control and/or delete cookies using your browser:"
          />

          <div className="bg-muted/40 rounded-lg p-6 space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Chrome: chrome://settings/cookies</li>
              <li>• Firefox: Preferences > Privacy & Security</li>
              <li>• Safari: Preferences > Privacy</li>
              <li>• Edge: Settings > Privacy and services > Clear browsing data</li>
            </ul>
          </div>

          <PolicySection
            title="Local Storage"
            content="In addition to cookies, we may use local storage technologies (like browser local storage) to store information about your preferences and session data. These are similar to cookies but can store larger amounts of data."
          />

          <PolicySection
            title="Do Not Track"
            content="Some browsers include a "Do Not Track" feature. Currently, there is no industry standard for recognizing such signals. Mindora does not respond to Do Not Track signals at this time."
          />

          <PolicySection
            title="Changes to This Cookie Policy"
            content="We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the last updated date."
          />

          <PolicySection
            title="Contact Us"
            content="If you have questions about our use of cookies or this Cookie Policy, please contact us at privacy@mindora.app"
          />

          <Card className="border-border/50 shadow-premium-sm">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                By using Mindora, you agree to our use of cookies as described in this policy. If you do not agree with our cookie practices, you can disable cookies in your browser settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function PolicySection({ title, content }: { title: string; content: string }) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground leading-relaxed text-base">{content}</p>
    </div>
  )
}

function CookieType({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="border-l-2 border-primary/30 pl-4 py-2">
      <h4 className="font-semibold text-sm mb-1">{name}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}
