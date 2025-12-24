import { useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImmersiveModeViewProps {
  isConnecting: boolean
  error: string | null
  isSpeaking: boolean
  connectionStatus: "connected" | "connecting" | "disconnected"
  onEndSession: () => void
}

export function ImmersiveModeView({
  isConnecting,
  error,
  isSpeaking,
  connectionStatus,
  onEndSession,
}: ImmersiveModeViewProps) {
  const getAvatarState = () => {
    if (isSpeaking) return "speaking"
    if (isConnecting) return "listening"
    return "idle"
  }

  const currentState = getAvatarState()
  
  const idleVideoRef = useRef<HTMLVideoElement>(null)
  const listeningVideoRef = useRef<HTMLVideoElement>(null)
  const speakingVideoRef = useRef<HTMLVideoElement>(null)

  // Smart prediction: Only keep current + predicted next video active
  useEffect(() => {
    const predictedNext = 
      currentState === "idle" ? "listening" :
      currentState === "listening" ? "speaking" : "idle"

    // Manage idle video
    if (idleVideoRef.current) {
      if (currentState === "idle") {
        idleVideoRef.current.play().catch(() => {})
      } else if (predictedNext === "idle") {
        idleVideoRef.current.play().catch(() => {})
      } else {
        idleVideoRef.current.pause()
        idleVideoRef.current.currentTime = 0
      }
    }

    // Manage listening video
    if (listeningVideoRef.current) {
      if (currentState === "listening") {
        listeningVideoRef.current.play().catch(() => {})
      } else if (predictedNext === "listening") {
        listeningVideoRef.current.play().catch(() => {})
      } else {
        listeningVideoRef.current.pause()
        listeningVideoRef.current.currentTime = 0
      }
    }

    // Manage speaking video
    if (speakingVideoRef.current) {
      if (currentState === "speaking") {
        speakingVideoRef.current.play().catch(() => {})
      } else if (predictedNext === "speaking") {
        speakingVideoRef.current.play().catch(() => {})
      } else {
        speakingVideoRef.current.pause()
        speakingVideoRef.current.currentTime = 0
      }
    }
  }, [currentState])

  return (
    <div className="relative min-h-svh overflow-hidden bg-black">
      {/* Smart video management: current + predicted next only */}
      <video
        ref={idleVideoRef}
        src="/worldavatar/idle.mp4"
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: currentState === "idle" ? 1 : 0,
          visibility: currentState === "idle" ? "visible" : "hidden",
        }}
      />
      <video
        ref={listeningVideoRef}
        src="/worldavatar/listening.mp4"
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: currentState === "listening" ? 1 : 0,
          visibility: currentState === "listening" ? "visible" : "hidden",
        }}
      />
      <video
        ref={speakingVideoRef}
        src="/worldavatar/speaking.mp4"
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: currentState === "speaking" ? 1 : 0,
          visibility: currentState === "speaking" ? "visible" : "hidden",
        }}
      />

      {/* Dark overlay for better UI visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* Floating UI */}
      <div className="relative z-10 flex flex-col min-h-svh">
        {/* Minimal Header */}
        <div className="w-full px-6 py-4 flex justify-end">
          <button
            onClick={onEndSession}
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
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm",
                  connectionStatus === "connected"
                    ? "bg-green-500/20 text-white"
                    : "bg-gray-500/20 text-white"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    connectionStatus === "connected" ? "bg-green-500" : "bg-gray-500"
                  )}
                />
                {isSpeaking ? "AI is speaking..." : "Listening..."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
