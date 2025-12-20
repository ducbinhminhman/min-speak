"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Home } from "lucide-react"

interface TranslationScreenProps {
  vietnameseText: string
  englishText: string
  onTranslateAgain: () => void
  onDone: () => void
}

export function TranslationScreen({ 
  vietnameseText, 
  englishText, 
  onTranslateAgain, 
  onDone 
}: TranslationScreenProps) {
  return (
    <div className="gradient-bg min-h-svh px-6 py-8 md:py-12">
      <div className="max-w-sm md:max-w-md lg:max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground text-center">Translation</h1>
        </div>

        {/* Vietnamese Text */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
            🇻🇳 Vietnamese
          </h2>
          <div className="p-6 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg">
            <p className="text-foreground leading-relaxed text-base md:text-lg">
              {vietnameseText || "No Vietnamese text"}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-primary rotate-90" />
          </div>
        </div>

        {/* English Translation */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
            🇺🇸 English
          </h2>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/20 shadow-lg">
            <p className="text-foreground leading-relaxed text-base md:text-lg font-medium">
              {englishText || "No English translation"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onTranslateAgain}
            size="lg"
            className="w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            🔄 Translate Again
          </Button>
          
          <Button
            onClick={onDone}
            size="lg"
            variant="outline"
            className="w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full bg-white/80 hover:bg-white border-2 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
