"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ConversationAnalysisScreen } from "@/components/conversation-analysis-screen"
import { FALLBACK_FEEDBACK } from "@/lib/config/constants"
import type { ConversationAnalysis } from "@/lib/types"

export default function AnalysisPage() {
  const router = useRouter()
  const [analysisData, setAnalysisData] = useState<ConversationAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalysis = async () => {
      // Check if we have messages to analyze
      const storedMessages = sessionStorage.getItem("conversationMessages")
      const storedLoading = sessionStorage.getItem("analysisLoading")
      
      if (!storedMessages) {
        console.log("⚠️ [Analysis] No messages found, redirecting to home")
        router.push("/")
        return
      }

      // If we're in loading state, fetch the analysis
      if (storedLoading === "true") {
        console.log("📤 [Analysis] Fetching analysis...")
        
        try {
          const response = await fetch("/api/conversation-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationHistory: JSON.parse(storedMessages) }),
          })

          if (!response.ok) {
            throw new Error(`Analysis API error: ${response.status}`)
          }

          const data = await response.json()
          
          console.log("✅ [Analysis] Analysis complete")
          setAnalysisData(data)
          setIsLoading(false)
          
          // Clear messages and update loading state
          sessionStorage.removeItem("conversationMessages")
          sessionStorage.setItem("analysisLoading", "false")
        } catch (error) {
          console.error("❌ [Analysis] Fetch failed:", error)
          
          // Use fallback feedback
          setAnalysisData({
            ...FALLBACK_FEEDBACK,
            summary: "Great job completing your session! Keep practicing to build fluency."
          })
          setIsLoading(false)
          
          sessionStorage.removeItem("conversationMessages")
          sessionStorage.setItem("analysisLoading", "false")
        }
      } else {
        // Data already loaded (shouldn't happen with new flow, but just in case)
        setIsLoading(false)
      }
    }

    fetchAnalysis()
  }, [router])

  const handleBackToHome = () => {
    // Clear session storage
    sessionStorage.removeItem("conversationMessages")
    sessionStorage.removeItem("analysisLoading")
    router.push("/")
  }

  return (
    <main className="min-h-svh">
      <ConversationAnalysisScreen
        sentenceAnalysis={analysisData?.sentenceAnalysis || []}
        overallStrengths={analysisData?.overallStrengths || []}
        areasToImprove={analysisData?.areasToImprove || []}
        vocabularySuggestions={analysisData?.vocabularySuggestions || []}
        summary={analysisData?.summary || ""}
        onBack={handleBackToHome}
        isLoading={isLoading}
      />
    </main>
  )
}
