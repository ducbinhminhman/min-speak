import { useConversation } from "@elevenlabs/react"
import { useState, useEffect, useRef } from "react"
import { ANIMATION } from "@/lib/config/ui-constants"
import { getLastItem } from "@/lib/utils/array-helpers"
import type { Message } from "@/lib/types"

interface UseElevenLabsConversationProps {
  onEndSession: (messages: Message[]) => void
  micMuted: boolean
}

export function useElevenLabsConversation({
  onEndSession,
  micMuted,
}: UseElevenLabsConversationProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messageHistoryRef = useRef<Message[]>([])
  const sessionEndedRef = useRef(false)

  const handleEndSession = async () => {
    console.log("🔚 [Live Chat] Ending session with", messages.length, "messages")
    if (sessionEndedRef.current) {
      console.log("⚠️ [Live Chat] Session already ended, skipping...")
      return
    }
    sessionEndedRef.current = true
    await conversation.endSession()
    onEndSession(messages)
  }

  // Helper: Add user message to history
  const addUserMessage = (content: string) => {
    setMessages((prev) => {
      const updated = [
        ...prev,
        {
          role: "user" as const,
          content,
          timestamp: new Date(),
        },
      ]
      messageHistoryRef.current = updated
      return updated
    })
  }

  // Helper: Update or add agent message (supports streaming)
  const updateAgentMessage = (content: string) => {
    setMessages((prev) => {
      const lastMsg = getLastItem(prev)
      let updated: Message[]
      
      if (lastMsg && lastMsg.role === "agent") {
        // Update existing agent message (streaming)
        updated = [
          ...prev.slice(0, -1),
          { ...lastMsg, content },
        ]
      } else {
        // Add new agent message
        updated = [
          ...prev,
          {
            role: "agent" as const,
            content,
            timestamp: new Date(),
          },
        ]
      }
      
      messageHistoryRef.current = updated
      return updated
    })
  }

  const conversation = useConversation({
    micMuted,
    // Client-side handler for end_call system tool
    clientTools: {
      end_call: ({ reason, message }: { reason: string; message?: string }) => {
        console.log("🛑 [Tool] end_call called by AI")
        console.log("   Reason:", reason)
        if (message) console.log("   Message:", message)
        handleEndSession()
      },
    },
    onConnect: () => {
      console.log("✅ Connected to ElevenLabs Agent")
      setIsConnecting(false)
    },
    onDisconnect: () => {
      console.log("🔌 Disconnected from ElevenLabs Agent")
      console.log("   sessionEndedRef.current:", sessionEndedRef.current)
      console.log("   messageHistoryRef.current.length:", messageHistoryRef.current.length)
      
      // Workaround: Small delay to allow server-side disconnect event to propagate
      // before triggering analysis (prevents race condition)
      setTimeout(() => {
        if (!sessionEndedRef.current) {
          console.log("🔄 Server ended call, triggering analysis with", messageHistoryRef.current.length, "messages")
          onEndSession(messageHistoryRef.current)
          sessionEndedRef.current = true
        }
      }, ANIMATION.SESSION_END_DELAY_MS)
    },
    onMessage: (message) => {
      console.log("📨 Message:", message)

      // Handle user messages
      if (message.source === "user" && message.message) {
        addUserMessage(message.message)
      }

      // Handle agent messages (streaming support)
      if (message.source === "ai" && message.message) {
        updateAgentMessage(message.message)
      }
    },
    onError: (error) => {
      console.error("❌ Conversation error:", error)
      setError("Connection error. Please try again.")
      setIsConnecting(false)
    },
    onStatusChange: (status) => {
      console.log("🔄 Status changed:", status)
    },
  })

  // Start conversation on mount
  useEffect(() => {
    const startConversation = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })

        const response = await fetch("/api/elevenlabs-signed-url")
        if (!response.ok) {
          throw new Error("Failed to get signed URL")
        }

        const { signedUrl } = await response.json()

        await conversation.startSession({ signedUrl })
        console.log("🎙️ Conversation started")
      } catch (err: any) {
        console.error("❌ Failed to start conversation:", err)
        setError(err.message || "Failed to start conversation")
        setIsConnecting(false)
      }
    }

    startConversation()

    return () => {
      if (conversation.status === "connected") {
        conversation.endSession()
      }
    }
  }, [])

  return {
    messages,
    isConnecting,
    error,
    conversation,
    handleEndSession,
  }
}
