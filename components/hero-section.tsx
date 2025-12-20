"use client"

import { useRotatingPhrase } from "@/lib/utils"
import { Button } from "./ui/button"

interface HeroSectionProps {
  onModeSelect: (mode: "full" | "quick" | "conversation" | "live") => void
}

const PHRASES = [
  "feeling, in new words",
  "learn to express myself",
  "I believe in myself",
  "speak, gently",
]

export function HeroSection({ onModeSelect }: HeroSectionProps) {
  const currentPhrase = useRotatingPhrase(PHRASES, 4000)

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Watercolor Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-center bg-cover bg-no-repeat opacity-100"
          style={{
            backgroundImage: "url('/hero.png')",
          }}
        />
      </div>

      {/* Grid Container */}
      <div className="relative z-10 min-h-screen grid grid-cols-4 md:grid-cols-12 gap-4 px-4 md:px-8 lg:px-12 items-center">
        
        {/* Content - Centered on grid */}
        <div className="col-span-4 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4 text-center space-y-6 md:space-y-8">
          
          {/* Title */}
          <h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight animate-fade-in gradient-text"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Thương
          </h1>

          {/* Rotating phrase */}
          <p 
            className="text-xl sm:text-2xl md:text-3xl font-light text-stone-600 lowercase tracking-wide min-h-[2rem] md:min-h-[2.5rem] animate-fade-in-delay transition-opacity duration-500"
            key={currentPhrase}
          >
            {currentPhrase}
          </p>

          {/* Buttons - Vertical stack */}
          <div className="grid grid-cols-1 gap-4 pt-4 md:pt-6 animate-fade-in-delay-2">
            <Button
              onClick={() => onModeSelect("full")}
              variant="default"
              size="hero"
              className="w-full"
            >
              Full Practice
            </Button>

            <Button
              onClick={() => onModeSelect("quick")}
              variant="outline"
              size="hero"
              className="w-full"
            >
              Quick Translation
            </Button>

            <Button
              onClick={() => onModeSelect("conversation")}
              variant="outline"
              size="hero"
              className="w-full"
            >
              Conversation Only
            </Button>

            <Button
              onClick={() => onModeSelect("live")}
              variant="secondary"
              size="hero"
              className="w-full"
            >
              Live Chat
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
