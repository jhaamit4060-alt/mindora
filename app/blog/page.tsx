import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, User } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Blog - Mindora Emotional Intelligence Insights",
  description: "Read articles about emotional intelligence, mental wellness, and personal growth",
}

const blogPosts = [
  {
    id: 1,
    title: "Understanding Emotional Volatility: A Guide to Stability",
    excerpt:
      "Learn what emotional volatility means and discover practical strategies to build emotional stability in your daily life.",
    date: "March 15, 2024",
    author: "Dr. Sarah Chen",
    category: "Mental Wellness",
    slug: "emotional-volatility-guide",
  },
  {
    id: 2,
    title: "The Science Behind Mood Tracking",
    excerpt:
      "Explore the psychological research that shows why tracking your mood leads to better emotional awareness and growth.",
    date: "March 10, 2024",
    author: "Dr. James Wilson",
    category: "Science",
    slug: "science-mood-tracking",
  },
  {
    id: 3,
    title: "5 Breathing Exercises for Stress Management",
    excerpt:
      "Discover simple yet powerful breathing techniques that can reduce stress and anxiety in just 5 minutes.",
    date: "March 5, 2024",
    author: "Lisa Martinez",
    category: "Wellness",
    slug: "breathing-exercises",
  },
  {
    id: 4,
    title: "Journaling for Emotional Growth",
    excerpt:
      "How to use journaling as a powerful tool for self-discovery, processing emotions, and tracking your emotional journey.",
    date: "February 28, 2024",
    author: "Dr. Michael Brown",
    category: "Techniques",
    slug: "journaling-growth",
  },
  {
    id: 5,
    title: "Burnout Prevention: Recognizing Early Signs",
    excerpt:
      "Learn the warning signs of burnout and actionable strategies to prevent it before it impacts your mental health.",
    date: "February 20, 2024",
    author: "Emma Thompson",
    category: "Mental Wellness",
    slug: "burnout-prevention",
  },
  {
    id: 6,
    title: "Building Emotional Resilience Through Daily Practice",
    excerpt:
      "Discover how consistent practice and self-awareness can help you build lasting emotional resilience and inner strength.",
    date: "February 15, 2024",
    author: "Dr. Robert Lee",
    category: "Personal Growth",
    slug: "emotional-resilience",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 md:py-32 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-3xl space-y-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Mindora Blog
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Insights, tips, and strategies for emotional intelligence and personal growth
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group border border-border/50 rounded-xl overflow-hidden shadow-premium-sm hover:shadow-premium-lg card-hover transition-all"
              >
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="mt-2 p-0 h-auto text-primary hover:text-primary hover:bg-transparent flex items-center gap-2"
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 max-w-4xl mx-auto">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline" className="bg-primary text-white">
              1
            </Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-transparent border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Stay Updated</h2>
              <p className="text-lg text-muted-foreground">
                Get insights about emotional intelligence delivered to your inbox weekly
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button>Subscribe</Button>
            </div>

            <p className="text-xs text-muted-foreground">No spam, unsubscribe anytime</p>
          </div>
        </div>
      </section>
    </div>
  )
}
