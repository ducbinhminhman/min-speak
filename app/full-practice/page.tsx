"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ConversationMode } from "@/components/conversation-mode"
import { FeedbackScreen } from "@/components/feedback-screen"
import { ReflectiveChat } from "@/components/reflective-chat"
import { DiaryScreen } from "@/components/diary-screen"

type FullPracticeScreen = "conversation" | "feedback" | "chat" | "diary"

export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface FeedbackData {
  bestVersion: string
  vocabularySuggestions: { word: string; meaning: string; example: string }[]
  grammarStructures: { structure: string; explanation: string; example: string }[]
  summary: string
  conversationHistory: ConversationMessage[]
}

export default function FullPracticePage() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<FullPracticeScreen>("conversation")
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
  const [chatContext, setChatContext] = useState<{ vietnameseText: string; englishText: string } | null>(null)
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [diaryData, setDiaryData] = useState<{
    authenticVersion: string
    literaryVersion: string
    date: string
    time: string
  } | null>(null)
  const [isGeneratingDiary, setIsGeneratingDiary] = useState(false)

  const handleEndSession = async (history: ConversationMessage[]) => {
    setConversationHistory(history)
    setIsGeneratingFeedback(true)
    setCurrentScreen("feedback")
    
    // Store conversation history in sessionStorage
    sessionStorage.setItem('conversationHistory', JSON.stringify(history))
    
    try {
      console.log("📊 [Feedback] Requesting AI analysis for conversation...")
      
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationHistory: history }),
      })

      if (!response.ok) {
        throw new Error(`Feedback API error: ${response.status}`)
      }

      const data = await response.json()
      
      console.log("✅ [Feedback] Received AI-generated feedback:", data)
      
      setFeedbackData({
        ...data,
        conversationHistory: history,
      })
      
      // Store context for potential reflective chat
      setChatContext({
        vietnameseText: history[0]?.content || "",
        englishText: history[1]?.content || ""
      })
      
      // Store in sessionStorage
      sessionStorage.setItem('chatContext', JSON.stringify({
        vietnameseText: history[0]?.content || "",
        englishText: history[1]?.content || ""
      }))
    } catch (error) {
      console.error("❌ [Feedback] Failed to generate feedback:", error)
      
      // Fallback to basic feedback if API fails
      setFeedbackData({
        bestVersion: "Unable to generate feedback at this time.",
        vocabularySuggestions: [],
        grammarStructures: [],
        summary: "Good work practicing! Keep it up and you'll continue to improve.",
        conversationHistory: history,
      })
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  const handleBackToLanding = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('conversationHistory')
    sessionStorage.removeItem('chatContext')
    sessionStorage.removeItem('chatHistory')
    
    router.push("/")
  }

  const handleShareWithMe = () => {
    setCurrentScreen("chat")
  }

  const handleGetDiary = async () => {
    // Generate diary directly from conversation (skip reflective chat)
    setIsGeneratingDiary(true)
    setCurrentScreen("diary")
    
    try {
      console.log("📔 [Diary] Generating diary entries (no chat)...")
      
      const response = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vietnameseText: chatContext?.vietnameseText || "",
          englishText: chatContext?.englishText || "",
          chatHistory: [] // No reflective chat
        }),
      })

      if (!response.ok) {
        throw new Error(`Diary API error: ${response.status}`)
      }

      const data = await response.json()
      
      console.log("✅ [Diary] Received diary entries:", data)
      
      setDiaryData(data)
    } catch (error) {
      console.error("❌ [Diary] Failed to generate diary:", error)
      
      // Fallback to basic diary if API fails
      const now = new Date()
      setDiaryData({
        authenticVersion: "Today I practiced speaking and translating.",
        literaryVersion: "Today marked another step in my language learning journey.",
        date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      })
    } finally {
      setIsGeneratingDiary(false)
    }
  }

  const handleEndChat = async () => {
    // Generate diary automatically
    setIsGeneratingDiary(true)
    setCurrentScreen("diary")
    
    try {
      console.log("📔 [Diary] Generating diary entries...")
      
      const response = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vietnameseText: chatContext?.vietnameseText || "",
          englishText: chatContext?.englishText || "",
          chatHistory: chatHistory
        }),
      })

      if (!response.ok) {
        throw new Error(`Diary API error: ${response.status}`)
      }

      const data = await response.json()
      
      console.log("✅ [Diary] Received diary entries:", data)
      
      setDiaryData(data)
    } catch (error) {
      console.error("❌ [Diary] Failed to generate diary:", error)
      
      // Fallback to basic diary if API fails
      const now = new Date()
      setDiaryData({
        authenticVersion: "Today I practiced speaking and reflecting on my day.",
        literaryVersion: "Today marked another step in my journey of language and self-discovery.",
        date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      })
    } finally {
      setIsGeneratingDiary(false)
    }
  }

  const handleDiaryDone = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('conversationHistory')
    sessionStorage.removeItem('chatContext')
    sessionStorage.removeItem('chatHistory')
    
    router.push("/")
  }

  return (
    <main className="min-h-svh">
      {currentScreen === "conversation" && (
        <ConversationMode onEndSession={handleEndSession} mode="full" />
      )}
      
      {currentScreen === "feedback" && (
        <FeedbackScreen 
          data={feedbackData} 
          onBack={handleBackToLanding}
          onShareWithMe={handleShareWithMe}
          onGetDiary={handleGetDiary}
          isLoading={isGeneratingFeedback}
        />
      )}
      
      {currentScreen === "chat" && chatContext && (
        <ReflectiveChat
          initialContext={chatContext}
          onEndChat={handleEndChat}
          onChatHistoryUpdate={setChatHistory}
        />
      )}
      
      {currentScreen === "diary" && (
        <DiaryScreen
          authenticVersion={diaryData?.authenticVersion || ""}
          literaryVersion={diaryData?.literaryVersion || ""}
          date={diaryData?.date || ""}
          time={diaryData?.time || ""}
          onDone={handleDiaryDone}
          isLoading={isGeneratingDiary}
        />
      )}
    </main>
  )
}
