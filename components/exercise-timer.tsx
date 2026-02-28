"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Check } from "lucide-react"

interface ExerciseTimerProps {
  exerciseId: string
  exerciseTitle: string
  recommendedDuration: number // in minutes
  onComplete: (duration: number) => void
  isCompleting?: boolean
}

export function ExerciseTimer({
  exerciseId,
  exerciseTitle,
  recommendedDuration,
  onComplete,
  isCompleting = false,
}: ExerciseTimerProps) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setSeconds(0)
    setIsRunning(false)
    setIsCompleted(false)
  }

  const handleComplete = async () => {
    setIsRunning(false)
    setIsCompleted(true)

    // Call the parent component's complete handler
    onComplete(seconds)

    // Save exercise session to database
    try {
      const response = await fetch("/api/exercises/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId,
          exerciseTitle,
          completedAt: new Date(),
          durationInSeconds: seconds,
          recommendedDurationInMinutes: recommendedDuration,
        }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to save exercise session")
      } else {
        const data = await response.json()
        console.log("[v0] Exercise session saved:", data)
      }
    } catch (error) {
      console.error("[v0] Error saving exercise session:", error)
    }
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const recommendedSeconds = recommendedDuration * 60
  const percentComplete = Math.min((seconds / recommendedSeconds) * 100, 100)

  return (
    <Card className="w-full border-2 shadow-lg">
      <CardContent className="p-8 space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-muted-foreground">
            Exercise Timer
          </h3>

          <div className="relative w-full h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-8 border-muted-foreground/20"></div>
            <div
              className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary border-r-secondary border-b-accent transition-transform duration-300"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  var(--color-primary, #6366f1) 0deg,
                  var(--color-primary, #6366f1) ${percentComplete * 3.6}deg,
                  transparent ${percentComplete * 3.6}deg
                )`,
              }}
            ></div>
            <div className="relative text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary font-mono">
                {formatTime(seconds)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Recommended: {recommendedDuration} min
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(percentComplete)}% of recommended time
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center flex-wrap">
          {!isRunning && !isCompleted && (
            <Button
              onClick={handleStart}
              size="lg"
              className="gap-2 px-8"
            >
              <Play className="w-5 h-5" />
              Start
            </Button>
          )}

          {isRunning && (
            <Button
              onClick={handlePause}
              size="lg"
              variant="outline"
              className="gap-2 px-8"
            >
              <Pause className="w-5 h-5" />
              Pause
            </Button>
          )}

          {(isRunning || (seconds > 0 && !isCompleted)) && (
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="gap-2 px-8"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          )}

          {seconds > 0 && (
            <Button
              onClick={handleComplete}
              size="lg"
              className="gap-2 px-8 bg-accent hover:bg-accent/90"
              disabled={isCompleting}
            >
              <Check className="w-5 h-5" />
              {isCompleting ? "Saving..." : "Complete Exercise"}
            </Button>
          )}
        </div>

        {isCompleted && (
          <div className="text-center p-4 rounded-lg bg-accent/15 border border-accent/30">
            <p className="font-semibold text-accent">
              ✓ Exercise completed in {formatTime(seconds)}!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Great work! Your session has been saved.
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Take your time completing this exercise. The timer tracks your actual completion time, which helps us understand your pace and provide personalized recommendations in the future.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
