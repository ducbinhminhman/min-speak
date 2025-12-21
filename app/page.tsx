"use client"

import { useState } from "react"
import { HeroLanding } from "@/components/hero-landing"
import { LiveChatConversation } from "@/components/live-chat-conversation"
import { ConversationAnalysisScreen } from "@/components/conversation-analysis-screen"
import { ModeSelectionModal } from "@/components/mode-selection-modal"

interface Message {
  role: "user" | "agent"
  content: string
  timestamp: Date
}

interface ConversationAnalysisData {
  sentenceAnalysis: {
    original: string
    improved: string
    issues: string[]
    tips: string
  }[]
  overallStrengths: string[]
  areasToImprove: {
    area: string
    explanation: string
    examples: string[]
  }[]
  vocabularySuggestions: {
    word: string
    meaning: string
    example: string
    context: string
  }[]
  summary: string
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "modeSelection" | "conversation" | "analysis">("landing")
  const [subMode, setSubMode] = useState<"chat" | "immersive" | null>(null)
  const [conversationAnalysisData, setConversationAnalysisData] = useState<ConversationAnalysisData | null>(null)
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)

  const handleStartPractice = () => {
    setCurrentScreen("modeSelection")
  }

  const handleModeSelection = (mode: "chat" | "immersive") => {
    setSubMode(mode)
    setCurrentScreen("conversation")
  }

  const handleCancelModeSelection = () => {
    setCurrentScreen("landing")
  }

  const handleEndSession = async (messages: Message[]) => {
    const userMessages = messages.filter(msg => msg.role === "user")
    
    if (userMessages.length < 2) {
      console.log("⚠️ [Live Chat] Too few messages for analysis, skipping...")
      setCurrentScreen("landing")
      setSubMode(null)
      return
    }

    console.log("📊 [Live Chat] Starting analysis with", userMessages.length, "user messages")
    
    setIsGeneratingAnalysis(true)
    setCurrentScreen("analysis")
    
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role === "agent" ? "assistant" : "user",
        content: msg.content,
        timestamp: msg.timestamp,
      }))

      console.log("📤 [Live Chat] Sending to analysis API...")
      
      const response = await fetch("/api/conversation-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationHistory }),
      })

      if (!response.ok) {
        throw new Error(`Analysis API error: ${response.status}`)
      }

      const data = await response.json()
      
      console.log("✅ [Live Chat] Analysis complete:", {
        sentences: data.sentenceAnalysis?.length || 0,
        strengths: data.overallStrengths?.length || 0,
        areas: data.areasToImprove?.length || 0,
        vocab: data.vocabularySuggestions?.length || 0,
      })
      
      setConversationAnalysisData(data)
    } catch (error) {
      console.error("❌ [Live Chat] Analysis failed:", error)
      
      setConversationAnalysisData({
        sentenceAnalysis: [],
        overallStrengths: [
          "You practiced speaking with AI in real-time",
          "You engaged in natural conversation",
          "You're building confidence through practice"
        ],
        areasToImprove: [{
          area: "Keep practicing",
          explanation: "Continue having conversations to improve fluency and confidence",
          examples: ["Practice daily", "Speak naturally", "Don't worry about mistakes"]
        }],
        vocabularySuggestions: [],
        summary: "Great job completing your first live chat! Keep practicing to build fluency and confidence."
      })
    } finally {
      setIsGeneratingAnalysis(false)
    }
  }

  const handleBackToHome = () => {
    setCurrentScreen("landing")
    setSubMode(null)
  }

  return (
    <main className="min-h-svh">
      {currentScreen === "landing" && (
        <HeroLanding onStartPractice={handleStartPractice} />
      )}

      {currentScreen === "modeSelection" && (
        <ModeSelectionModal
          onSelectMode={handleModeSelection}
          onCancel={handleCancelModeSelection}
        />
      )}

      {currentScreen === "conversation" && subMode && (
        <LiveChatConversation 
          onEndSession={handleEndSession}
          subMode={subMode}
        />
      )}
      
      {currentScreen === "analysis" && (
        <ConversationAnalysisScreen
          sentenceAnalysis={conversationAnalysisData?.sentenceAnalysis || []}
          overallStrengths={conversationAnalysisData?.overallStrengths || []}
          areasToImprove={conversationAnalysisData?.areasToImprove || []}
          vocabularySuggestions={conversationAnalysisData?.vocabularySuggestions || []}
          summary={conversationAnalysisData?.summary || ""}
          onBack={handleBackToHome}
          isLoading={isGeneratingAnalysis}
        />
      )}
    </main>
  )
}
