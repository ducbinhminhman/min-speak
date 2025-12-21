"use client"

import { Button } from "@mantine/core"
import { MessageSquare, Globe } from "lucide-react"

interface ModeSelectionModalProps {
  onSelectMode: (mode: "chat" | "immersive") => void
  onCancel: () => void
}

export function ModeSelectionModal({ onSelectMode, onCancel }: ModeSelectionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 md:p-10 max-w-lg w-full mx-4 shadow-2xl">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          How do you want to practice?
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Choose your conversation style
        </p>

        {/* Mode Options */}
        <div className="space-y-4">
          {/* Chat Mode */}
          <Button
            onClick={() => onSelectMode("chat")}
            size="lg"
            variant="outline"
            className="w-full h-auto py-5 px-5 flex flex-col items-start gap-2 text-left hover:bg-blue-50 hover:border-blue-500 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-base">💬 See Your Chat</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed w-full">
              View messages with bubbles
            </p>
          </Button>

          {/* Immersive Mode */}
          <Button
            onClick={() => onSelectMode("immersive")}
            size="lg"
            variant="outline"
            className="w-full h-auto py-5 px-5 flex flex-col items-start gap-2 text-left hover:bg-purple-50 hover:border-purple-500 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 transition-colors shrink-0">
                <Globe className="w-5 h-5 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-base">🌍 Engage in Our World</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed w-full">
              Avatar only, no text
            </p>
          </Button>
        </div>

        {/* Cancel Button */}
        <div className="mt-6">
          <Button
            onClick={onCancel}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  )
}
