"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Trash2, Plus, BookOpen, Lock, Mic, MicOff, FileDown } from "lucide-react"
import type { JournalEntry } from "@/lib/types"

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/journal")
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries || [])
      }
    } catch (err) {
      console.error("Error fetching journal entries:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Please write something first")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const url = editingEntry ? `/api/journal/${editingEntry._id}` : "/api/journal"
      const method = editingEntry ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          date: new Date(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Something went wrong")
        setIsSaving(false)
        return
      }

      setContent("")
      setEditingEntry(null)
      setIsDialogOpen(false)
      fetchEntries()
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setContent(entry.content)
    setIsDialogOpen(true)
  }

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) {
      return
    }

    try {
      const response = await fetch(`/api/journal/${entryId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchEntries()
      }
    } catch (err) {
      console.error("Error deleting entry:", err)
    }
  }

  const handleNewEntry = () => {
    setEditingEntry(null)
    setContent("")
    setError("")
    setIsDialogOpen(true)
  }

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error)
      setError(`Speech error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }

      if (finalTranscript) {
        setContent((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript))
      }
    }

    recognition.start()
  }

  const handleExportPdf = (entry: JournalEntry) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const date = new Date(entry.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const content = `
      <html>
        <head>
          <title>Journal Entry - ${date}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            .header { border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; }
            .date { color: #666; font-size: 0.9em; }
            .content { white-space: pre-wrap; font-size: 1.1em; }
            .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 10px; font-size: 0.8em; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Mindora Journal Entry</h1>
            <p class="date">${date}</p>
          </div>
          <div class="content">${entry.content}</div>
          <div class="footer">Exported from Mindora Wellness Companion</div>
        </body>
      </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
  }

  const getEntrySize = (content: string) => {
    const bytes = new Blob([content]).size
    const kb = bytes / 1024
    if (kb < 100) return `Small - ${kb.toFixed(1)} KB`
    if (kb < 1000) return `Medium - ${kb.toFixed(1)} KB`
    return `Large - ${(kb / 1024).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary/90 to-primary p-10 md:p-16 text-white shadow-xl">
          <div className="relative z-10 flex items-center justify-between gap-8 flex-wrap">
            <div className="space-y-5 flex-1 min-w-[300px]">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                <span>Private Journal</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-balance">Your Journal</h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                A private space for your thoughts, feelings, and reflections. Express yourself freely.
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleNewEntry}
                  size="lg"
                  className="h-14 px-8 bg-white text-secondary hover:bg-white/90 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{editingEntry ? "Edit entry" : "New journal entry"}</DialogTitle>
                  <DialogDescription className="text-base">
                    Write down your thoughts, feelings, or anything on your mind
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="relative">
                    <Textarea
                      placeholder="Start writing... This is your private space."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={16}
                      disabled={isSaving}
                      className="resize-none text-base pr-12"
                    />
                    <Button
                      size="icon"
                      variant={isListening ? "destructive" : "secondary"}
                      className={`absolute bottom-4 right-4 h-10 w-10 rounded-full shadow-lg transition-all ${
                        isListening ? "animate-pulse" : ""
                      }`}
                      onClick={toggleListening}
                      disabled={isSaving}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSaving || !content.trim()} size="lg">
                      {isSaving ? "Saving..." : editingEntry ? "Update entry" : "Save entry"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <Alert className="border-secondary/40 bg-secondary/10 dark:bg-secondary/5">
            <Lock className="h-5 w-5 text-secondary" />
            <AlertDescription className="text-base leading-relaxed ml-2">
              <strong className="font-semibold text-secondary-foreground">100% Private:</strong> Your journal entries
              are encrypted and visible only to you. We never read, share, or use your personal writings.
            </AlertDescription>
          </Alert>

          {isLoading ? (
            <Card className="shadow-xl">
              <CardContent className="py-16">
                <p className="text-center text-muted-foreground text-lg">Loading your journal...</p>
              </CardContent>
            </Card>
          ) : entries.length === 0 ? (
            <Card className="shadow-xl border-secondary/20">
              <CardContent className="py-20">
                <div className="text-center space-y-6 max-w-md mx-auto">
                  <BookOpen className="w-20 h-20 mx-auto text-secondary/50" />
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">Start Your Journey</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      You haven't written any journal entries yet. Begin documenting your thoughts, feelings, and
                      experiences today.
                    </p>
                  </div>
                  <Button onClick={handleNewEntry} size="lg" className="h-14 px-8">
                    <Plus className="mr-2 h-5 w-5" />
                    Write your first entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {entries.map((entry) => (
                <Card key={entry._id} className="shadow-lg hover:shadow-xl transition-shadow border-secondary/20 group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg font-semibold">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardTitle>
                        <CardDescription className="text-sm flex items-center justify-between">
                          <span>
                            {new Date(entry.date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {getEntrySize(entry.content)}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleExportPdf(entry)}
                          className="hover:bg-primary/10 text-primary"
                        >
                          <FileDown className="h-4 w-4" />
                          <span className="sr-only">Export PDF</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry)}
                          className="hover:bg-secondary/10"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit entry</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry._id)}
                          className="hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete entry</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed whitespace-pre-wrap line-clamp-6">{entry.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
