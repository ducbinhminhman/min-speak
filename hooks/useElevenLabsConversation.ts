import { useConversation } from "@elevenlabs/react"
import { useState, useEffect, useRef } from "react"

export interface Message {
  role: "user" | "agent"
  content: string
  timestamp: Date
}

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
  const messagesRef = useRef<Message[]>([])
  const hasEndedRef = useRef(false)

  const handleEndSession = async () => {
    console.log("🔚 [Live Chat] Ending session with", messages.length, "messages")
    if (hasEndedRef.current) {
      console.log("⚠️ [Live Chat] Session already ended, skipping...")
      return
    }
    hasEndedRef.current = true
    await conversation.endSession()
    onEndSession(messages)
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
      console.log("   hasEndedRef.current:", hasEndedRef.current)
      console.log("   messagesRef.current.length:", messagesRef.current.length)
      // If disconnected by server (end_call tool), trigger analysis
      setTimeout(() => {
        if (!hasEndedRef.current) {
          console.log("🔄 Server ended call, triggering analysis with", messagesRef.current.length, "messages")
          onEndSession(messagesRef.current)
          hasEndedRef.current = true
        }
      }, 100)
    },
    onMessage: (message) => {
      console.log("📨 Message:", message)

      // Handle user messages
      if (message.source === "user" && message.message) {
        setMessages((prev) => {
          const updated = [
            ...prev,
            {
              role: "user" as const,
              content: message.message,
              timestamp: new Date(),
            },
          ]
          messagesRef.current = updated
          return updated
        })
      }

      // Handle agent messages
      if (message.source === "ai" && message.message) {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1]
          let updated: Message[]
          if (lastMsg && lastMsg.role === "agent") {
            // Update last agent message (streaming)
            updated = [
              ...prev.slice(0, -1),
              {
                ...lastMsg,
                content: message.message,
              },
            ]
          } else {
            // Add new agent message
            updated = [
              ...prev,
              {
                role: "agent" as const,
                content: message.message,
                timestamp: new Date(),
              },
            ]
          }
          messagesRef.current = updated
          return updated
        })
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
