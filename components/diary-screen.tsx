"use client"

import { useState } from "react"
import { Button } from "@mantine/core"
import { Sparkles, BookOpen } from "lucide-react"

interface DiaryScreenProps {
  authenticVersion: string
  literaryVersion: string
  date: string
  time: string
  onDone: () => void
}

export function DiaryScreen({ 
  authenticVersion, 
  literaryVersion, 
  date, 
  time, 
  onDone 
}: DiaryScreenProps) {
  const [showLiterary, setShowLiterary] = useState(false)

  return (
    <div className="gradient-bg min-h-svh px-6 py-8 md:py-12">
      <div className="max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            📔 Your Diary
          </h1>
          <p className="text-sm text-muted-foreground">
            {date} • {time}
          </p>
        </div>

        {/* Authentic Version */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4 px-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Your Voice</h2>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg">
            <p className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-wrap">
              {authenticVersion}
            </p>
          </div>
        </div>

        {/* Literary Version Toggle/Display */}
        {!showLiterary ? (
          <div className="mb-8">
            <Button
              onClick={() => setShowLiterary(true)}
              size="lg"
              variant="outline"
              className="w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full bg-white/60 hover:bg-white border-2 border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              See Literary Version
            </Button>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 px-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Literary Version</h2>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border-2 border-primary/20">
              <p className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-wrap italic">
                {literaryVersion}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <Button
            onClick={onDone}
            size="lg"
            className="w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
