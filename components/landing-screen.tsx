"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function LandingScreen() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-svh overflow-hidden">
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/avatar/hero-video.mp4" type="video/mp4" />
          <source src="/avatar/hero-video.webm" type="video/webm" />
        </video>
        
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/20 backdrop-blur-[1px]" />
      </div>

      {/* 8-Column Grid Layout */}
      <div className="w-full h-full relative z-10 px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-8 gap-4 h-full items-center max-w-7xl mx-auto">
          
          {/* LEFT: Text "we practice" (2 columns) */}
          <motion.div 
            className="col-span-8 md:col-span-2 flex flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground/90 drop-shadow-lg leading-tight">
              we<br />practice
            </h1>
            <motion.p
              className="mt-4 text-sm md:text-base text-foreground/70 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Every conversation brings you closer to fluency 💪
            </motion.p>
          </motion.div>

          {/* MIDDLE: Blank space for video/flower (3 columns) */}
          <div className="hidden md:block md:col-span-3" />

          {/* RIGHT: 3 Practice Options (2 columns) */}
          <motion.div 
            className="col-span-8 md:col-span-2 flex flex-col gap-3.5 justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/full-practice" className="block">
              <motion.div
                whileHover={{ scale: 1.03, x: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-semibold rounded-full bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 border-0 backdrop-blur-sm justify-start px-6"
                >
                  📚 Full Practice
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/quick-translation" className="block">
              <motion.div
                whileHover={{ scale: 1.03, x: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-base font-semibold rounded-full bg-card/90 backdrop-blur-md hover:bg-card border-2 border-border/60 hover:border-primary/40 transition-all duration-300 shadow-xl hover:shadow-2xl justify-start px-6"
                >
                  ⚡ Quick Translation
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/conversation-only" className="block">
              <motion.div
                whileHover={{ scale: 1.03, x: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-base font-semibold rounded-full bg-gradient-to-r from-accent/30 to-primary/20 backdrop-blur-md hover:from-accent/40 hover:to-primary/30 border-2 border-accent/50 hover:border-accent/70 transition-all duration-300 shadow-xl hover:shadow-2xl justify-start px-6"
                >
                  💬 Conversation Only
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Last column - padding/spacing */}
          <div className="hidden md:block md:col-span-1" />

        </div>
      </div>
    </div>
  )
}
