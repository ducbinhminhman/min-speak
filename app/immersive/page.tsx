"use client"

import { useRouter } from "next/navigation"
import { LiveChatConversation } from "@/components/live-chat-conversation"
import { MIN_MESSAGES_FOR_ANALYSIS } from "@/lib/config/constants"
import { convertToApiFormat } from "@/lib/services/conversation.service"
import type { Message } from "@/lib/types"

export default function ImmersivePage() {
  const router = useRouter()

  const handleEndSession = (messages: Message[]) => {
    const userMessages = messages.filter(msg => msg.role === "user")
    
    if (userMessages.length < MIN_MESSAGES_FOR_ANALYSIS) {
      console.log("⚠️ [Immersive] Too few messages for analysis, skipping...")
      router.push("/")
      return
    }

    console.log("📊 [Immersive] Starting analysis with", userMessages.length, "user messages")
    
    // Store messages and navigate immediately to show loading
    const conversationHistory = convertToApiFormat(messages)
    sessionStorage.setItem("conversationMessages", JSON.stringify(conversationHistory))
    sessionStorage.setItem("analysisLoading", "true")
    
    router.push("/analysis")
  }

  return (
    <main className="min-h-svh">
      <LiveChatConversation 
        onEndSession={handleEndSession}
        subMode="immersive"
      />
    </main>
  )
}
