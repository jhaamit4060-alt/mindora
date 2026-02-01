"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EXERCISES, getRecommendedExercises } from "@/lib/exercises-data"
import { Check, Wind, ArrowLeft, Sparkles, TrendingUp, Filter, BookmarkCheck, Youtube } from "lucide-react"

export default function ExercisesPage() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set())
  const [isCompleting, setIsCompleting] = useState(false)
  const [recentMoodAverage, setRecentMoodAverage] = useState<number | null>(null)
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all")
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

  const handleComplete = async (exerciseId: string) => {
    setIsCompleting(true)
    try {
      const response = await fetch("/api/exercises/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId,
          completedAt: new Date(),
        }),
      })

      if (response.ok) {
        setCompletedToday(new Set([...completedToday, exerciseId]))
        setSelectedExercise(null)
      }
    } catch (error) {
      console.error("[v0] Error completing exercise:", error)
    } finally {
      setIsCompleting(false)
    }
  }

  const selectedExerciseData = EXERCISES.find((e) => e.id === selectedExercise)

  let displayedExercises = EXERCISES
  if (filterDifficulty !== "all") {
    displayedExercises = displayedExercises.filter((ex) => ex.difficulty === filterDifficulty)
  }
  if (showRecommended && recentMoodAverage !== null) {
    const recommended = getRecommendedExercises(recentMoodAverage)
    displayedExercises = displayedExercises.filter((ex) => recommended.some((r) => r.id === ex.id))
  }

  if (selectedExercise && selectedExerciseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedExercise(null)}
              className="group hover:bg-muted/80 transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to exercises
            </Button>

            <Card className="border-2 shadow-xl dark:shadow-primary/5 transition-all hover:shadow-2xl">
              <CardHeader className="space-y-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-t-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                    <Wind className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold text-balance">{selectedExerciseData.title}</CardTitle>
                    <CardDescription className="text-base mt-2 leading-relaxed">
                      {selectedExerciseData.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 pt-3 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {selectedExerciseData.duration}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium capitalize">
                        {selectedExerciseData.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {selectedExerciseData.youtubeUrl && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-600" />
                      Video Reference
                    </h3>
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-2 border-muted">
                      <iframe
                        width="100%"
                        height="100%"
                        src={selectedExerciseData.youtubeUrl}
                        title={`${selectedExerciseData.title} Video Reference`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Instructions
                  </h3>
                  <ol className="space-y-3 list-decimal list-inside">
                    {selectedExerciseData.instructions.map((step, index) => (
                      <li key={index} className="text-base leading-relaxed text-muted-foreground pl-2">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent" />
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {selectedExerciseData.benefits.map((benefit, index) => (
                      <li key={index} className="text-base text-muted-foreground flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Alert className="border-2 border-primary/20 bg-primary/5">
                  <AlertDescription className="text-base leading-relaxed">
                    Take your time with this exercise. There's no rush. If you feel uncomfortable at any point, stop and
                    return to your normal breathing.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => handleComplete(selectedExerciseData.id)}
                  disabled={isCompleting}
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  {isCompleting ? "Saving..." : "Mark as completed"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-10">
        <div className="space-y-4 text-center lg:text-left max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Calming Exercises
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl text-pretty">
            Take a few minutes to practice these evidence-based techniques designed for stress relief and mental clarity
          </p>
        </div>

        {recentMoodAverage !== null && (
          <div className="max-w-7xl mx-auto">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Personalized for You
                </CardTitle>
                <CardDescription className="text-base">
                  Based on your recent mood entries, we've identified exercises that may be most helpful for you right
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
          </div>
        )}

        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter by difficulty:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterDifficulty === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterDifficulty("all")}
            >
              All
            </Button>
            <Button
              variant={filterDifficulty === "beginner" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterDifficulty("beginner")}
            >
              Beginner
            </Button>
            <Button
              variant={filterDifficulty === "intermediate" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterDifficulty("intermediate")}
            >
              Intermediate
            </Button>
            <Button
              variant={filterDifficulty === "advanced" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterDifficulty("advanced")}
            >
              Advanced
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedExercises.map((exercise) => {
            const isCompleted = completedToday.has(exercise.id)
            const isRecommended =
              recentMoodAverage !== null && exercise.recommendedForMoods.includes(Math.round(recentMoodAverage))
            return (
              <Card
                key={exercise.id}
                className={`group flex flex-col border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:hover:shadow-primary/10 ${
                  isRecommended ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {exercise.title}
                        </CardTitle>
                        {isRecommended && (
                          <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-sm flex items-center gap-2 flex-wrap">
                        <Wind className="h-4 w-4 text-primary" />
                        {exercise.duration}
                        <span className="text-xs capitalize">• {exercise.difficulty}</span>
                      </CardDescription>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                      <Wind className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-base text-muted-foreground leading-relaxed">{exercise.description}</p>
                  <div className="space-y-3">
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-sm text-accent font-medium px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
                        <Check className="h-4 w-4" />
                        Completed today
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setSelectedExercise(exercise.id)}
                      className="w-full h-11 font-medium group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                    >
                      Start exercise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="max-w-7xl mx-auto border-2 shadow-xl dark:shadow-primary/5">
          <CardHeader className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Tips for Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 p-8">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-base text-muted-foreground leading-relaxed">
                Find a quiet space where you won't be disturbed
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
              <p className="text-base text-muted-foreground leading-relaxed">
                Start with shorter sessions and gradually increase duration
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
              <p className="text-base text-muted-foreground leading-relaxed">
                Practice regularly for best results - even 5 minutes daily makes a difference
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-base text-muted-foreground leading-relaxed">
                Be patient with yourself - it's normal for your mind to wander
              </p>
            </div>
            <div className="flex items-start gap-3 md:col-span-2">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
              <p className="text-base text-muted-foreground leading-relaxed">
                If you feel dizzy or uncomfortable, return to normal breathing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
