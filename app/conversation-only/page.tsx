"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ConversationOnlyMode } from "@/components/conversation-only-mode"
import { ModeSelectionModal } from "@/components/mode-selection-modal"
import { ConversationAnalysisScreen } from "@/components/conversation-analysis-screen"

export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ConversationAnalysisData {
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

export default function ConversationOnlyPage() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<"modal" | "conversation" | "analysis">("modal")
  const [conversationSubMode, setConversationSubMode] = useState<"chat" | "immersive" | null>(null)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [conversationAnalysisData, setConversationAnalysisData] = useState<ConversationAnalysisData | null>(null)
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)

  const handleModeSelection = (subMode: "chat" | "immersive") => {
    setConversationSubMode(subMode)
    setCurrentScreen("conversation")
  }

  const handleCancelModeSelection = () => {
    router.push("/")
  }

  const handleEndSession = async (history: ConversationMessage[]) => {
    setConversationHistory(history)
    setIsGeneratingAnalysis(true)
    setCurrentScreen("analysis")
    
    // Store conversation history in sessionStorage
    sessionStorage.setItem('conversationHistory', JSON.stringify(history))
    
    try {
      console.log("📊 [Analysis] Requesting detailed conversation analysis...")
      
      const response = await fetch("/api/conversation-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationHistory: history }),
      })

      if (!response.ok) {
        throw new Error(`Analysis API error: ${response.status}`)
      }

      const data = await response.json()
      
      console.log("✅ [Analysis] Received detailed analysis:", data)
      
      setConversationAnalysisData(data)
    } catch (error) {
      console.error("❌ [Analysis] Failed to generate analysis:", error)
      
      // Fallback to basic analysis
      setConversationAnalysisData({
        sentenceAnalysis: [],
        overallStrengths: [
          "You practiced speaking English",
          "You engaged in conversation",
          "You're building confidence"
        ],
        areasToImprove: [],
        vocabularySuggestions: [],
        summary: "Great job practicing! Keep having conversations to build your skills and confidence."
      })
    } finally {
      setIsGeneratingAnalysis(false)
    }
  }

  const handleBackToLanding = () => {
    sessionStorage.removeItem('conversationHistory')
    router.push("/")
  }

  return (
    <main className="min-h-svh">
      {currentScreen === "modal" && (
        <ModeSelectionModal 
          onSelectMode={handleModeSelection}
          onCancel={handleCancelModeSelection}
        />
      )}
      
      {currentScreen === "conversation" && conversationSubMode && (
        <ConversationOnlyMode 
          onEndSession={handleEndSession}
          subMode={conversationSubMode}
        />
      )}
      
      {currentScreen === "analysis" && (
        <ConversationAnalysisScreen
          sentenceAnalysis={conversationAnalysisData?.sentenceAnalysis || []}
          overallStrengths={conversationAnalysisData?.overallStrengths || []}
          areasToImprove={conversationAnalysisData?.areasToImprove || []}
          vocabularySuggestions={conversationAnalysisData?.vocabularySuggestions || []}
          summary={conversationAnalysisData?.summary || ""}
          onBack={handleBackToLanding}
          isLoading={isGeneratingAnalysis}
        />
      )}
    </main>
  )
}
