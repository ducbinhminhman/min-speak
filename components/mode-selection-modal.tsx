"use client"

import { MessageSquare, Globe, ArrowLeft, type LucideIcon } from "lucide-react"
import Image from "next/image"
import { IoChevronBack } from "react-icons/io5";

interface ModeSelectionModalProps {
  onSelectMode: (mode: "chat" | "immersive") => void
  onCancel: () => void
}

interface ModeCardProps {
  title: string
  description: string
  features: string[]
  gradientFrom: string
  gradientTo: string
  previewImage: string
  icon: LucideIcon
  onClick: () => void
}

function ModeCard({ 
  title, 
  description, 
  features, 
  gradientFrom, 
  gradientTo, 
  previewImage,
  icon: Icon,
  onClick 
}: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-2/3 md:w-full md:h-[480px] group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientFrom} ${gradientTo} backdrop-blur-md border-2 border-white/30 py-3 px-4 md:p-8 transition-all duration-300 hover:scale-105 hover:border-white/60 hover:shadow-2xl`}
    >
      {/* Preview Image */}
      <div className="hidden md:block relative h-64 mb-6 rounded-2xl overflow-hidden bg-white/10">
        <Image
          src={previewImage}
          alt={`${title} preview`}
          fill
          loading="eager"
          quality={75}
          className="object-cover"
          sizes="(max-width: 768px) 0vw, 50vw"
        />
      </div>

      {/* Content */}
      <div className="text-center md:text-left">
        <div className="flex flex-col items-center md:flex-row md:items-center gap-3 mb-3">
          <div className="hidden w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <p className="hidden md:block text-white/90 text-md leading-relaxed mb-4">
          {description}
        </p>
        <div className="hidden md:block flex items-center gap-2 text-white/80 text-md">
          {features.map((feature, index) => (
            <span key={feature}>
              ✓ {feature}
              {index < features.length - 1 && <span className="mx-1">•</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white text-lg">→</span>
      </div>
    </button>
  )
}

export function ModeSelectionModal({ onSelectMode, onCancel }: ModeSelectionModalProps) {
  return (
    <div className="min-h-svh flex flex-col relative">
      {/* Background Image */}
      <Image
        src="/background/forest.png"
        alt="Forest background"
        fill
        priority
        quality={85}
        className="object-cover"
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMyZDRhMmIiLz48L3N2Zz4="
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-[1]" />
      
      {/* Back button */}
      <div className="relative z-[3] px-6 pt-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-white/90 hover:text-white"
        >
          <IoChevronBack className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>


      {/* Content */}
      <div className="relative z-[2] flex-1 flex items-center justify-center px-6 pb-20 md:pb-20">
        <div className="max-w-6xl mx-auto w-full">
        {/* Title */}
        <div className="text-center mb-12 pt-6 md:pt-0">
          <h2 className="text-3xl md:text-4xl gradient-text-pink-orange font-bold text-white mb-3">
            Choose Your Practice Mode
          </h2>
          <p className="text-lg md:text-lg text-white/80">
            Select the conversation style that suits you best
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto justify-items-center md:justify-items-stretch">
          <ModeCard
            title="Chat Mode"
            description="See your conversation with message bubbles. Perfect for tracking what you said and visual learners."
            features={["Message history", "Visual feedback"]}
            gradientFrom="from-blue-500/90"
            gradientTo="to-blue-600/90"
            previewImage="/background/chat.png"
            icon={MessageSquare}
            onClick={() => onSelectMode("chat")}
          />

          <ModeCard
            title="Immersive Mode"
            description="Fullscreen avatar only, no text. Immerse yourself in natural conversation like talking to a real person."
            features={["Distraction-free", "Natural flow"]}
            gradientFrom="from-purple-500/90"
            gradientTo="to-purple-600/90"
            previewImage="/background/immersive.png"
            icon={Globe}
            onClick={() => onSelectMode("immersive")}
          />
        </div>
      </div>
      </div>
    </div>
  )
}
