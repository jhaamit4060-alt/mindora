"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const ONBOARDING_STEPS = [
  {
    header: "Welcome Abroad",
    subheader: "Let's set up your private wellness space",
    title: "Your mental wellness journey begins here",
    description:
      "Mindora is designed to be your companion in managing stress. Whether it's exam pressure or work-life balance, we're here to support you.",
  },
  {
    header: "Safety First",
    subheader: "Learn how we protect your information",
    title: "Your privacy is our top priority",
    description:
      "Everything you log—from moods to journal entries—is encrypted and private. We never share your personal data with third parties.",
  },
  {
    header: "Important Note",
    subheader: "Understanding the tool's purpose",
    title: "Mindora is a self-help companion",
    description:
      "This app provides evidence-based techniques for everyday stress. It is not a clinical treatment or crisis service. Always consult a professional for medical needs.",
  },
  {
    header: "Ready to Start?",
    subheader: "Take the first step toward calm",
    title: "Use what works, leave the rest",
    description:
      "Explore features at your own pace. There's no right or wrong way to use Mindora. It's your space, your rules.",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  const completeOnboarding = async () => {
    setIsCompleting(true)
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      })

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        console.error("[v0] Failed to complete onboarding")
        setIsCompleting(false)
      }
    } catch (error) {
      console.error("[v0] Onboarding completion error:", error)
      setIsCompleting(false)
    }
  }

  const step = ONBOARDING_STEPS[currentStep]
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl space-y-8 animate-fadeIn">
        <div className="flex justify-center gap-2">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"}`}
            />
          ))}
        </div>

        <Card className="shadow-2xl border-primary/10">
          <CardContent className="pt-8 pb-6 px-6 sm:px-10">
            <div className="space-y-8">
              <div className="space-y-1">
                <span className="text-primary font-bold text-sm tracking-widest uppercase">{step.header}</span>
                <p className="text-muted-foreground text-sm">{step.subheader}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground leading-tight">{step.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button onClick={handleNext} disabled={isCompleting} className="flex-1">
                  {isLastStep ? (isCompleting ? "Getting started..." : "Get started") : "Continue"}
                </Button>
                {!isLastStep && (
                  <Button onClick={handleSkip} variant="outline" disabled={isCompleting}>
                    Skip
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}
          </p>
        </div>
      </div>
    </div>
  )
}
