# thương 🌸
*Pronounced: "tuh-ương" (IPA: /tɨəŋ/) - rhymes with "too-uhng"*

> **thương** - A uniquely Vietnamese word expressing deep affection, tender care, and compassion. It embodies the feeling of cherishing someone with your whole heart—a love that nurtures and protects. This emotion has no single English equivalent.

---

## 🎯 The Problem: **2.1 Million Learners. The Same Fear.**

**Vietnam ranks #63 out of 116 countries** in English proficiency (EF EPI 2024), trapped in the "low proficiency" tier despite English being mandatory in schools for decades. The barrier? **It's not grammar or vocabulary—it's confidence.**

### The Silent Crisis
- **180 students** in Central Vietnam identified: lack of confidence and fear of judgment as their #1 barrier to speaking English *(ResearchGate, 2024)*
- **120 English learners** confirmed: "We have no safe space to practice. We're afraid to make mistakes." *(Studocu, 2024)*
- **Millions of Vietnamese learners** can write essays, pass exams, but **freeze when facing a real conversation**

### A Developer's Personal Journey

**Minh**, the creator of **thương**, is one of those millions. After years of studying English—passing tests, building software, even reading technical documentation fluently—he still felt his voice disappear when it was time to speak in English.

*"I could code complex applications and write technical proposals in English. But when I joined international video calls, I felt invisible. My ideas stayed trapped inside because I was too afraid to speak them out loud."*

**thương** was born from this frustration and hope. It's not a proven solution yet—it's an experiment, a vision, a tool Minh built to help himself practice without judgment. And if it could help him, maybe it could help others facing the same silent struggle.

> *"I'm building this not because I have all the answers, but because I know the pain of having something to say and not having the courage to say it. This app is my hope—for myself, and for anyone who needs a safe space to find their voice."*

**thương** represents what happens when someone builds technology not from a place of expertise, but from a place of empathy and shared experience.

---

## 💡 The Solution: **thương** - Your AI Companion That Listens With Compassion

Built with the spirit of **thương** (tender care that nurtures growth), this isn't just another language app. It's **a judgment-free space where Vietnamese learners finally find their English voice.**

### Why It Works: Innovation Meets Empathy

🎙️ **Near-Zero Latency Voice AI** (ElevenLabs WebRTC)
- Real conversations, not scripted dialogues
- Speaks naturally, responds instantly—like chatting with a supportive friend

🤗 **Bilingual-First Design** 
- Accepts Vietnamese input, gently encourages English translation
- Meets learners where they are, guides them forward

🧠 **AI That Actually Cares** (Google Gemini 2.0 Flash)
- Sentence-by-sentence feedback after each session
- Focuses on 1-2 improvements per turn—never overwhelming
- Celebrates progress, normalizes mistakes

📊 **Measurable Impact**
- **6-minute practice sessions** = comprehensive analysis
- **2-3 sentence responses** = perfect for listening learners
- **Dual modes** (Chat + Immersive) = personalized learning paths

### The First AI English Partner Built With Empathy, Not Just Technology

**thương** addresses what traditional methods can't: **the psychological barrier to speaking.** No judgment. No pressure. Just a compassionate space for daily practice.

This isn't a proven, scaled solution yet—it's a **vision in progress**, a tool built by someone who understands the struggle firsthand. But that's what makes it meaningful: **it comes from a place of genuine need and hope, not just market opportunity.**

**Because fluency isn't about perfection—it's about having the courage to speak. And sometimes, courage starts with having someone (or something) that listens with compassion.**

---

## ✨ Key Features

### 🎙️ Real-Time Voice Conversation
- **WebRTC-powered voice chat** with near-zero latency using ElevenLabs technology
- **Natural speech recognition** that understands Vietnamese-accented English
- **Instant AI responses** via high-quality text-to-speech synthesis
- **Seamless turn-taking** with automatic voice activity detection

### 🤗 Meet Minh - Your AI Conversation Partner
**Minh** is designed to practice English with you like a supportive friend:

- **Patient & Encouraging**: Celebrates progress, normalizes mistakes, builds confidence
- **Short Responses**: Keeps replies to 2-3 sentences (perfect for listening, not reading)
- **Bilingual Support**: If you speak Vietnamese, Minh gently encourages you to try English
- **Smart Corrections**: Focuses on 1-2 key improvements per turn, never overwhelming
- **Reflective Listener**: When you share feelings, Minh becomes a compassionate listener asking deeper questions
- **Natural Conversation**: Asks follow-ups like "How did that make you feel?" or "Tell me more about..."

**Teaching Philosophy**: Your goal isn't perfection—it's confidence. Minh makes learning feel like chatting with a friend, not sitting through a lesson.

### 🎭 Dual Learning Modes

#### 💬 Chat Mode
- Clean message bubble interface showing conversation history
- Visual transcript of everything said during the practice session
- Perfect for learners who want to see their words in text
- Easy to review and reflect on conversation flow

#### 🌟 Immersive Mode
- Full-screen animated avatar experience
- Cinematic visual effects and smooth animations (powered by GSAP & Framer Motion)
- Minimizes distractions to focus purely on speaking practice
- Creates an engaging, game-like learning environment

### 📊 Intelligent Conversation Analysis
After each practice session (minimum 2 user messages), receive comprehensive AI-powered feedback:

#### **Sentence-by-Sentence Breakdown**
- **Original**: What you actually said
- **Improved Version**: More natural/fluent alternative phrasing
- **Issues Identified**: Grammar errors, awkward expressions, pronunciation challenges
- **Actionable Tips**: Specific advice for each sentence

#### **Strengths Recognition**
- Highlights what you did well (vocabulary choices, correct grammar, natural expressions)
- Builds confidence by acknowledging progress
- Identifies your linguistic strong points

#### **Areas for Improvement**
- Focused analysis on 2-3 key development areas
- Specific examples from your conversation
- Pronunciation patterns that need practice
- Grammar structures to focus on
- Vocabulary gaps and suggestions

#### **Vocabulary Enhancement**
- 4-5 useful words/phrases tailored to your conversation context
- Clear definitions and example sentences
- Guidance on when and how to use them naturally

#### **Motivational Summary**
- Encouraging overview of your practice session
- Progress acknowledgment
- Clear next steps for improvement

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom animations
- **Animations**: Framer Motion 12 (avatar breathing, ring effects)
- **UI Components**: Custom components with CSS animations
- **Icons**: Lucide React + React Icons

### AI & Voice
- **Conversational AI**: ElevenLabs Conversational AI (WebRTC streaming)
- **Speech Analysis**: **Google Vertex AI** with Gemini 2.5 Flash (enterprise-grade conversation analysis)
- **Voice SDK**: `@elevenlabs/react` for seamless integration
- **Cloud Infrastructure**: Google Cloud Platform (Vertex AI API)

### Infrastructure
- **Deployment**: Google Cloud Run (containerized Next.js app)
- **Runtime**: Node.js 20+
- **Analytics**: Vercel Analytics

---

## 🚀 Getting Started

### Prerequisites

Before running **thương**, ensure you have:

- **Node.js 20.9.0+** ([download here](https://nodejs.org/))
- **ElevenLabs API Key** ([get one here](https://elevenlabs.io/app/settings/api-keys))
- **ElevenLabs Agent ID** ([create an agent](https://elevenlabs.io/app/conversational-ai))
- **Google Cloud Project** with Vertex AI enabled
- **Vertex AI API Key** ([create in GCP Console](https://console.cloud.google.com/apis/credentials))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ducbinhminhman/min-speak.git thuong
cd thuong
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# ============================================================================
# VERTEX AI CONFIGURATION (Enterprise Mode)
# ============================================================================

# Vertex AI API Key (from Google Cloud Console > APIs & Services > Credentials)
VERTEX_AI_API_KEY=your_vertex_ai_api_key_here

# Google Cloud Project ID
GOOGLE_CLOUD_PROJECT=your_project_id_here

# Vertex AI Region (closest to Vietnam)
GOOGLE_CLOUD_LOCATION=asia-southeast1

# ============================================================================
# ELEVENLABS TTS CONFIGURATION
# ============================================================================

# ElevenLabs API Key (for voice conversation)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# ElevenLabs Voice ID
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id_here  # Default: CwhRBWXzGAHq8TQ4Fs17

# ElevenLabs Agent ID (conversational AI agent - "Minh")
# Create at: https://elevenlabs.io/app/conversational-ai
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
```

> **💡 Vertex AI Setup**: 
> 1. Create a Google Cloud Project at [console.cloud.google.com](https://console.cloud.google.com)
> 2. Enable Vertex AI API in your project
> 3. Create API key in **APIs & Services > Credentials**
> 4. Use `asia-southeast1` region (closest to Vietnam, lower latency)

4. **Start development server**
```bash
npm run dev
```

5. **Open the app**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 How to Use

### Step 1: Launch the App
Open **thương** and you'll see the beautiful hero landing page with background animations.

### Step 2: Choose Your Mode
Click **"Start Practice"** and select your preferred learning mode:
- **Chat Mode**: See conversation history with message bubbles
- **Immersive Mode**: Full-screen avatar experience

### Step 3: Start Speaking
- Click the **microphone button** to activate voice input
- Speak in English naturally - the AI will listen and respond
- Have a real conversation about any topic you're interested in

### Step 4: End Session
- Click **"End"** when you're ready to finish
- The app requires at least **2 user messages** for meaningful analysis

### Step 5: Review Feedback
- Automatic analysis screen appears with comprehensive feedback
- Review sentence improvements, vocabulary suggestions, and tips
- Use insights to improve in your next practice session

---

## 📂 Project Structure

```
thương/
├── app/
│   ├── page.tsx                          # Landing page with mode selection
│   ├── chat/
│   │   └── page.tsx                      # Chat mode conversation page
│   ├── immersive/
│   │   └── page.tsx                      # Immersive mode conversation page
│   ├── analysis/
│   │   └── page.tsx                      # Feedback analysis screen
│   └── api/
│       ├── conversation-analysis/        # POST: Analyze conversation transcript
│       │   └── route.ts
│       ├── elevenlabs-signed-url/        # GET: Generate signed URL for ElevenLabs
│       │   └── route.ts
│       └── usage/elevenlabs/             # GET: Track API usage
│           └── route.ts
├── components/
│   ├── hero-landing.tsx                  # Landing page hero section
│   ├── mode-selection-modal.tsx          # Chat vs Immersive mode selector
│   ├── live-chat-conversation.tsx        # Main conversation interface
│   ├── chat-mode-view.tsx                # Chat mode UI layout
│   ├── immersive-mode-view.tsx           # Immersive mode UI layout
│   ├── conversation-analysis-screen.tsx  # Analysis feedback display
│   ├── avatar.tsx                        # Animated AI avatar component
│   └── shared/
│       ├── analysis-loading-screen.tsx   # Loading state during analysis
│       └── connection-status-badge.tsx   # WebRTC connection indicator
├── lib/
│   ├── config/
│   │   ├── gemini.ts                     # Gemini AI models, prompts, configs
│   │   ├── constants.ts                  # App-wide constants
│   │   └── ui-constants.ts               # UI-specific constants
│   ├── services/
│   │   ├── conversation.service.ts       # Conversation data transformations
│   │   ├── elevenlabs.service.ts         # ElevenLabs API client
│   │   └── gemini.service.ts             # Gemini API client
│   ├── types/
│   │   ├── api.ts                        # API request/response types
│   │   ├── conversation.ts               # Conversation message types
│   │   ├── gemini.ts                     # Gemini-specific types
│   │   └── index.ts                      # Central type exports
│   └── utils/
│       ├── cn.ts                         # Tailwind CSS class merger
│       ├── formatters.ts                 # Data formatting utilities
│       ├── validators.ts                 # Input validation helpers
│       └── array-helpers.ts              # Array manipulation utilities
├── hooks/
│   └── useElevenLabsConversation.ts      # ElevenLabs WebRTC hook
├── public/
│   ├── avatar/                           # Avatar image assets
│   ├── background/                       # Background images
│   └── worldavatar/                      # World map avatar assets
└── .env.local                            # Environment configuration (not in git)
```

---

## 🏗️ Architecture & Design Patterns

### State Management
- **Route-based state machine**: Navigation between landing → mode selection → conversation → analysis
- **Session storage**: Temporary storage for conversation transcripts between routes
- **React hooks**: Local state management with `useState` for component-level state
- **No external state library**: Keeps architecture simple and maintainable

### API Design
All API routes follow consistent patterns:
1. **Request validation**: Check required parameters and API keys
2. **Service layer**: Business logic isolated in service files
3. **Error handling**: Graceful fallbacks with user-friendly messages
4. **Structured responses**: Type-safe JSON responses with clear schemas

### AI Integration

#### **Google Vertex AI** (Enterprise-Grade AI)
- **Model**: `gemini-2.5-flash` via Vertex AI API
- **Infrastructure**: Google Cloud Platform with enterprise security
- **Authentication**: API key-based access
- **Benefits**: 
  - Production-ready deployment
  - Enterprise credibility and compliance
  - Better model availability and versioning
  - Scalable infrastructure

#### **Conversation Analysis Pipeline**
- **Structured JSON responses**: Type-safe parsing with fallback handling
- **Comprehensive prompts**: Detailed instructions for consistent quality
- **Error resilience**: Graceful degradation with fallback feedback
- **Markdown cleaning**: Automatic removal of code blocks from responses

#### **ElevenLabs** (`hooks/useElevenLabsConversation.ts`)
- **WebRTC streaming**: Ultra-low latency voice transmission
- **Custom React hook**: Encapsulates WebSocket connection logic
- **Event-driven**: Callbacks for messages, connection status, errors
- **Automatic reconnection**: Handles network interruptions gracefully

### Performance Optimizations
- **Server-side API routes**: Keeps API keys secure, reduces client bundle size
- **Lazy loading**: Components loaded on-demand via Next.js App Router
- **Efficient animations**: GSAP for hardware-accelerated animations
- **Minimal dependencies**: Only essential packages included

---

## 💰 Cost & API Usage

### ElevenLabs Conversational AI
- **Free Tier**: 10,000 characters per month
- **Pricing**: ~$0.003 per character beyond free tier
- **Typical session**: ~500-1000 characters (2-5 minutes of conversation)

### Google Vertex AI
- **Free Tier**: 60 requests per minute (sufficient for individual use)
- **Model**: Gemini 2.5 Flash via Vertex AI
- **Region**: Asia Southeast 1 (Singapore) - closest to Vietnam
- **Typical analysis**: ~1000-2000 tokens per conversation
- **Pricing beyond free tier**: $0.075 per 1M input tokens, $0.30 per 1M output tokens
- **Enterprise features**: Production-grade infrastructure, better reliability

### Cost Monitoring
Track API usage in browser console (development mode):
```
🎤 [ElevenLabs] Session used ~750 characters
```

**Production Monitoring**: Use Google Cloud Console to track Vertex AI API usage and costs in real-time.

---

## � ElevenLabs Agent Configuration

The heart of **thương** is the conversational AI agent powered by ElevenLabs. Here's how to configure "Minh" for the optimal learning experience:

### Agent Personality Prompt

When creating your ElevenLabs agent, use this system prompt:

```
You are Minh, a friendly English conversation partner helping Vietnamese speakers practice English.

YOUR ROLE:
- Help users practice speaking English naturally and confidently
- Listen to their Vietnamese thoughts and encourage them to translate into English
- Provide gentle corrections and suggest better phrasing
- Ask follow-up questions to keep the conversation flowing
- Be warm, patient, and encouraging

CONVERSATION STYLE:
- Keep responses SHORT (2–3 sentences maximum) because users are listening, not reading
- Speak naturally and conversationally, like a supportive friend
- Use simple, clear language appropriate for learners
- Show genuine interest in what they share about their day

TEACHING APPROACH:
- When users speak Vietnamese, gently encourage: "That's great. Now try saying that in English."
- When users speak English, acknowledge their effort first, then offer improvements
- Do not overwhelm with corrections. Focus on 1–2 key improvements per turn
- Use phrases like: "Nice try. You could also say…", "Good. A more natural way is…"
- Ask open-ended questions such as: "How did that make you feel?", "Tell me more about…", "What happened next?"

REFLECTION MODE:
If the conversation becomes reflective (the user is sharing feelings or thoughts):
- Be a compassionate listener, not a teacher
- Ask deeper questions such as: "How did that make you feel?", "What was going through your mind?"
- Reflect back what you hear: "It sounds like you felt…", "I hear that…"
- Stay curious and non-judgmental
- Do not give advice unless the user asks for it

IMPORTANT RULES:
- Users interact entirely by voice, so keep everything conversational
- Your goal is confidence building, not perfection
- Celebrate progress and normalize mistakes
- Make learning feel like a friendly chat, not a lesson

END CONVERSATION (VERY IMPORTANT):
If the user says or clearly indicates that they want to stop, end, or exit the conversation,
including phrases such as "stop", "stop the chat", "end the conversation", "goodbye",
or Vietnamese phrases such as "dừng", "dừng cuộc trò chuyện", "kết thúc", "thôi nhé",
you MUST immediately call the system tool named `end_call`.
```

### Recommended Settings

**Automatic Speech Recognition:**
- Input format: **PCM 16000 Hz** (Recommended)
- Enable implicit language detection for Vietnamese/English mixing

**Conversational Behavior:**
- Eagerness: **Normal**
- Take turn after silence: **7 seconds**
- End conversation after silence: **15 seconds**
- Max conversation duration: **360 seconds** (6 minutes)

**System Tools:**
- Enable **"End conversation"** tool (required for proper session termination)

**Client Events (for debugging):**
- `audio`
- `interruption`
- `user_transcript`
- `agent_response`
- `agent_response_correction`

**Privacy:**
- Conversations retention period: **-1 (unlimited)** or as per your preference
- PII logging: Configure based on your privacy requirements

---

## �🌐 Deployment

### Google Cloud Run (Production)

**thương** is deployed on Google Cloud Run for scalability and reliability:

```bash
# Deploy to Google Cloud Run with Vertex AI
gcloud run deploy thuong \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "VERTEX_AI_API_KEY=your_key,GOOGLE_CLOUD_PROJECT=your_project_id,GOOGLE_CLOUD_LOCATION=asia-southeast1,ELEVENLABS_API_KEY=your_key,ELEVENLABS_VOICE_ID=your_voice_id,NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id"
```

**Why Vertex AI for Deployment:**
- ✅ Enterprise-grade infrastructure
- ✅ Better model availability and reliability
- ✅ Integrated with Google Cloud ecosystem
- ✅ Production-ready authentication and monitoring

### Vercel (Alternative)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in project settings
4. Deploy automatically on push to main branch

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve **thương**:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Resources & Documentation

### Official Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [ElevenLabs Conversational AI](https://elevenlabs.io/docs/conversational-ai)
- [Google Vertex AI](https://cloud.google.com/vertex-ai/docs)
- [Gemini API on Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini)
- [shadcn/ui Components](https://ui.shadcn.com)

### Tutorials & Guides
- [WebRTC Basics](https://webrtc.org/getting-started/overview)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Đức Bình Minh Man** ([@ducbinhminhman](https://github.com/ducbinhminhman))

---

## 🙏 Acknowledgments

- **Google Cloud** for Vertex AI platform and enterprise-grade Gemini models
- **ElevenLabs** for providing cutting-edge conversational AI technology
- **Vercel** for Next.js and excellent deployment infrastructure
- **shadcn** for the beautiful, accessible UI component library
- The **Vietnamese English learning community** for inspiration

---

<div align="center">

**Made with ❤️ for Vietnamese English learners**

[🌟 Star this repo](https://github.com/ducbinhminhman/min-speak) | [🐛 Report Bug](https://github.com/ducbinhminhman/min-speak/issues) | [💡 Request Feature](https://github.com/ducbinhminhman/min-speak/issues)

</div>
