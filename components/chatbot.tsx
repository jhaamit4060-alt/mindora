"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Loader2, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "bot" | "user"
  content: string
}

const API_BASE_URL = "https://mindora-fastapi-chatbot.onrender.com"

export function Chatbot({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isCrisis, setIsCrisis] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !isInitialized && !isInitializing) {
      initializeChat()
    }
  }, [isOpen, isInitialized, isInitializing])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const initializeChat = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch(`${API_BASE_URL}/chat/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      })

      if (response.ok) {
        setIsInitialized(true)
        setMessages([{ role: "bot", content: "Hi, I’m here to help you use Mindora. What would you like to do?" }])
      } else {
        throw new Error("Failed to initialize chat")
      }
    } catch (error) {
      console.error("[Mindora Chatbot] Init Error:", error)
      setMessages([{ role: "bot", content: "Sorry, I'm having trouble connecting right now. Please try again later." }])
    } finally {
      setIsInitializing(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !isInitialized || isCrisis) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: userId,
          message: userMessage,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const botReply = data.reply

        // Crisis check (simulated as instructed)
        const distressKeywords = ["suicide", "hurt myself", "kill myself", "end it all"]
        const isDistressed = distressKeywords.some((word) => userMessage.toLowerCase().includes(word))

        if (isDistressed) {
          setIsCrisis(true)
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content:
                "I'm very sorry you're feeling this way. I am just a help assistant and not equipped for crisis support. Please visit our Help & Safety page immediately for professional resources.",
            },
          ])
        } else {
          setMessages((prev) => [...prev, { role: "bot", content: botReply }])
        }
      } else {
        throw new Error("Failed to get reply")
      }
    } catch (error) {
      console.error("[Mindora Chatbot] Chat Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "I encountered an error. Please check your connection." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-[90vw] sm:w-[380px] h-[500px] shadow-2xl border-primary/20 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary p-4 flex flex-row items-center justify-between space-y-0 rounded-t-xl">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5" />
              Mindora Help Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700",
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {(isLoading || isInitializing) && (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Assistant is thinking...</span>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t flex flex-col gap-2">
            {isCrisis ? (
              <Button asChild className="w-full bg-destructive hover:bg-destructive/90 text-white">
                <a href="/help-safety" className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Go to Help & Safety
                </a>
              </Button>
            ) : (
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isInitialized ? "Type your message..." : "Initializing assistant..."}
                  disabled={!isInitialized || isLoading || isCrisis}
                  className="rounded-xl border-primary/20 focus-visible:ring-primary"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!isInitialized || isLoading || !input.trim() || isCrisis}
                  className="rounded-xl shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
            <p className="text-[10px] text-center text-muted-foreground">
              This is a self-help assistant, not professional care.
            </p>
          </CardFooter>
        </Card>
      )}

      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95",
          isOpen ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white" : "bg-primary text-white",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}
