# min-speak

AI-powered English conversation practice with real-time voice chat and detailed feedback analysis.

## Overview

**min-speak** is a Next.js language learning app that helps Vietnamese speakers practice English through immersive voice-based conversation with an AI agent powered by ElevenLabs Conversational AI.

## Features

- **Real-time Voice Conversation**: Chat with an AI agent using natural speech via ElevenLabs WebRTC
- **Dual Modes**: 
  - **Chat Mode**: Message bubbles showing conversation flow
  - **Immersive Mode**: Fullscreen animated avatar experience
- **Detailed Analysis**: Get comprehensive feedback on your conversation including:
  - Sentence-by-sentence improvements
  - Vocabulary suggestions with examples
  - Grammar tips and corrections
  - Overall strengths and areas to improve

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui
- **AI/Voice**:
  - ElevenLabs Conversational AI (real-time voice chat)
  - Google Gemini AI (conversation analysis)
- **Audio**: WebRTC via `@elevenlabs/react` SDK

## Getting Started

### Prerequisites

- Node.js 18+ 
- ElevenLabs API key ([get one here](https://elevenlabs.io))
- Google Gemini API key ([get one here](https://ai.google.dev))
- ElevenLabs Agent ID (create an agent in [ElevenLabs dashboard](https://elevenlabs.io/app/conversational-ai))

### Environment Variables

Create a `.env.local` file with:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id
GEMINI_API_KEY=your_gemini_api_key
```

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start practicing!

## How It Works

1. Choose between Chat or Immersive mode
2. Click the microphone to start speaking in English
3. The AI agent responds in real-time via voice
4. End the session to receive detailed analysis of your conversation
5. Review feedback on grammar, vocabulary, and pronunciation

## Project Structure

```
app/
  page.tsx                        # Main app with mode selection & flow
  api/
    elevenlabs-signed-url/        # ElevenLabs agent authentication
    conversation-analysis/        # Post-chat feedback generation
    usage/elevenlabs/             # API usage tracking
components/
  live-chat-conversation.tsx      # Real-time voice chat interface
  conversation-analysis-screen.tsx # Feedback display
  mode-selection-modal.tsx        # Chat vs Immersive selector
lib/
  gemini-config.ts                # AI configuration & prompts
  elevenlabs-usage.ts             # Usage tracking utilities
```

## Architecture

- **Single-page state machine**: app/page.tsx controls the entire flow (`modal → conversation → analysis`)
- **WebRTC-based conversation**: Uses `@elevenlabs/react` SDK for ultra-low latency voice streaming
- **Centralized AI config**: All Gemini prompts and model settings in lib/gemini-config.ts
- **Post-chat analysis**: After conversation ends, Gemini analyzes the full transcript and provides structured feedback

## Cost & API Usage

- **ElevenLabs Free Tier**: 10,000 characters/month
- **Gemini Free Tier**: 1,500 requests/day
- All costs are logged to console for monitoring

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [ElevenLabs Conversational AI](https://elevenlabs.io/docs/conversational-ai)
- [Google Gemini API](https://ai.google.dev/docs)

## License

MIT
