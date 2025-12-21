"use client"

import { Button } from "@mantine/core"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

interface ConversationMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface FeedbackData {
  bestVersion: string
  vocabularySuggestions: { word: string; meaning: string; example: string }[]
  grammarStructures: { structure: string; explanation: string; example: string }[]
  summary: string
  conversationHistory: ConversationMessage[]
}

interface FeedbackScreenProps {
  data: FeedbackData | null
  onBack: () => void
  onShareWithMe: () => void
  onGetDiary: () => void
  isLoading?: boolean
}

export function FeedbackScreen({ data, onBack, onShareWithMe, onGetDiary, isLoading = false }: FeedbackScreenProps) {
  // Debug logging
  console.log("🔍 [FeedbackScreen] Rendering with data:", data)
  console.log("🔍 [FeedbackScreen] isLoading:", isLoading)
  
  return (
    <div className="gradient-bg min-h-svh px-6 py-8 md:py-12">
      <div className="max-w-sm md:max-w-md lg:max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 md:mb-12">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-white/50">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Feedback</h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mb-4"></div>
            <p className="text-foreground/60 text-sm">Analyzing your conversation...</p>
          </div>
        )}

        {/* Feedback Content */}
        {!isLoading && data && (
          <>
            {/* Summary */}
            <div className="mb-8 p-6 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg">
              <p className="text-foreground leading-relaxed text-sm md:text-base">{data.summary}</p>
            </div>

            {/* Best Version */}
            {data.bestVersion && (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 px-2">
                  ✨ Best English Version
                </h2>
                <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/20 shadow-lg">
                  <p className="text-foreground text-base md:text-lg leading-relaxed font-medium">{data.bestVersion}</p>
                </div>
              </div>
            )}

            {/* Vocabulary Suggestions */}
            {data.vocabularySuggestions && data.vocabularySuggestions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 px-2">
                  📚 Vocabulary to Learn
                </h2>
                <div className="space-y-3">
                  {data.vocabularySuggestions.map((vocab, index) => (
                    <div key={index} className="p-5 rounded-2xl bg-white/50 backdrop-blur-sm shadow-md">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-semibold text-primary text-base md:text-lg">{vocab.word}</span>
                        <span className="text-muted-foreground text-sm">- {vocab.meaning}</span>
                      </div>
                      <p className="text-foreground/80 text-sm italic pl-2 border-l-2 border-primary/30">
                        "{vocab.example}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grammar Structures */}
            {data.grammarStructures && data.grammarStructures.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 px-2">
                  📖 Grammar Patterns to Practice
                </h2>
                <div className="space-y-4">
                  {data.grammarStructures.map((grammar, index) => (
                    <div key={index} className="p-5 rounded-2xl bg-white/50 backdrop-blur-sm shadow-md">
                      <h3 className="font-semibold text-foreground text-base mb-2">{grammar.structure}</h3>
                      <p className="text-foreground/70 text-sm mb-3">{grammar.explanation}</p>
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <p className="text-foreground text-sm italic">Example: {grammar.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onShareWithMe}
                size="lg"
                className="w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                💬 Share with Me
              </Button>
              
              <Button
                onClick={onGetDiary}
                size="lg"
                variant="outline"
                className="w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border-2 border-violet-200 text-violet-900 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                📔 Create My Diary
              </Button>
              
              <Button
                onClick={onBack}
                size="lg"
                variant="outline"
                className="w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full bg-white/80 hover:bg-white border-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start New Practice
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
