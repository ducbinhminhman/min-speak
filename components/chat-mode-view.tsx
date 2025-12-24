import { useRef, useEffect } from "react"
import { Send, Mic, MicOff } from "lucide-react"
import { Avatar } from "@/components/avatar"
import { cn } from "@/lib/utils"
import type { Message } from "@/hooks/useElevenLabsConversation"

interface ChatModeViewProps {
  messages: Message[]
  isConnecting: boolean
  error: string | null
  isSpeaking: boolean
  connectionStatus: "connected" | "connecting" | "disconnected"
  micMuted: boolean
  onEndSession: () => void
  onToggleMute: () => void
}

export function ChatModeView({
  messages,
  isConnecting,
  error,
  isSpeaking,
  connectionStatus,
  micMuted,
  onEndSession,
  onToggleMute,
}: ChatModeViewProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
          <div className="text-sm md:text-lg font-medium text-white">Live Chat</div>
          <button
            onClick={onEndSession}
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
                <p className="mt-6 text-white text-sm">Connecting to AI agent...</p>
                <div className="flex space-x-2 mt-4">
                  <div
                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
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
                    <Avatar state={isSpeaking ? "speaking" : "idle"} size="lg" />
                    <p className="mt-6 text-white text-sm">
                      {isSpeaking ? "AI is speaking..." : "Start speaking to begin the conversation"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
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
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                  connectionStatus === "connected"
                    ? "bg-green-500/20 text-green-700"
                    : "bg-gray-500/20 text-gray-700"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    connectionStatus === "connected" ? "bg-green-500" : "bg-gray-500"
                  )}
                />
                {connectionStatus === "connected" ? "Connected" : "Disconnected"}
              </div>
            </div>

            <button
              onClick={onToggleMute}
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

          {isSpeaking && <p className="text-center text-sm text-muted-foreground mt-4">AI is speaking...</p>}
        </div>
      )}
    </div>
  )
}
