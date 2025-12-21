"use client"

import { Button, Text } from "@mantine/core"

interface HeroSectionProps {
  onModeSelect: (mode: "full" | "quick" | "conversation" | "live") => void
}

export function HeroSection({ onModeSelect }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/hero.png')" }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 md:px-8 lg:px-12">
        
        <div className="w-full max-w-2xl justify-center text-center space-y-6 md:space-y-8 pt-12 md:pt-0">
          
          {/* Header text */}
          <h1 className="mb-4 text-balance text-pretty text-3xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">What do you want to practice today?</h1>

          {/* Buttons */}
          <div className="flex flex-col items-center gap-4 pt-4 md:pt-6 w-1/2 md:w-full max-w-xs mx-auto">

            <Button
              onClick={() => onModeSelect("full")}
              variant="gradient"
              gradient={{ from: "indigo", to: "grape", deg: 85 }}
              size="xl"
              radius="xl"
              fullWidth
            >
              Full Practice
            </Button>

            <Button
              onClick={() => onModeSelect("quick")}
              variant="gradient"
              gradient={{ from: "indigo", to: "grape", deg: 85 }}
              size="xl"
              radius="xl"
              fullWidth
            >
              Translation
            </Button>

            <Button
              onClick={() => onModeSelect("conversation")}
              variant="gradient"
              gradient={{ from: "indigo", to: "grape", deg: 85 }}
              size="xl"
              radius="xl"
              fullWidth
            >
              Chat Only
            </Button>

            <Button
              onClick={() => onModeSelect("live")}
              variant="gradient"
              gradient={{ from: "indigo", to: "grape", deg: 85 }}
              size="xl"
              radius="xl"
              fullWidth
            >
              Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
