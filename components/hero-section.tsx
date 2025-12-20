"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"

interface HeroSectionProps {
  onModeSelect: (mode: "full" | "quick" | "conversation" | "live") => void
}

export function HeroSection({ onModeSelect }: HeroSectionProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

  const phrases = [
    "feeling, in new words",
    "learn to express myself",
    "I believe in myself",
    "speak, gently",
  ]

  // Simple phrase rotation every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [phrases.length])

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Subtle pattern background - CSS only */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(120 113 108) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Optional: Lotus image background (much lighter than video) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div 
          className="w-full h-full bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: "url('/avartar/lotus-bg.png')",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12">
        <div className="text-center space-y-8">
          {/* Title - Thương */}
          <h1 
            className="text-7xl sm:text-8xl md:text-9xl font-serif font-bold tracking-tight animate-fade-in gradient-text"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Thương
          </h1>

          {/* Rotating phrase */}
          <p 
            className="text-2xl sm:text-3xl font-light text-stone-600 lowercase tracking-wide min-h-[2.5rem] animate-fade-in-delay transition-opacity duration-500"
            key={currentPhraseIndex}
          >
            {phrases[currentPhraseIndex]}
          </p>

          {/* Action Buttons - Immediately visible */}
          <div className="space-y-4 pt-6 animate-fade-in-delay-2">
            <Button
              onClick={() => onModeSelect("full")}
              size="lg"
              className="w-full h-14 text-base sm:text-lg font-semibold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <span>📚</span>
                <span>Full Practice</span>
              </span>
            </Button>

            <Button
              onClick={() => onModeSelect("quick")}
              size="lg"
              variant="outline"
              className="w-full h-14 text-base sm:text-lg font-semibold rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-stone-300 hover:border-amber-400 text-stone-800 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <span>⚡</span>
                <span>Quick Translation</span>
              </span>
            </Button>

            <Button
              onClick={() => onModeSelect("conversation")}
              size="lg"
              variant="outline"
              className="w-full h-14 text-base sm:text-lg font-semibold rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-300 hover:border-emerald-400 text-stone-800 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <span>💬</span>
                <span>Conversation Only</span>
              </span>
            </Button>

            <Button
              onClick={() => onModeSelect("live")}
              size="lg"
              className="w-full h-14 text-base sm:text-lg font-semibold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <span>🎙️</span>
                <span>Live Chat (AI Agent)</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
