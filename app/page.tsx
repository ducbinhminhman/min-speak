"use client"

import { HeroSection } from "@/components/hero-section"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const handleModeSelect = (mode: "full" | "quick" | "conversation" | "live") => {
    if (mode === "full") {
      router.push("/full-practice")
    } else if (mode === "quick") {
      router.push("/quick-translation")
    } else if (mode === "live") {
      router.push("/live-chat")
    } else {
      router.push("/conversation-only")
    }
  }

  return (
    <main>
      <HeroSection onModeSelect={handleModeSelect} />
    </main>
  )
}
