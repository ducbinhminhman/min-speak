import { BookOpen } from "lucide-react"
import { ANIMATION, TIMINGS } from "@/lib/config/ui-constants"

interface AnalysisLoadingScreenProps {
  isLoading: boolean
}

export function AnalysisLoadingScreen({ isLoading }: AnalysisLoadingScreenProps) {
  if (!isLoading) return null

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
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" 
            style={{ animationDuration: ANIMATION.LOADING_SPINNER_DURATION }}
          />
        </div>
        
        {/* Loading dots */}
        <div className="flex space-x-2 mb-6">
          <div 
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: ANIMATION.BOUNCE_DELAYS.FIRST }}
          />
          <div 
            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" 
            style={{ animationDelay: ANIMATION.BOUNCE_DELAYS.SECOND }}
          />
          <div 
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: ANIMATION.BOUNCE_DELAYS.THIRD }}
          />
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
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-white">Analyzing sentence patterns</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-300" />
            <span className="text-white/60">Generating personalized feedback</span>
          </div>
        </div>
        
        <p className="mt-6 text-sm text-white/60 italic">
          This usually takes {TIMINGS.EXPECTED_ANALYSIS_SECONDS} seconds
        </p>
      </div>
    </div>
  )
}
