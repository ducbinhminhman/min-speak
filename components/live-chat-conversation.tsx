"use client"

import { useConversation } from "@elevenlabs/react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Avatar } from "@/components/avatar"
import { Square, Mic, MicOff, Send } from "lucide-react"

interface LiveChatConversationProps {
  onEndSession: (messages: Message[]) => void
  subMode: "chat" | "immersive"
}

interface Message {
  role: "user" | "agent"
  content: string
  timestamp: Date
}

export function LiveChatConversation({ onEndSession, subMode }: LiveChatConversationProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [micMuted, setMicMuted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const conversation = useConversation({
    micMuted,
    onConnect: () => {
      console.log("✅ Connected to ElevenLabs Agent")
      setIsConnecting(false)
    },
    onDisconnect: () => {
      console.log("🔌 Disconnected from ElevenLabs Agent")
    },
    onMessage: (message) => {
      console.log("📨 Message:", message)
      
      // Handle user messages
      if (message.source === "user" && message.message) {
        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: message.message,
            timestamp: new Date(),
          },
        ])
      }
      
      // Handle agent messages
      if (message.source === "ai" && message.message) {
        setMessages((prev) => {
          // Check if last message is from agent (to avoid duplicates during streaming)
          const lastMsg = prev[prev.length - 1]
          if (lastMsg && lastMsg.role === "agent") {
            // Update last agent message
            return [
              ...prev.slice(0, -1),
              {
                ...lastMsg,
                content: message.message,
              },
            ]
          }
          // Add new agent message
          return [
            ...prev,
            {
              role: "agent",
              content: message.message,
              timestamp: new Date(),
            },
          ]
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

  useEffect(() => {
    const startConversation = async () => {
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true })
        
        // Get signed URL from our API
        const response = await fetch("/api/elevenlabs-signed-url")
        
        if (!response.ok) {
          throw new Error("Failed to get signed URL")
        }
        
        const { signedUrl } = await response.json()
        
        // Start conversation with WebRTC (better for real-time)
        await conversation.startSession({
          signedUrl,
        })
        
        console.log("🎙️ Conversation started")
      } catch (err: any) {
        console.error("❌ Failed to start conversation:", err)
        setError(err.message || "Failed to start conversation")
        setIsConnecting(false)
      }
    }

    startConversation()

    // Cleanup
    return () => {
      if (conversation.status === "connected") {
        conversation.endSession()
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleEndSession = async () => {
    console.log("🔚 [Live Chat] Ending session with", messages.length, "messages")
    await conversation.endSession()
    onEndSession(messages)
  }

  const toggleMute = () => {
    setMicMuted(!micMuted)
  }

  // Get avatar state for immersive mode
  const getAvatarState = () => {
    if (conversation.isSpeaking) return "speaking"
    if (isConnecting) return "listening"
    return "idle"
  }

  // IMMERSIVE MODE: Fullscreen avatar layout
  if (subMode === "immersive") {
    return (
      <div className="relative min-h-svh overflow-hidden bg-black">
        {/* Fullscreen Background Avatar */}
        <Image
          src={`/worldavatar/${getAvatarState()}.gif`}
          alt="AI Avatar"
          fill
          className="object-cover"
          priority
          unoptimized
        />

        {/* Dark overlay for better UI visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

        {/* Floating UI */}
        <div className="relative z-10 flex flex-col min-h-svh">
          {/* Minimal Header */}
          <div className="w-full px-6 py-4 flex justify-end">
            <button
              onClick={handleEndSession}
              className="text-white hover:text-white hover:bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm transition-colors text-sm md:text-lg"
            >
              <Send className="w-6 h-6 mr-2 inline" />
              End & Analyze
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Error Display */}
          {error && (
            <div className="px-6 pb-4">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-red-500/90 backdrop-blur-sm text-white text-sm text-center">
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Status Indicator */}
          {!isConnecting && !error && (
            <div className="px-6 pb-8">
              <div className="max-w-md mx-auto flex justify-center">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm",
                  conversation.status === "connected" 
                    ? "bg-green-500/20 text-white" 
                    : "bg-gray-500/20 text-white"
                )}>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    conversation.status === "connected" ? "bg-green-500" : "bg-gray-500"
                  )} />
                  {conversation.isSpeaking ? "AI is speaking..." : "Listening..."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // CHAT MODE: Original layout with messages
  return (
    <div 
      className="flex flex-col min-h-svh relative"
      style={{
        backgroundImage: "url('/background/sea.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-svh">
      {/* Header */}
      <div className="w-full px-6 py-4 flex justify-between items-center">
        <div className="text-sm md:text-lg font-medium text-white">
          Live Chat
        </div>
        <button
          onClick={handleEndSession}
          className="text-white hover:text-white hover:bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm transition-colors text-sm md:text-lg"
        >
          <Send className="w-6 h-6 mr-2 inline" />
          End & Analyze
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="max-w-2xl mx-auto">
          
          {/* Connecting State */}
          {isConnecting && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <Avatar state="listening" size="lg" />
              <p className="mt-6 text-white text-sm">
                Connecting to AI agent...
              </p>
              <div className="flex space-x-2 mt-4">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isConnecting && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="p-6 rounded-3xl bg-destructive/10 text-destructive">
                <p className="font-semibold mb-2">Connection Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Connected - Show Messages */}
          {!isConnecting && !error && (
            <>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <Avatar 
                    state={conversation.isSpeaking ? "speaking" : "idle"} 
                    size="lg" 
                  />
                  <p className="mt-6 text-white text-sm">
                    {conversation.isSpeaking 
                      ? "AI is speaking..." 
                      : "Start speaking to begin the conversation"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/80 text-foreground"
                        )}
                      >
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>

      {/* Bottom Controls */}
      {!isConnecting && !error && (
        <div className="px-6 pb-8 pt-4">
          <div className="max-w-2xl mx-auto flex gap-3 justify-center items-center">
            <div className="text-center">
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                conversation.status === "connected" 
                  ? "bg-green-500/20 text-green-700" 
                  : "bg-gray-500/20 text-gray-700"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  conversation.status === "connected" ? "bg-green-500" : "bg-gray-500"
                )} />
                {conversation.status === "connected" ? "Connected" : "Disconnected"}
              </div>
            </div>
            
            <button
              onClick={toggleMute}
              className="rounded-full px-6 py-3 border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all text-white font-medium"
            >
              {micMuted ? (
                <>
                  <MicOff className="w-5 h-5 mr-2 inline" />
                  Unmute
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2 inline" />
                  Mute
                </>
              )}
            </button>
          </div>
          
          {conversation.isSpeaking && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              AI is speaking...
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
