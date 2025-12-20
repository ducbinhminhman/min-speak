"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Square } from "lucide-react"

interface ReflectiveChatProps {
  initialContext: {
    vietnameseText: string
    englishText: string
  }
  onEndChat: () => void
  onChatHistoryUpdate: (history: ChatMessage[]) => void
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ReflectiveChat({ initialContext, onEndChat, onChatHistoryUpdate }: ReflectiveChatProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isBotSpeaking, setIsBotSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  // Update parent with chat history changes
  useEffect(() => {
    onChatHistoryUpdate(chatHistory)
  }, [chatHistory, onChatHistoryUpdate])

  // Send initial bot message
  useEffect(() => {
    const sendInitialMessage = async () => {
      setIsProcessing(true)
      
      const initialMessage = "Thank you for sharing. How did that make you feel?"
      
      const botMessage: ChatMessage = {
        role: "assistant",
        content: initialMessage,
        timestamp: new Date(),
      }
      
      setChatHistory([botMessage])
      
      // Speak the initial message
      await speakMessage(initialMessage)
      setIsProcessing(false)
    }
    
    sendInitialMessage()
  }, [])

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

  const speakMessage = async (text: string) => {
    try {
      setIsBotSpeaking(true)
      
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("TTS API failed")
      }

      const data = await response.json()
      
      const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsBotSpeaking(false)
        audioRef.current = null
      }
      audio.onerror = () => {
        console.error("Audio playback error")
        setIsBotSpeaking(false)
        audioRef.current = null
      }
      
      await audio.play()
    } catch (error) {
      console.error("Failed to speak:", error)
      setIsBotSpeaking(false)
    }
  }

  const startRecording = useCallback(async () => {
    if (isBotSpeaking) {
      setError("Please wait for me to finish speaking")
      return
    }
    
    setError(null)
    audioChunksRef.current = []
    setIsRecording(true)
    
    try {
      console.log("🎤 [Chat Recording] Requesting microphone access...")
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
        console.error("❌ [Chat Recording] MediaRecorder error:", event)
        setError("Recording error occurred")
        setIsRecording(false)
      }
      
      mediaRecorder.start(100)
      mediaRecorderRef.current = mediaRecorder
      
      console.log("✅ [Chat Recording] Started successfully")
    } catch (e: any) {
      console.error("❌ [Chat Recording] Failed to start:", e)
      setError(`Microphone access denied: ${e.message}`)
      setIsRecording(false)
    }
  }, [isBotSpeaking])

  const stopRecording = useCallback(async () => {
    setIsRecording(false)
    
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      console.warn("⚠️ [Chat Recording] MediaRecorder not active")
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
      // Transcribe user's English response
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('language', 'en')
      
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
        setError("No speech detected in audio")
        setIsProcessing(false)
        return
      }
      
      // Add user message to chat
      const userChatMessage: ChatMessage = {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      }
      
      const updatedHistory = [...chatHistory, userChatMessage]
      setChatHistory(updatedHistory)
      
      // Get bot response
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          history: updatedHistory,
          mode: "reflective",
          context: initialContext
        }),
      })

      const chatData = await chatResponse.json()
      const botResponse = chatData.response || "I'm listening. Tell me more..."
      
      const botMessage: ChatMessage = {
        role: "assistant",
        content: botResponse,
        timestamp: new Date(),
      }
      
      setChatHistory((prev) => [...prev, botMessage])
      
      // Speak bot's response
      await speakMessage(botResponse)
      
    } catch (e) {
      console.error("❌ [Chat Error] Failed:", e)
      setError("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }, [chatHistory, initialContext])

  const handleEndChat = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    onEndChat()
  }

  return (
    <div className="gradient-bg flex flex-col min-h-svh">
      {/* Header */}
      <div className="w-full px-6 py-4 flex justify-between items-center">
        <div className="text-sm font-medium text-muted-foreground">
          💬 Reflective Chat
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEndChat}
          className="text-muted-foreground hover:text-foreground hover:bg-white/50 rounded-full px-4"
        >
          <Square className="w-3 h-3 mr-2" />
          End
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/80 text-foreground"
                )}
              >
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          
          {/* Processing indicator */}
          {(isProcessing || isBotSpeaking) && (
            <div className="flex justify-start">
              <div className="bg-white/80 text-foreground rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-2">
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

      {/* Voice Input Button */}
      <div className="px-6 pb-8 pt-4">
        <div className="max-w-sm mx-auto">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isBotSpeaking}
            size="lg"
            className={cn(
              "w-full h-14 md:h-16 text-base md:text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
              isRecording ? "bg-primary text-primary-foreground" : "bg-foreground text-background hover:bg-foreground/90",
            )}
          >
            {isRecording ? "Tap to Stop" : isBotSpeaking ? "Bot is speaking..." : "🎤 Tap to Speak"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
