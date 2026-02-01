"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LEARNING_ARTICLES, CATEGORIES, getRecommendedArticles } from "@/lib/learning-data"
import {
  BookOpen,
  Clock,
  ArrowLeft,
  Lightbulb,
  AlertTriangle,
  GraduationCap,
  TrendingUp,
  BookmarkCheck,
} from "lucide-react"

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  const [recentMoodAverage, setRecentMoodAverage] = useState<number | null>(null)
  const [showRecommended, setShowRecommended] = useState(false)

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await fetch("/api/mood")
        if (response.ok) {
          const data = await response.json()
          if (data.moods && data.moods.length > 0) {
            const recentMoods = data.moods.slice(0, 7) // Last 7 entries
            const average = recentMoods.reduce((sum: number, entry: any) => sum + entry.mood, 0) / recentMoods.length
            setRecentMoodAverage(average)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching mood data:", error)
      }
    }
    fetchMoodData()
  }, [])

  let filteredArticles =
    selectedCategory === "All"
      ? LEARNING_ARTICLES
      : LEARNING_ARTICLES.filter((article) => article.category === selectedCategory)

  if (showRecommended && recentMoodAverage !== null) {
    const recommended = getRecommendedArticles(recentMoodAverage)
    filteredArticles = filteredArticles.filter((article) => recommended.some((r) => r.id === article.id))
  }

  const currentArticle = LEARNING_ARTICLES.find((article) => article.id === selectedArticle)

  if (currentArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-primary/5">
        <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-8">
          <Button variant="ghost" onClick={() => setSelectedArticle(null)} size="lg" className="text-base">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to articles
          </Button>

          <article className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-5">
              <div className="inline-block px-4 py-2 text-sm font-semibold rounded-full bg-accent/20 text-accent">
                {currentArticle.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">{currentArticle.title}</h1>
              <div className="flex items-center gap-3 text-base text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{currentArticle.readTime}</span>
              </div>
            </div>

            <Card className="border-accent/20 bg-accent/5 shadow-lg">
              <CardContent className="pt-6 space-y-6 text-base md:text-lg leading-relaxed">
                {currentArticle.content.map((paragraph, index) => (
                  <p key={index} className="text-pretty">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>

            <Alert className="border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/5 shadow-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-base leading-relaxed ml-2">
                <strong className="font-bold text-amber-900 dark:text-amber-200">Medical Disclaimer:</strong> This
                content is for educational purposes and general wellness information only. It is not a substitute for
                professional medical advice, diagnosis, or treatment. If you're experiencing persistent mental health
                concerns, crisis thoughts, or urgent symptoms, please seek immediate support from a qualified mental
                health professional, your healthcare provider, or contact a crisis helpline.
              </AlertDescription>
            </Alert>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-secondary/5">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent/90 to-primary p-10 md:p-16 text-white shadow-xl">
          <div className="relative z-10 space-y-5 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              <GraduationCap className="w-4 h-4" />
              <span>Evidence-Based Resources</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance">Learning Resources</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Expert-curated articles about mental wellness, stress management, and personal growth backed by research
            </p>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          {recentMoodAverage !== null && (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Personalized for You
                </CardTitle>
                <CardDescription className="text-base">
                  Based on your recent mood patterns, we've selected articles that may be most relevant for you right
                  now.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={showRecommended ? "default" : "outline"}
                  onClick={() => setShowRecommended(!showRecommended)}
                  className="h-11"
                >
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                  {showRecommended ? "Showing Recommended" : "Show Recommended for Me"}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedCategory(category)}
                className="text-base font-semibold"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => {
              const isRecommended =
                recentMoodAverage !== null && article.recommendedForMoods.includes(Math.round(recentMoodAverage))
              return (
                <Card
                  key={article.id}
                  className={`flex flex-col hover:shadow-xl transition-all hover:scale-[1.02] border-2 ${
                    isRecommended ? "border-primary/30 bg-primary/5" : "border-accent/20"
                  }`}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full bg-accent/20 text-accent">
                        {article.category}
                      </span>
                      {isRecommended && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl text-balance leading-tight">{article.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{article.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end space-y-4 pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedArticle(article.id)}
                      className="w-full h-12"
                      size="lg"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Read article
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-accent" />
                About these resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-base md:text-lg leading-relaxed">
              <p>
                These articles are designed to provide practical, evidence-based information about mental wellness and
                stress management, particularly for students and young professionals facing academic and career
                pressures.
              </p>
              <p>
                The content here is educational and supportive in nature, drawn from established research in psychology
                and mental health. It's meant to help you understand common experiences and develop healthy coping
                strategies.
              </p>

              <Alert className="border-destructive/40 bg-destructive/10 dark:bg-destructive/5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDescription className="text-base leading-relaxed ml-2">
                  <strong className="font-bold">Important:</strong> This is not professional mental health advice or
                  treatment. These resources cannot replace the expertise of licensed therapists, counselors, or
                  psychiatrists. If you're struggling with persistent mental health concerns, experiencing crisis
                  thoughts, or need clinical support, please seek help from qualified mental health professionals
                  immediately.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
