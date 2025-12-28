"use client"
import { BsFlower1 } from "react-icons/bs";


interface HeroLandingProps {
  onStartPractice: () => void
}

const FEATURES = [
  {
    title: "Real-Time Voice",
    description: "Natural conversation flow"
  },
  {
    title: "Detailed Feedback",
    description: "Grammar, vocab & tips"
  },
  {
    title: "Immersive Experience",
    description: "Feel like a real chat"
  }
] as const;

export function HeroLanding({ onStartPractice }: HeroLandingProps) {
  return (
    <div 
      className="min-h-svh flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/background/summer.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 text-center">

        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 md:mb-2 leading-tight">
          Tell{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            Thương
          </span>

        </h1>

        {/* Subtext */}
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
        Thương listens and helps you build confidence in expressing yourself.
        </p>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onStartPractice}
          className="py-4 px-12 md:px-16 md:py-3 text-2xl md:text-xl font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 text-white shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Try it Free
        </button>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          {FEATURES.map((feature, index) => (
            <div 
              key={index}
              className="backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 bg-gradient-to-br from-pink-400/40 to-blue-400/40"
            >
              <div className="flex justify-center text-3xl mb-2"><BsFlower1 /></div>
              <h3 className="font-semibold text-xl mb-1">{feature.title}</h3>
              <p className="text-lg text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
