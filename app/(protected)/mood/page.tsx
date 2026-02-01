"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smile, Meh, Frown, Heart, TrendingUp, Info, Shield } from "lucide-react"
import type { MoodEntry } from "@/lib/types"

const MOOD_OPTIONS = [
  { value: 5, label: "Great", icon: Smile, color: "text-green-600 dark:text-green-400" },
  { value: 4, label: "Good", icon: Smile, color: "text-green-500 dark:text-green-300" },
  { value: 3, label: "Okay", icon: Meh, color: "text-yellow-500 dark:text-yellow-300" },
  { value: 2, label: "Not great", icon: Frown, color: "text-orange-500 dark:text-orange-400" },
  { value: 1, label: "Difficult", icon: Frown, color: "text-red-500 dark:text-red-400" },
]

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([])

  useEffect(() => {
    fetchRecentMoods()
  }, [])

  const fetchRecentMoods = async () => {
    try {
      const response = await fetch("/api/mood")
      if (response.ok) {
        const data = await response.json()
        setRecentMoods(data.moods || [])
      }
    } catch (err) {
      console.error("Error fetching moods:", err)
    }
  }

  const handleSubmit = async () => {
    if (!selectedMood) {
      setError("Please select a mood")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          note: note.trim() || undefined,
          date: new Date(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Something went wrong")
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      setSelectedMood(null)
      setNote("")
      fetchRecentMoods()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-10 md:p-16 text-white shadow-xl">
          <div className="relative z-10 space-y-5 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              <Heart className="w-4 h-4" />
              <span>Mood Tracking</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance">How are you feeling?</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Take a moment to check in with yourself. Understanding your emotions is the first step to better mental
              wellness.
            </p>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          <Alert className="border-accent/40 bg-accent/10 dark:bg-accent/5">
            <Shield className="h-5 w-5 text-accent" />
            <AlertDescription className="text-base leading-relaxed ml-2">
              <strong className="font-semibold text-accent-foreground">Your privacy is protected:</strong> Your mood
              data is encrypted, stored securely, and belongs only to you. We never share your personal information.
            </AlertDescription>
          </Alert>

          <Card className="shadow-xl border-primary/20">
            <CardHeader className="space-y-3 pb-8">
              <CardTitle className="text-3xl font-bold">Log your mood</CardTitle>
              <CardDescription className="text-lg">
                Choose what best describes how you're feeling right now
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-accent bg-accent/10">
                  <AlertDescription className="text-accent-foreground font-medium">
                    Mood logged successfully! Keep up the great work.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {MOOD_OPTIONS.map((mood) => {
                  const Icon = mood.icon
                  return (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                        selectedMood === mood.value
                          ? "border-primary bg-primary/10 shadow-lg scale-105"
                          : "border-border hover:border-primary/50 hover:shadow-md"
                      }`}
                      disabled={isSubmitting}
                    >
                      <Icon className={`h-10 w-10 ${mood.color}`} />
                      <span className="text-base font-semibold">{mood.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="space-y-3">
                <label htmlFor="note" className="text-base font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  Add a note (optional)
                </label>
                <Textarea
                  id="note"
                  placeholder="What's on your mind? Any triggers or thoughts you want to remember? This is just for you..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={5}
                  disabled={isSubmitting}
                  className="text-base resize-none"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selectedMood || isSubmitting}
                className="w-full h-14 text-lg font-semibold"
                size="lg"
              >
                {isSubmitting ? "Saving..." : "Log mood"}
              </Button>
            </CardContent>
          </Card>

          {recentMoods.length > 0 && (
            <Card className="shadow-xl">
              <CardHeader className="space-y-3">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <TrendingUp className="text-primary w-6 h-6" />
                  Recent mood entries
                </CardTitle>
                <CardDescription className="text-base">Your mood history over the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMoods.map((entry) => {
                    const moodOption = MOOD_OPTIONS.find((m) => m.value === entry.mood)
                    const Icon = moodOption?.icon || Meh
                    return (
                      <div
                        key={entry._id}
                        className="flex items-start gap-5 p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors border border-border"
                      >
                        <Icon className={`h-6 w-6 mt-1 flex-shrink-0 ${moodOption?.color}`} />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <span className="font-semibold text-lg">{moodOption?.label}</span>
                            <span className="text-sm text-muted-foreground font-medium">
                              {new Date(entry.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-base text-muted-foreground leading-relaxed">{entry.note}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
