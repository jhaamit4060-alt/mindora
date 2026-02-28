"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, X } from "lucide-react"

interface ConsentModalProps {
  isOpen: boolean
  onAccept: () => void
  onCancel: () => void
  title?: string
  description?: string
}

export function ConsentModal({
  isOpen,
  onAccept,
  onCancel,
  title = "Download Report",
  description = "Confirm Report Download",
}: ConsentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleAccept = async () => {
    setIsProcessing(true)
    try {
      await onAccept()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md border-border/50 shadow-premium-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15 text-primary">
              <AlertCircle className="w-5 h-5" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            <div className="bg-muted/40 rounded-lg p-4 space-y-3 border border-border/50">
              <h4 className="font-semibold text-sm">What we'll collect:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Your emotional data and analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Mood history and patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>AI-generated insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Download timestamp for records</span>
                </li>
              </ul>
            </div>

            <p className="text-xs text-muted-foreground">
              By downloading your report, you consent to Mindora storing the download timestamp and consent record in your account history. Your data remains encrypted and private.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? "Downloading..." : "Agree & Download"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
