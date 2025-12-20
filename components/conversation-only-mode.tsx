"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/avatar"
import type { ConversationMessage } from "@/app/page"
import { Square, Send } from "lucide-react"

interface ConversationOnlyModeProps {
  onEndSession: (history: ConversationMessage[]) => void
  subMode: "chat" | "immersive"
}

export function ConversationOnlyMode({ onEndSession, subMode }: ConversationOnlyModeProps) {
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationHistory, currentTranscript])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const startRecording = useCallback(async () => {
    setError(null)
    audioChunksRef.current = []
    setIsRecording(true)
    setCurrentTranscript("")
    
    try {
      console.log("🎤 [Conversation] Requesting microphone access...")
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      })
      
      let mimeType = 'audio/webm'
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus'
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4'
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onerror = (event) => {
        console.error("❌ [Conversation] MediaRecorder error:", event)
        setError("Recording error occurred")
        setIsRecording(false)
      }
      
      mediaRecorder.start(100)
      mediaRecorderRef.current = mediaRecorder
      
      console.log("✅ [Conversation] Recording started")
    } catch (e: any) {
      console.error("❌ [Conversation] Failed to start:", e)
      setError(`Microphone access denied: ${e.message}`)
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    setIsRecording(false)
    
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      return
    }
    
    mediaRecorderRef.current.stop()
    
    await new Promise<void>((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => resolve()
      }
    })
    
    const audioBlob = new Blob(audioChunksRef.current, { 
      type: mediaRecorderRef.current.mimeType 
    })
    
    if (mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    if (audioBlob.size === 0) {
      setError("No audio recorded. Please try again.")
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Step 1: Transcribe user's speech (English)
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('language', 'en') // Conversation is in English
      
      console.log("📤 [STT] Transcribing user speech...")
      
      const sttResponse = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      })
      
      if (!sttResponse.ok) {
        throw new Error(`STT API error: ${sttResponse.status}`)
      }
      
      const sttData = await sttResponse.json()
      const userMessage = sttData.transcript || ""
      
      if (!userMessage.trim()) {
        setError("No speech detected. Please try again.")
        return
      }
      
      console.log("✅ [STT] User said:", userMessage)
      
      // Add user message to history
      const newUserMessage: ConversationMessage = {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      }
      
      setConversationHistory(prev => [...prev, newUserMessage])
      
      // Step 2: Get AI response
      console.log("🤖 [Chat] Getting AI response...")
      
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: conversationHistory,
          mode: 'conversation'
        }),
      })
      
      if (!chatResponse.ok) {
        throw new Error(`Chat API error: ${chatResponse.status}`)
      }
      
      const chatData = await chatResponse.json()
      const aiResponse = chatData.response || "Sorry, I didn't get that."
      
      console.log("✅ [Chat] AI response:", aiResponse)
      
      // Add AI message to history
      const newAiMessage: ConversationMessage = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }
      
      setConversationHistory(prev => [...prev, newAiMessage])
      
      // Step 3: Convert AI response to speech
      console.log("🔊 [TTS] Converting response to speech...")
      
      const ttsResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiResponse }),
      })
      
      if (ttsResponse.ok) {
        const ttsData = await ttsResponse.json()
        
        if (ttsData.audio) {
          // Play audio
          const audioBlob = new Blob(
            [Uint8Array.from(atob(ttsData.audio), c => c.charCodeAt(0))],
            { type: 'audio/mpeg' }
          )
          const audioUrl = URL.createObjectURL(audioBlob)
          
          if (audioRef.current) {
            audioRef.current.pause()
          }
          
          const audio = new Audio(audioUrl)
          audioRef.current = audio
          
          audio.onplay = () => setIsSpeaking(true)
          audio.onended = () => {
            setIsSpeaking(false)
            URL.revokeObjectURL(audioUrl)
          }
          audio.onerror = () => {
            setIsSpeaking(false)
            URL.revokeObjectURL(audioUrl)
          }
          
          await audio.play()
          console.log("✅ [TTS] Playing audio response")
        }
      } else {
        // Fallback: Use Web Speech API
        console.log("⚠️ [TTS] ElevenLabs failed, using Web Speech API")
        const utterance = new SpeechSynthesisUtterance(aiResponse)
        utterance.lang = 'en-US'
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
      }
      
    } catch (e) {
      console.error("❌ [Conversation] Error:", e)
      setError("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }, [conversationHistory])

  const handleFinishConversation = () => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    // Stop recording if active
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    // Send conversation history to parent for analysis
    onEndSession(conversationHistory)
  }

  // Helper to get world avatar source
  const getWorldAvatarSrc = (state: "idle" | "listening" | "speaking") => {
    return `/worldavartar/${state}.gif`
  }

  // IMMERSIVE MODE: Fullscreen layout
  if (subMode === "immersive") {
    return (
      <div className="relative min-h-svh overflow-hidden bg-black">
        {/* Fullscreen Background Avatar */}
        <Image
          src={getWorldAvatarSrc(isRecording ? "listening" : isSpeaking ? "speaking" : "idle")}
          alt="Conversation partner"
          fill
          className="object-cover"
          priority
          unoptimized
        />

        {/* Dark overlay for better UI visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

        {/* Floating UI */}
        <div className="relative z-10 flex flex-col min-h-svh">
          {/* Minimal Header */}
          <div className="w-full px-6 py-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFinishConversation}
              disabled={conversationHistory.length === 0}
              className="text-white hover:text-white hover:bg-white/20 rounded-full px-4 disabled:opacity-50 backdrop-blur-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Analyze
            </Button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Error Display */}
          {error && (
            <div className="px-6 pb-4">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-red-500/90 backdrop-blur-sm text-white text-sm text-center">
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Floating Mic Button */}
          <div className="px-6 pb-8 pt-4">
            <div className="max-w-md mx-auto">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing || isSpeaking}
                size="lg"
                className={cn(
                  "w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm",
                  isRecording 
                    ? "bg-red-500/90 text-white hover:bg-red-600/90" 
                    : "bg-white/90 text-foreground hover:bg-white",
                  (isProcessing || isSpeaking) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isRecording ? "🔴 Tap to Stop" : "🎤 Tap to Speak"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // CHAT MODE: Original layout
  return (
    <div className="gradient-bg flex flex-col min-h-svh">
      {/* Header */}
      <div className="w-full px-6 py-4 flex justify-between items-center border-b border-white/20 backdrop-blur-sm bg-white/10">
        <div className="text-sm font-medium text-foreground">
          {subMode === "chat" ? "💬 Conversation Mode" : "🌍 Immersive Mode"}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFinishConversation}
          disabled={conversationHistory.length === 0}
          className="text-foreground hover:text-foreground hover:bg-white/50 rounded-full px-4 disabled:opacity-50"
        >
          <Send className="w-4 h-4 mr-2" />
          Analyze
        </Button>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          
          {/* CHAT MODE: Welcome message */}
          {subMode === "chat" && conversationHistory.length === 0 && !currentTranscript && (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <Avatar state={isRecording ? "listening" : isSpeaking ? "speaking" : "idle"} size="lg" />
              <p className="mt-6 text-muted-foreground text-base max-w-md">
                Start a conversation in English. I'll listen and respond naturally.
              </p>
              <p className="mt-2 text-muted-foreground/70 text-sm">
                When you're done, tap "Analyze" to get detailed feedback.
              </p>
            </div>
          )}
          
          {/* IMMERSIVE MODE: Avatar only - no messages */}
          {subMode === "immersive" && (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              <Avatar 
                state={isRecording ? "listening" : isSpeaking ? "speaking" : "idle"} 
                size="lg" 
              />
            </div>
          )}
          
          {/* CHAT MODE: Conversation messages */}
          {subMode === "chat" && conversationHistory.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0">
                  <Avatar state={isSpeaking && index === conversationHistory.length - 1 ? "speaking" : "idle"} size="sm" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[75%] rounded-3xl px-5 py-3 shadow-md",
                  msg.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-white/90 text-foreground backdrop-blur-sm"
                )}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              
              {msg.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                    👤
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* CHAT MODE: Processing indicator */}
          {subMode === "chat" && isProcessing && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <Avatar state="listening" size="sm" />
              </div>
              <div className="bg-white/90 rounded-3xl px-5 py-3 shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Recording Button */}
      <div className="px-6 pb-8 pt-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isSpeaking}
            size="lg"
            className={cn(
              "w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
              isRecording 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-foreground text-background hover:bg-foreground/90",
              (isProcessing || isSpeaking) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isRecording ? "🔴 Tap to Stop" : "🎤 Tap to Speak"}
          </Button>
          
          {conversationHistory.length > 0 && subMode === "chat" && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {conversationHistory.filter(m => m.role === 'user').length} message{conversationHistory.filter(m => m.role === 'user').length !== 1 ? 's' : ''} recorded
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
