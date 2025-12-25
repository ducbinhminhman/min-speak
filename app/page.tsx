"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeroLanding } from "@/components/hero-landing"
import { ModeSelectionModal } from "@/components/mode-selection-modal"

export default function Home() {
  const router = useRouter()
  const [showModeSelection, setShowModeSelection] = useState(false)

  const handleStartPractice = () => {
    setShowModeSelection(true)
  }

  const handleModeSelection = (mode: "chat" | "immersive") => {
    // Navigate to the selected mode route
    router.push(`/${mode}`)
  }

  const handleCancelModeSelection = () => {
    setShowModeSelection(false)
  }

  return (
    <main className="min-h-svh">
      {!showModeSelection && (
        <HeroLanding onStartPractice={handleStartPractice} />
      )}

      {showModeSelection && (
        <ModeSelectionModal
          onSelectMode={handleModeSelection}
          onCancel={handleCancelModeSelection}
        />
      )}
    </main>
  )
}
