"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UserAnalyticsChart from "@/components/user-analytics-chart"
import {
  Calendar,
  TrendingUp,
  ActivityIcon,
  BookOpen,
  Lightbulb,
  Shield,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  FileText,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type Range = "day" | "week" | "month"

export default function UserAnalyticsContent() {
  const [range, setRange] = useState<Range>("week")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [includePersonalDetails, setIncludePersonalDetails] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)
  const [downloadType, setDownloadType] = useState<"pdf" | "excel">("pdf")

  useEffect(() => {
    setLoading(true)
    fetch(`/api/user/analytics?range=${range}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .finally(() => setLoading(false))
  }, [range])

  const handleDownloadPDF = () => {
    setDownloadType("pdf")
    setShowDownloadDialog(true)
  }

  const handleDownloadExcel = () => {
    setDownloadType("excel")
    setShowDownloadDialog(true)
  }

  const confirmDownload = () => {
    if (!consentGiven) {
      alert("Please confirm that you understand this contains sensitive data")
      return
    }

    const url =
      downloadType === "pdf"
        ? `/api/user/report/pdf?range=${range}&includePersonal=${includePersonalDetails}`
        : `/api/user/report/excel?range=${range}&includePersonal=${includePersonalDetails}`

    if (downloadType === "pdf") {
      window.open(url, "_blank")
    } else {
      window.location.href = url
    }

    // Reset dialog state
    setShowDownloadDialog(false)
    setIncludePersonalDetails(false)
    setConsentGiven(false)
  }

  const hasData = data && data.totalEntries > 0

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-md">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">Time Range</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {(["day", "week", "month"] as Range[]).map((r) => (
            <Button
              key={r}
              size="lg"
              variant={range === r ? "default" : "outline"}
              onClick={() => setRange(r)}
              className="min-w-[100px]"
            >
              {r === "day" ? "Today" : r === "week" ? "This Week" : "This Month"}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">Loading your analytics...</p>
          </CardContent>
        </Card>
      )}

      {!loading && !hasData && (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Start Tracking Your Wellness</h3>
              <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
                Your analytics will appear here once you begin logging your moods and activities. Start your wellness
                journey today!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button size="lg" asChild>
                <a href="/mood">Log Your Mood</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/journal">Write in Journal</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && hasData && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
              title="Average Mood"
              value={data.avgMood}
              subtitle="Your emotional state"
              icon={<TrendingUp className="w-6 h-6" />}
              color="primary"
              trend={data.moodTrend}
              comparison={data.moodComparison}
            />
            <SummaryCard
              title="Check-ins"
              value={data.totalEntries}
              subtitle="Mood entries logged"
              icon={<ActivityIcon className="w-6 h-6" />}
              color="secondary"
              trend={data.entriesTrend}
              comparison={data.entriesComparison}
            />
            <SummaryCard
              title="Journal Entries"
              value={data.journals}
              subtitle="Personal reflections"
              icon={<BookOpen className="w-6 h-6" />}
              color="accent"
              trend={data.journalsTrend}
              comparison={data.journalsComparison}
            />
          </div>

          {data.insights && data.insights.length > 0 && (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">Personal Insights</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">AI-powered analysis of your wellness patterns</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.insights.map((insight: any, idx: number) => (
                  <InsightCard key={idx} insight={insight} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Chart */}
          <Card className="shadow-xl border-primary/20">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Mood Trend
              </CardTitle>
              <p className="text-muted-foreground">Visual representation of your emotional wellness over time</p>
            </CardHeader>
            <CardContent className="p-6">
              <UserAnalyticsChart data={data.chart} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/30 shadow-lg">
            <CardContent className="p-8 md:p-10 space-y-6">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-2xl font-bold">Personal Wellness Summary</h3>
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Export your self-reported wellness data for personal review or discussion with a trained
                    professional. Reports include mood patterns, observations, and discussion points for your{" "}
                    {range === "day" ? "daily" : range === "week" ? "weekly" : "monthly"} wellness journey.
                  </p>
                </div>

                {!showDownloadDialog ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      onClick={handleDownloadPDF}
                      className="gap-2 px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all flex-1"
                      variant="default"
                    >
                      <FileText className="w-5 h-5" />
                      Download PDF Summary
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleDownloadExcel}
                      className="gap-2 px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all flex-1 bg-transparent"
                      variant="outline"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      Download Excel Summary
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 p-6 bg-background border border-border rounded-lg">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Privacy Options
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <Checkbox
                          id="includePersonal"
                          checked={includePersonalDetails}
                          onCheckedChange={(checked) => setIncludePersonalDetails(checked as boolean)}
                        />
                        <div className="space-y-1">
                          <Label htmlFor="includePersonal" className="text-base font-medium cursor-pointer">
                            Include personal details (name, email, phone, address, DOB)
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            By default, your report will only include wellness data without identifying information.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <Checkbox
                          id="consent"
                          checked={consentGiven}
                          onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                        />
                        <div className="space-y-1">
                          <Label
                            htmlFor="consent"
                            className="text-base font-medium cursor-pointer text-amber-900 dark:text-amber-100"
                          >
                            I confirm this contains sensitive data
                          </Label>
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            This report contains personal wellness information. Please store it securely.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button size="lg" onClick={confirmDownload} disabled={!consentGiven} className="flex-1">
                          Confirm & Download
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => {
                            setShowDownloadDialog(false)
                            setIncludePersonalDetails(false)
                            setConsentGiven(false)
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold text-foreground">Your Data, Your Control</p>
                  <p className="text-muted-foreground leading-relaxed">
                    All your wellness data is private and belongs to you. Reports are generated securely and never
                    stored on our servers. You can download, share with healthcare providers, or delete your data
                    anytime.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  comparison,
}: {
  title: string
  value: any
  subtitle: string
  icon: React.ReactNode
  color: string
  trend?: "up" | "down" | "stable"
  comparison?: string
}) {
  return (
    <Card className={`border-${color}/30 bg-${color}/5 hover:shadow-lg transition-all hover:scale-105`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`text-${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-5xl font-bold text-${color} mb-2`}>{value}</div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        {comparison && trend && (
          <div className="mt-3 flex items-center gap-1.5 text-sm">
            {trend === "up" && <ArrowUp className="w-4 h-4 text-green-600" />}
            {trend === "down" && <ArrowDown className="w-4 h-4 text-red-600" />}
            {trend === "stable" && <Minus className="w-4 h-4 text-muted-foreground" />}
            <span
              className={
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
              }
            >
              {comparison}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InsightCard({
  insight,
}: { insight: { type: string; message: string; sentiment: "positive" | "neutral" | "caution" } }) {
  const sentimentColors = {
    positive: "bg-green-50 border-green-200 text-green-900",
    neutral: "bg-blue-50 border-blue-200 text-blue-900",
    caution: "bg-amber-50 border-amber-200 text-amber-900",
  }

  const sentimentIcons = {
    positive: "✨",
    neutral: "💡",
    caution: "⚠️",
  }

  return (
    <div className={`p-4 rounded-lg border ${sentimentColors[insight.sentiment]}`}>
      <div className="flex gap-3">
        <span className="text-2xl flex-shrink-0">{sentimentIcons[insight.sentiment]}</span>
        <div className="space-y-1">
          <p className="font-semibold text-sm">{insight.type}</p>
          <p className="text-sm leading-relaxed">{insight.message}</p>
        </div>
      </div>
    </div>
  )
}
