"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, CheckCircle2 } from "lucide-react"
import { ConsentModal } from "@/components/consent-modal"
import { downloadAnalyticsReport } from "@/lib/analytics-download"

interface AnalyticsExportProps {
  userId: string
  stats: {
    avgMood: number
    allMoods: any[]
    highestMood: number
    lowestMood: number
    moodVariance: number
  }
}

export function AnalyticsExport({ userId, stats }: AnalyticsExportProps) {
  const [showConsent, setShowConsent] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Generate and download the report
      await downloadAnalyticsReport(userId, stats)

      // Save consent record to database
      const response = await fetch("/api/consent/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "report_download",
          timestamp: new Date().toISOString(),
          metadata: {
            avgMood: stats.avgMood,
            entryCount: stats.allMoods.length,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to record consent")
      }

      setDownloadSuccess(true)
      setShowConsent(false)

      // Reset success message after 3 seconds
      setTimeout(() => setDownloadSuccess(false), 3000)
    } catch (error) {
      console.error("[v0] Download failed:", error)
      alert("Failed to download report. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-primary" />
            Export Your Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Download a comprehensive PDF report of your emotional intelligence analytics for professional or personal use.
              We'll record your consent for this download.
            </p>

            {downloadSuccess && (
              <div className="p-4 rounded-lg bg-accent/15 border border-accent/50 flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-accent">Report Downloaded Successfully</p>
                  <p className="text-xs text-accent/80">
                    Your consent has been recorded and stored securely in your account.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowConsent(true)}
            disabled={isDownloading}
            size="lg"
            className="gap-2 w-full sm:w-auto"
          >
            <FileDown className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Generate & Download Report"}
          </Button>
        </CardContent>
      </Card>

      <ConsentModal
        isOpen={showConsent}
        onAccept={handleDownload}
        onCancel={() => setShowConsent(false)}
        title="Download Report - Consent Required"
        description="To download your emotional intelligence report, please confirm that you consent to us recording this download along with the following information:"
      />
    </>
  )
}
