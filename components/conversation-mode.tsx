"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@mantine/core"
import { Avatar } from "@/components/avatar"
import { Square, ArrowRight } from "lucide-react"

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type AppMode = 'full' | 'quick'

interface ConversationModeProps {
  onEndSession: (history: ConversationMessage[]) => void
  mode: AppMode
}

type Phase = "vietnamese" | "english" | "feedback"

export function ConversationMode({ onEndSession, mode }: ConversationModeProps) {
  const [currentPhase, setCurrentPhase] = useState<Phase>("vietnamese")
  const [isRecording, setIsRecording] = useState(false)
  const [vietnameseTranscript, setVietnameseTranscript] = useState("")
  const [englishTranslation, setEnglishTranslation] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = useCallback(async () => {
    setError(null)
    audioChunksRef.current = []
    setIsRecording(true)
    
    try {
      console.log("🎤 [Recording] Requesting microphone access...")
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
      
      console.log("🎤 [Recording] Using mime type:", mimeType)
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          console.log("🎤 [Recording] Chunk received:", event.data.size, "bytes")
        }
      }
      
      mediaRecorder.onerror = (event) => {
        console.error("❌ [Recording] MediaRecorder error:", event)
        setError("Recording error occurred")
        setIsRecording(false)
      }
      
      mediaRecorder.start(100)
      mediaRecorderRef.current = mediaRecorder
      
      console.log("✅ [Recording] Started successfully")
    } catch (e: any) {
      console.error("❌ [Recording] Failed to start:", e)
      setError(`Microphone access denied: ${e.message}`)
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    setIsRecording(false)
    
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      console.warn("⚠️ [Recording] MediaRecorder not active")
      return
    }
    
    console.log("🎤 [Recording] Stopping...")
    
    mediaRecorderRef.current.stop()
    
    await new Promise<void>((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          console.log("🎤 [Recording] Stopped. Total chunks:", audioChunksRef.current.length)
          resolve()
        }
      }
    })
    
    const audioBlob = new Blob(audioChunksRef.current, { 
      type: mediaRecorderRef.current.mimeType 
    })
    
    console.log("📁 [Recording] Audio blob created:", {
      size: audioBlob.size,
      type: audioBlob.type,
      sizeInMB: (audioBlob.size / 1024 / 1024).toFixed(2) + " MB"
    })
    
    if (mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => {
        track.stop()
        console.log("🎤 [Recording] Microphone track stopped")
      })
    }
    
    if (audioBlob.size === 0) {
      console.error("❌ [Recording] Audio blob is empty")
      setError("No audio recorded. Please try again.")
      return
    }
    
    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      
      // Determine language based on current phase
      const language = currentPhase === 'vietnamese' ? 'vi' : 'en'
      formData.append('language', language)
      
      console.log(`📤 [STT] Sending audio for transcription (${language})...`)
      
      const sttResponse = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      })
      
      if (!sttResponse.ok) {
        throw new Error(`STT API error: ${sttResponse.status}`)
      }
      
      const sttData = await sttResponse.json()
      const transcriptText = sttData.transcript || ""
      
      console.log("✅ [STT] Received transcript:", transcriptText)
      
      if (!transcriptText.trim()) {
        setError("No speech detected in audio")
        return
      }
      
      // Append to appropriate transcript
      if (currentPhase === 'vietnamese') {
        setVietnameseTranscript(prev => prev ? `${prev} ${transcriptText}` : transcriptText)
      } else if (currentPhase === 'english') {
        setEnglishTranslation(prev => prev ? `${prev} ${transcriptText}` : transcriptText)
      }
      
    } catch (e) {
      console.error("❌ [Error] Failed:", e)
      setError("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }, [currentPhase])

  const handleNextPhase = () => {
    if (currentPhase === 'vietnamese') {
      // Quick mode: Auto-submit after Vietnamese
      if (mode === 'quick') {
        const mockHistory: ConversationMessage[] = [
          { role: "user", content: vietnameseTranscript, timestamp: new Date() },
          { role: "assistant", content: "Translation will be generated...", timestamp: new Date() },
        ]
        onEndSession(mockHistory)
        return
      }
      
      // Full mode: Continue to English phase
      setCurrentPhase('english')
      setError(null)
    } else if (currentPhase === 'english') {
      // Navigate to feedback screen via parent
      const mockHistory: ConversationMessage[] = [
        { role: "user", content: vietnameseTranscript, timestamp: new Date() },
        { role: "assistant", content: englishTranslation, timestamp: new Date() },
      ]
      onEndSession(mockHistory)
    }
  }

  const handleEndSession = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    // Return to landing with empty history
    onEndSession([])
  }

  return (
    <div className="gradient-bg flex flex-col min-h-svh">
      {/* Header with End button */}
      <div className="w-full px-6 py-4 flex justify-between items-center">
        <div className="text-sm font-medium text-muted-foreground">
          {currentPhase === 'vietnamese' && '🇻🇳 Phase 1: Speak in Vietnamese'}
          {currentPhase === 'english' && '🇬🇧 Phase 2: Translate to English'}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEndSession}
          className="text-muted-foreground hover:text-foreground hover:bg-white/50 rounded-full px-4"
        >
          <Square className="w-3 h-3 mr-2" />
          End
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Phase 1: Vietnamese */}
          {currentPhase === 'vietnamese' && (
            <div className="space-y-4">
              {!vietnameseTranscript && (
                <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                  <Avatar state={isRecording ? "listening" : "idle"} size="lg" />
                  <p className="mt-6 text-muted-foreground text-sm">
                    {isRecording ? "Listening..." : "Tap below to speak about your day in Vietnamese"}
                  </p>
                </div>
              )}
              
              {vietnameseTranscript && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Vietnamese Transcript:</h3>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{vietnameseTranscript}</p>
                  {isProcessing && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                      <span>Processing...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Phase 2: English Translation */}
          {currentPhase === 'english' && (
            <div className="space-y-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-md">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Original (Vietnamese):</h3>
                <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/80">{vietnameseTranscript}</p>
              </div>
              
              <div className="bg-primary/10 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-primary/20">
                <h3 className="text-sm font-semibold text-primary mb-3">Your Translation (English):</h3>
                {englishTranslation ? (
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{englishTranslation}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Tap below to speak your English translation...</p>
                )}
                {isProcessing && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
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

      {/* Bottom Section - Buttons */}
      <div className="px-6 pb-8 pt-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            size="lg"
            className={cn(
              "flex-1 h-14 md:h-16 text-base md:text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
              isRecording ? "bg-primary text-primary-foreground" : "bg-foreground text-background hover:bg-foreground/90",
            )}
          >
            {isRecording ? "Tap to Stop" : "🎤 Tap to Speak"}
          </Button>
          
          <Button
            onClick={handleNextPhase}
            disabled={isProcessing || isRecording}
            size="lg"
            variant="outline"
            className="h-14 md:h-16 px-6 rounded-full font-medium bg-white/80 hover:bg-white border-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {currentPhase === 'vietnamese' ? (
              <>Next <ArrowRight className="w-5 h-5 ml-2" /></>
            ) : (
              <>Submit <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
