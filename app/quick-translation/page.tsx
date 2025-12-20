"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ConversationMode } from "@/components/conversation-mode"
import { TranslationScreen } from "@/components/translation-screen"

export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function QuickTranslationPage() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<"conversation" | "translation">("conversation")
  const [chatContext, setChatContext] = useState<{ vietnameseText: string; englishText: string } | null>(null)

  const handleEndSession = async (history: ConversationMessage[]) => {
    const vietnameseText = history[0]?.content || ""
    
    // Generate English translation using chat API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Translate this Vietnamese to English:\n\n${vietnameseText}`,
          history: [],
          mode: 'conversation'
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        const englishText = data.response || ""
        
        setChatContext({
          vietnameseText,
          englishText
        })
        
        // Store in sessionStorage
        sessionStorage.setItem('translationContext', JSON.stringify({
          vietnameseText,
          englishText
        }))
      } else {
        // Fallback if API fails
        setChatContext({
          vietnameseText,
          englishText: "Translation unavailable"
        })
      }
    } catch (error) {
      console.error("Translation error:", error)
      setChatContext({
        vietnameseText,
        englishText: "Translation unavailable"
      })
    }
    
    setCurrentScreen("translation")
  }

  const handleTranslateAgain = () => {
    setCurrentScreen("conversation")
    setChatContext(null)
    sessionStorage.removeItem('translationContext')
  }

  const handleDone = () => {
    sessionStorage.removeItem('translationContext')
    router.push("/")
  }

  return (
    <main className="min-h-svh">
      {currentScreen === "conversation" && (
        <ConversationMode onEndSession={handleEndSession} mode="quick" />
      )}
      
      {currentScreen === "translation" && chatContext && (
        <TranslationScreen
          vietnameseText={chatContext.vietnameseText}
          englishText={chatContext.englishText}
          onTranslateAgain={handleTranslateAgain}
          onDone={handleDone}
        />
      )}
    </main>
  )
}
