"use client"

import { ArrowLeft, CheckCircle2, AlertCircle, BookOpen, Lightbulb } from "lucide-react"

interface SentenceAnalysis {
  original: string
  improved: string
  issues: string[]
  tips: string
}

interface AreaToImprove {
  area: string
  explanation: string
  examples: string[]
}

interface VocabSuggestion {
  word: string
  meaning: string
  example: string
  context: string
}

interface ConversationAnalysisScreenProps {
  sentenceAnalysis: SentenceAnalysis[]
  overallStrengths: string[]
  areasToImprove: AreaToImprove[]
  vocabularySuggestions: VocabSuggestion[]
  summary: string
  onBack: () => void
  isLoading?: boolean
}

export function ConversationAnalysisScreen({
  sentenceAnalysis,
  overallStrengths,
  areasToImprove,
  vocabularySuggestions,
  summary,
  onBack,
  isLoading = false,
}: ConversationAnalysisScreenProps) {
  
  if (isLoading) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-svh px-6 relative"
        style={{
          backgroundImage: "url('/background/night.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          {/* Animated Icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center animate-pulse">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
            {/* Rotating border */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
          
          {/* Loading dots */}
          <div className="flex space-x-2 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          
          {/* Text */}
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Analyzing Your Conversation
          </h2>
          <p className="text-base text-white/80 mb-6">
            AI is reviewing your sentences and preparing detailed feedback...
          </p>
          
          {/* Progress indicators */}
          <div className="w-full space-y-3 bg-white/50 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-white">Processing conversation transcript</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-white">Analyzing sentence patterns</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-300"></div>
              <span className="text-white/60">Generating personalized feedback</span>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-white/60 italic">
            This usually takes 10-15 seconds
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-svh relative"
      style={{
        backgroundImage: "url('/background/night.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      
      {/* Content */}
      <div className="relative z-10 min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/30 border-b border-white/20">
        <div className="px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="text-white hover:text-white hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Home
          </button>
          <h1 className="text-lg font-semibold text-white">📊 Conversation Analysis</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-4xl mx-auto space-y-8">
        
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 shadow-lg border-2 border-blue-200/50">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Overall Summary
          </h2>
          <p className="text-base leading-relaxed text-foreground/90">{summary}</p>
        </div>

        {/* Strengths */}
        {overallStrengths && overallStrengths.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Your Strengths
            </h2>
            <ul className="space-y-2">
              {overallStrengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-base">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sentence-by-Sentence Analysis */}
        {sentenceAnalysis && sentenceAnalysis.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Detailed Sentence Analysis
            </h2>
            <div className="space-y-6">
              {sentenceAnalysis.map((analysis, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                  {/* Original */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-muted-foreground mb-1">You said:</p>
                    <p className="text-base italic text-foreground/70">"{analysis.original}"</p>
                  </div>
                  
                  {/* Improved */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-green-700 mb-1">Better way:</p>
                    <p className="text-base font-medium text-green-800">"{analysis.improved}"</p>
                  </div>
                  
                  {/* Issues */}
                  {analysis.issues && analysis.issues.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-orange-700 mb-1">Issues noticed:</p>
                      <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                        {analysis.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Tips */}
                  {analysis.tips && (
                    <div className="bg-blue-50 rounded-lg p-3 mt-2">
                      <p className="text-sm font-medium text-blue-900 mb-1">💡 Tip:</p>
                      <p className="text-sm text-blue-800">{analysis.tips}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Areas to Improve */}
        {areasToImprove && areasToImprove.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              Areas to Focus On
            </h2>
            <div className="space-y-4">
              {areasToImprove.map((area, index) => (
                <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
                  <h3 className="font-semibold text-lg text-orange-800 mb-2">{area.area}</h3>
                  <p className="text-base mb-2 text-foreground/80">{area.explanation}</p>
                  {area.examples && area.examples.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Examples:</p>
                      <ul className="list-disc list-inside text-sm space-y-1 text-foreground/70">
                        {area.examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vocabulary Suggestions */}
        {vocabularySuggestions && vocabularySuggestions.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              Vocabulary to Learn
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {vocabularySuggestions.map((vocab, index) => (
                <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
                  <h3 className="font-bold text-lg text-foreground mb-1">{vocab.word}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{vocab.meaning}</p>
                  <div className="bg-white/70 rounded-lg p-2 mb-2">
                    <p className="text-sm italic text-foreground/80">"{vocab.example}"</p>
                  </div>
                  {vocab.context && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">When to use:</span> {vocab.context}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Action */}
        <div className="flex justify-center pt-4 pb-8">
          <button
            onClick={onBack}
            className="h-14 px-8 text-base font-medium rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Practice Again
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
