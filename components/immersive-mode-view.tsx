import Image from "next/image"
import { Send } from "lucide-react"
import { StopInstructionBanner } from "@/components/shared/stop-instruction-banner"
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
            onClick={onEndSession}
            className="text-white hover:text-white hover:bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm transition-colors text-sm md:text-lg"
          >
            <Send className="w-6 h-6 mr-2 inline" />
            End & Analyze
          </button>
        </div>

        {/* Stop Instruction
        <StopInstructionBanner maxWidth="md" />
         */}

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
