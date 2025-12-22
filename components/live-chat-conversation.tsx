"use client"

import { useState } from "react"
import { useElevenLabsConversation } from "@/hooks/useElevenLabsConversation"
import { ImmersiveModeView } from "@/components/immersive-mode-view"
import { ChatModeView } from "@/components/chat-mode-view"
import type { Message } from "@/hooks/useElevenLabsConversation"

interface LiveChatConversationProps {
  onEndSession: (messages: Message[]) => void
  subMode: "chat" | "immersive"
}

export function LiveChatConversation({ onEndSession, subMode }: LiveChatConversationProps) {
  const [micMuted, setMicMuted] = useState(false)

  const { messages, isConnecting, error, conversation, handleEndSession } = useElevenLabsConversation({
    onEndSession,
    micMuted,
  })

  const toggleMute = () => {
    setMicMuted(!micMuted)
  }

  const sharedProps = {
    isConnecting,
    error,
    isSpeaking: conversation.isSpeaking,
    connectionStatus: (conversation.status === "disconnecting" 
      ? "disconnected" 
      : conversation.status) as "disconnected" | "connecting" | "connected",
    onEndSession: handleEndSession,
  }

  if (subMode === "immersive") {
    return <ImmersiveModeView {...sharedProps} />
  }

  return <ChatModeView {...sharedProps} messages={messages} micMuted={micMuted} onToggleMute={toggleMute} />
}

