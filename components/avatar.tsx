"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AvatarProps {
  state: "idle" | "listening" | "speaking"
  size?: "sm" | "md" | "lg"
}

export function Avatar({ state, size = "md" }: AvatarProps) {
  // Helper function to get correct GIF path
  const getAvatarSrc = (state: "idle" | "listening" | "speaking") => {
    return `/avatar/${state}.gif`
  }

  const sizeClasses = {
    sm: "w-24 h-24 md:w-28 md:h-28",
    md: "w-32 h-32 md:w-40 md:h-40",
    lg: "w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64",
  }

  const ringClasses = {
    sm: "w-32 h-32 md:w-36 md:h-36",
    md: "w-44 h-44 md:w-52 md:h-52",
    lg: "w-52 h-52 md:w-64 md:h-64 lg:w-80 lg:h-80",
  }

  const imageSizes = {
    sm: { width: 112, height: 112 },
    md: { width: 160, height: 160 },
    lg: { width: 256, height: 256 },
  }

  // Animation variants for gentle breathing effect
  const breatheVariants = {
    idle: { scale: [1, 1.02, 1] },
    listening: { scale: 1.05 },
    speaking: { scale: 1.1 },
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated rings for listening/speaking states */}
      {state === "listening" && (
        <>
          <motion.div
            className={cn(
              "absolute rounded-full bg-gradient-to-br from-primary/30 to-accent/20",
              ringClasses[size],
            )}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={cn(
              "absolute rounded-full bg-gradient-to-br from-primary/20 to-accent/15",
              ringClasses[size],
            )}
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          />
        </>
      )}
      {state === "speaking" && (
        <>
          <motion.div
            className={cn(
              "absolute rounded-full bg-gradient-to-br from-accent/30 to-primary/20",
              ringClasses[size],
            )}
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={cn(
              "absolute rounded-full bg-gradient-to-br from-accent/20 to-primary/15",
              ringClasses[size],
            )}
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.div
            className={cn(
              "absolute rounded-full bg-gradient-to-br from-accent/15 to-primary/10",
              ringClasses[size],
            )}
            animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
        </>
      )}

      {/* GIF Avatar with Framer Motion */}
      <motion.div
        className={cn(
          "relative rounded-full flex items-center justify-center overflow-hidden",
          sizeClasses[size],
          state === "idle" && "shadow-xl shadow-primary/10",
          state === "listening" && "shadow-2xl shadow-primary/20",
          state === "speaking" && "shadow-2xl shadow-accent/20",
        )}
        animate={breatheVariants[state]}
        transition={{ 
          duration: state === "idle" ? 3 : 0.5, 
          repeat: state === "idle" ? Infinity : 0,
          ease: "easeInOut" 
        }}
      >
        <Image
          src={getAvatarSrc(state)}
          alt={`Avatar ${state}`}
          width={imageSizes[size].width}
          height={imageSizes[size].height}
          className="w-full h-full object-cover"
          priority
          unoptimized
        />
      </motion.div>
    </div>
  )
}
