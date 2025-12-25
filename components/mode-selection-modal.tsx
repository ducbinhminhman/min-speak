"use client"

import { MessageSquare, Globe, ArrowLeft } from "lucide-react"
import Image from "next/image"

interface ModeSelectionModalProps {
  onSelectMode: (mode: "chat" | "immersive") => void
  onCancel: () => void
}

export function ModeSelectionModal({ onSelectMode, onCancel }: ModeSelectionModalProps) {
  return (
    <div 
      className="min-h-svh flex flex-col relative"
      style={{
        backgroundImage: "url('/background/forest.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      
      {/* Back button */}
      <div className="relative z-20 px-6 pt-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-white/90 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 md:w-8 md:h-8" />
          <span className="font-medium text-xl md:text-2xl">Back</span>
        </button>
      </div>


      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-20 md:pb-20">
        <div className="max-w-6xl mx-auto w-full">
        {/* Title */}
        <div className="text-center mb-12 pt-6 md:pt-0">
          <h2 className="text-4xl md:text-6xl gradient-text-pink-orange font-bold text-white mb-3">
            Choose Your Practice Mode
          </h2>
          <p className="text-xl md:text-2xl text-white/80">
            Select the conversation style that suits you best
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto justify-items-center md:justify-items-stretch">
          {/* Chat Mode Card */}
          <button
            onClick={() => onSelectMode("chat")}
            className="w-2/3 md:w-full group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-md border-2 border-white/30 py-3 px-4 md:p-8 transition-all duration-300 hover:scale-105 hover:border-white/60 hover:shadow-2xl"
          >
            {/* Preview Image */}
            <div 
              className="hidden md:block relative h-64 mb-6 rounded-2xl overflow-hidden bg-white/10"
              style={{ backgroundImage: "url('/background/chat.png')",}}>
              <div className="absolute inset-0 flex items-center justify-center">
                
              </div>
              {/* Avatar preview */}
            </div>

            {/* Content */}
            <div className="text-center md:text-left">
              <div className="flex flex-col items-center md:flex-row md:items-center gap-3 mb-3">
                <div className="hidden w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Chat Mode</h3>
              </div>
              <p className="hidden md:block text-white/90 text-md leading-relaxed mb-4">
                See your conversation with message bubbles. Perfect for tracking what you said and visual learners.
              </p>
              <div className="hidden md:block flex items-center gap-2 text-white/80 text-md">
                <span>✓ Message history</span>
                <span>•</span>
                <span>✓ Visual feedback</span>
              </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-lg">→</span>
            </div>
          </button>

          {/* Immersive Mode Card */}
          <button
            onClick={() => onSelectMode("immersive")}
            className="w-2/3 md:w-full group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/90 to-purple-600/90 backdrop-blur-md border-2 border-white/30 py-3 px-4 md:p-8 transition-all duration-300 hover:scale-105 hover:border-white/60 hover:shadow-2xl"
          >
            {/* Preview Image */}
            <div className="hidden md:block relative h-64 mb-6 rounded-2xl overflow-hidden bg-white/10">
              <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundImage: "url('/background/immersive.png')",}}>
              </div>
              
            </div>

            {/* Content */}
            <div className="text-center md:text-left">
              <div className="flex flex-col items-center md:flex-row md:items-center gap-3 mb-3">
                <div className="hidden w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Immersive Mode</h3>
              </div>
              <p className="hidden md:block text-white/90 text-md leading-relaxed mb-4">
                Fullscreen avatar only, no text. Immerse yourself in natural conversation like talking to a real person.
              </p>
              <div className="hidden md:block flex items-center gap-2 text-white/80 text-md">
                <span>✓ Distraction-free</span>
                <span>•</span>
                <span>✓ Natural flow</span>
              </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-lg">→</span>
            </div>
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
