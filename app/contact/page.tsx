import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { NavHeaderPublic } from "@/components/nav-header-public"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Contact Us - Mindora Support",
  description: "Get in touch with Mindora support team for questions, feedback, or partnership inquiries",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavHeaderPublic />
      {/* Header */}
      <section className="py-20 md:py-32 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-3xl space-y-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Have questions? Our team is here to help you succeed
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Contact Information</h2>

                <ContactItem
                  icon={<Mail className="w-6 h-6" />}
                  title="Email"
                  desc="support@mindora.app"
                  link="mailto:support@mindora.app"
                />

                <ContactItem
                  icon={<Phone className="w-6 h-6" />}
                  title="Phone"
                  desc="+1 (555) 123-4567"
                  link="tel:+15551234567"
                />

                <ContactItem
                  icon={<MapPin className="w-6 h-6" />}
                  title="Office"
                  desc="San Francisco, CA"
                />

                <ContactItem
                  icon={<Clock className="w-6 h-6" />}
                  title="Hours"
                  desc="Mon-Fri 9AM-6PM PT"
                />
              </div>

              <Card className="border-border/50 shadow-premium-md">
                <CardHeader>
                  <CardTitle className="text-lg">Response Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>We typically respond to inquiries within:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Emails: 24 hours</li>
                    <li>• Support tickets: 4 hours</li>
                    <li>• Urgent issues: 1 hour</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-border/50 shadow-premium-lg">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <input
                        type="text"
                        placeholder="How can we help?"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea
                        rows={5}
                        placeholder="Your message..."
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                      ></textarea>
                    </div>

                    <Button className="w-full h-11">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-transparent border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <FAQItem
                q="How quickly will I hear back?"
                a="We aim to respond to all inquiries within 24 hours during business days. Urgent support issues are prioritized."
              />
              <FAQItem
                q="What support channels are available?"
                a="You can reach us via email, phone, in-app chat, and our support portal. Choose whatever works best for you."
              />
              <FAQItem
                q="Is there a community forum?"
                a="Yes! Join our community to connect with other Mindora users, share experiences, and get peer support."
              />
              <FAQItem
                q="Do you offer enterprise support?"
                a="Yes, we offer dedicated support plans for teams and organizations. Contact sales@mindora.app for details."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ContactItem({
  icon,
  title,
  desc,
  link,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  link?: string
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </div>

      <Footer />
    </div>
  )

  return link ? <a href={link}>{content}</a> : <div>{content}</div>
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">{q}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
      </CardContent>
    </Card>
  )
}
