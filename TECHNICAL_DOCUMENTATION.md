# min-speak Technical Documentation

> **Last Updated:** December 24, 2025  
> **Version:** 1.0  
> **Maintainer:** Development Team

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [Folder Structure](#folder-structure)
4. [Data Flow & System Workflows](#data-flow--system-workflows)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [API Routes & Services](#api-routes--services)
8. [Type System](#type-system)
9. [Key Dependencies](#key-dependencies)
10. [Development Guidelines](#development-guidelines)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### What is min-speak?

**min-speak** is a Next.js-based language learning application that helps Vietnamese speakers practice English through **real-time voice conversations** with an AI agent. The app provides:

- **Live voice chat** with ElevenLabs Conversational AI
- **Detailed conversation analysis** using Google Gemini AI
- **Two interaction modes:** Chat view (with message history) and Immersive view (fullscreen avatar)
- **Personalized feedback** on grammar, vocabulary, and pronunciation

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | React-based full-stack framework |
| **Language** | TypeScript 5 | Type-safe development |
| **AI - Conversation** | ElevenLabs Conversational AI | Real-time voice interaction |
| **AI - Analysis** | Google Gemini 2.0 Flash | Conversation analysis & feedback |
| **UI Framework** | Tailwind CSS + shadcn/ui | Responsive, accessible components |
| **Animation** | Framer Motion | Smooth avatar animations |
| **Deployment** | Vercel | Serverless hosting with edge functions |

---

## 🏗️ Architecture & Design Patterns

### 1. **Layered Architecture**

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│   (Components, Screens, UI)             │
├─────────────────────────────────────────┤
│         APPLICATION LAYER               │
│   (Hooks, State Management)             │
├─────────────────────────────────────────┤
│         BUSINESS LOGIC LAYER            │
│   (Services, Utilities)                 │
├─────────────────────────────────────────┤
│         DATA LAYER                      │
│   (Types, Config, Constants)            │
├─────────────────────────────────────────┤
│         INFRASTRUCTURE LAYER            │
│   (API Routes, External Services)       │
└─────────────────────────────────────────┘
```

### 2. **Key Design Patterns**

#### **State Machine Pattern** (`app/page.tsx`)
The main page uses a finite state machine to control screen transitions:

```typescript
type AppScreen = "landing" | "modeSelection" | "conversation" | "analysis"
const [currentScreen, setCurrentScreen] = useState<AppScreen>("landing")
```

**Flow:**
```
landing → modeSelection → conversation → analysis → landing
```

#### **Service Layer Pattern** (`lib/services/`)
Business logic is separated into dedicated services:
- `gemini.service.ts` - AI conversation analysis
- `elevenlabs.service.ts` - Voice authentication
- `conversation.service.ts` - Message formatting & transformation

#### **Facade Pattern** (API Routes)
API routes act as facades, delegating to services:

```typescript
// app/api/conversation-analysis/route.ts
export async function POST(request) {
  const data = await request.json()
  const result = await analyzeConversation(data) // ← Delegates to service
  return Response.json(result)
}
```

#### **Hook Pattern** (Custom Hooks)
Complex logic encapsulated in custom hooks:
- `useElevenLabsConversation` - Manages entire voice conversation lifecycle

#### **Shared Component Pattern** (`components/shared/`)
Reusable UI components to enforce DRY:
- `ConnectionStatusBadge` - Connection status indicator
- `AnalysisLoadingScreen` - Loading state UI

---

## 📁 Folder Structure

```
min-speak/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # ⭐ Main app (state machine)
│   ├── layout.tsx                # Root layout with fonts
│   ├── globals.css               # Global styles
│   └── api/                      # API Routes (Backend)
│       ├── conversation-analysis/
│       │   └── route.ts          # POST: Analyze conversation
│       └── elevenlabs-signed-url/
│           └── route.ts          # GET: Generate signed URL
│
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui primitives
│   ├── shared/                   # Shared reusable components
│   │   ├── connection-status-badge.tsx
│   │   └── analysis-loading-screen.tsx
│   ├── hero-landing.tsx          # Landing screen
│   ├── mode-selection-modal.tsx  # Chat vs Immersive selection
│   ├── live-chat-conversation.tsx # Main conversation wrapper
│   ├── chat-mode-view.tsx        # Chat mode UI
│   ├── immersive-mode-view.tsx   # Immersive mode UI
│   ├── conversation-analysis-screen.tsx # Results screen
│   └── avatar.tsx                # Animated avatar component
│
├── hooks/                        # Custom React Hooks
│   └── useElevenLabsConversation.ts # Voice conversation logic
│
├── lib/                          # Core Business Logic
│   ├── types/                    # TypeScript Type Definitions
│   │   ├── conversation.ts       # Message, ConversationAnalysis
│   │   ├── gemini.ts             # Gemini API types
│   │   ├── api.ts                # API response types
│   │   └── index.ts              # Barrel exports
│   │
│   ├── config/                   # Configuration Files
│   │   ├── gemini.ts             # Gemini models, prompts, fallbacks
│   │   ├── constants.ts          # App-wide constants
│   │   └── ui-constants.ts       # Animation timings, delays
│   │
│   ├── services/                 # Business Logic Services
│   │   ├── gemini.service.ts     # Gemini API interaction
│   │   ├── elevenlabs.service.ts # ElevenLabs API calls
│   │   └── conversation.service.ts # Message formatting
│   │
│   ├── utils/                    # Utility Functions
│   │   ├── cn.ts                 # Tailwind class merger
│   │   ├── validators.ts         # Input validation
│   │   ├── formatters.ts         # Text formatting
│   │   └── array-helpers.ts      # Array utilities
│   │
│   └── api/                      # API Helpers
│       ├── handlers.ts           # API response builders
│       └── error-handler.ts      # Error handling utilities
│
├── public/                       # Static Assets
│   ├── avatar/                   # Avatar GIFs (idle, listening, speaking)
│   ├── background/               # Background images per screen
│   └── worldavatar/              # Immersive mode videos
│
└── [config files]                # Next.js, TypeScript, Tailwind configs
```

### **Critical Files Explained**

| File | Purpose | Lines | Complexity |
|------|---------|-------|------------|
| `app/page.tsx` | Main app state machine, screen orchestration | 124 | High |
| `hooks/useElevenLabsConversation.ts` | Voice conversation lifecycle management | 158 | High |
| `components/conversation-analysis-screen.tsx` | Display AI feedback results | 200 | Medium |
| `lib/services/gemini.service.ts` | Gemini API calls & analysis | 48 | Medium |
| `lib/config/gemini.ts` | AI prompts & model configurations | 120 | Low |

---

## 🔄 Data Flow & System Workflows

### **Main User Journey**

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│ Landing  │────▶│ Mode Select  │────▶│ Conversation │────▶│ Analysis │
│  Screen  │     │ (Chat/       │     │ (Live Voice) │     │  Results │
└──────────┘     │  Immersive)  │     └──────────────┘     └──────────┘
                 └──────────────┘            │
                                             │
                                             ▼
                                    ┌────────────────┐
                                    │ End Session    │
                                    │ (Min 2 msgs)   │
                                    └────────────────┘
```

### **Workflow 1: Voice Conversation**

```
1. User clicks "Try it Free" → app/page.tsx sets screen to "modeSelection"

2. User selects mode (Chat/Immersive) → screen changes to "conversation"

3. LiveChatConversation component renders → Calls useElevenLabsConversation hook

4. Hook flow:
   ┌─────────────────────────────────────────────────────────┐
   │ useElevenLabsConversation Hook Lifecycle                │
   ├─────────────────────────────────────────────────────────┤
   │ 1. Request microphone permission                        │
   │ 2. Fetch signed URL from /api/elevenlabs-signed-url    │
   │ 3. Call conversation.startSession({ signedUrl })        │
   │ 4. ElevenLabs WebRTC connection established             │
   │ 5. Listen to events:                                    │
   │    - onConnect: Set isConnecting = false                │
   │    - onMessage: Add to messages array                   │
   │      • User speaks → addUserMessage(content)            │
   │      • AI responds → updateAgentMessage(content)        │
   │    - onDisconnect: Trigger analysis after 100ms delay   │
   │ 6. User clicks "End & Analyze" → handleEndSession()     │
   └─────────────────────────────────────────────────────────┘

5. Session ends → onEndSession(messages) callback fires

6. app/page.tsx receives messages → Validates minimum 2 user messages

7. If valid → convertToApiFormat() → POST to /api/conversation-analysis

8. Screen changes to "analysis" (loading state)

9. API returns results → Display ConversationAnalysisScreen
```

### **Workflow 2: Conversation Analysis**

```
┌─────────────────┐
│ User ends call  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ app/page.tsx                    │
│ handleEndSession(messages)      │
├─────────────────────────────────┤
│ 1. Filter user messages         │
│ 2. Check MIN_MESSAGES (2)       │
│ 3. convertToApiFormat()         │
│ 4. POST /api/conversation-      │
│    analysis                     │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ /api/conversation-analysis/route.ts │
├──────────────────────────────────────┤
│ 1. Validate request body             │
│ 2. Check GEMINI_API_KEY exists       │
│ 3. Call analyzeConversation()        │
│    service                           │
└────────┬─────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ gemini.service.ts               │
│ analyzeConversation()           │
├─────────────────────────────────┤
│ 1. Format conversation          │
│    transcript                   │
│ 2. Insert into prompt template │
│ 3. Call Gemini API              │
│ 4. Parse JSON response          │
│ 5. Return structured analysis  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Response Structure:             │
├─────────────────────────────────┤
│ {                               │
│   sentenceAnalysis: [],         │
│   overallStrengths: [],         │
│   areasToImprove: [],           │
│   vocabularySuggestions: [],    │
│   summary: "..."                │
│ }                               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ ConversationAnalysisScreen      │
│ Displays results with icons,   │
│ colors, and actionable feedback │
└─────────────────────────────────┘
```

---

## 🧩 Component Architecture

### **Component Hierarchy**

```
app/page.tsx (Root State Machine)
│
├─ HeroLanding
│  └─ Button: "Try it Free"
│
├─ ModeSelectionModal
│  ├─ Button: "Chat Mode"
│  └─ Button: "Immersive Mode"
│
├─ LiveChatConversation
│  ├─ useElevenLabsConversation (hook)
│  └─ (Conditional Render)
│     ├─ ChatModeView
│     │  ├─ Avatar (animated)
│     │  ├─ Message bubbles
│     │  ├─ ConnectionStatusBadge (shared)
│     │  └─ Mute button
│     │
│     └─ ImmersiveModeView
│        ├─ Fullscreen videos (idle/listening/speaking)
│        └─ ConnectionStatusBadge (shared)
│
└─ ConversationAnalysisScreen
   ├─ AnalysisLoadingScreen (shared)
   │  ├─ Animated spinner
   │  └─ Progress indicators
   │
   └─ Results Display
      ├─ Summary Card
      ├─ Strengths List
      ├─ Sentence Analysis (detailed)
      ├─ Areas to Improve
      └─ Vocabulary Suggestions
```

### **Component Responsibilities**

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| **HeroLanding** | Initial screen with CTA | `onStartPractice` | None |
| **ModeSelectionModal** | Mode selection UI | `onSelectMode`, `onCancel` | None |
| **LiveChatConversation** | Conversation wrapper | `onEndSession`, `subMode` | `micMuted` |
| **ChatModeView** | Chat UI with messages | Messages, status, handlers | None (presentational) |
| **ImmersiveModeView** | Fullscreen avatar UI | Status, handlers | Video refs |
| **ConversationAnalysisScreen** | Display feedback | Analysis data, `onBack`, `isLoading` | None |
| **ConnectionStatusBadge** | Status indicator | `status`, `label?` | None |
| **Avatar** | Animated avatar | `state`, `size` | None |

### **Shared Components**

#### `ConnectionStatusBadge`
**Purpose:** Display connection status with visual indicator

**Usage:**
```tsx
<ConnectionStatusBadge 
  status={connectionStatus} 
  label="Listening..." 
/>
```

**Benefits:**
- DRY: Used in both Chat and Immersive modes
- Consistent styling across app
- Easy to update in one place

#### `AnalysisLoadingScreen`
**Purpose:** Show loading animation while analyzing conversation

**Benefits:**
- Separated from main analysis screen
- Independent animations
- Better code organization

---

## 🎛️ State Management

### **App-Level State** (`app/page.tsx`)

```typescript
// Screen navigation state machine
const [currentScreen, setCurrentScreen] = useState<AppScreen>("landing")

// Conversation mode
const [subMode, setSubMode] = useState<"chat" | "immersive" | null>(null)

// Analysis results
const [conversationAnalysisData, setConversationAnalysisData] = 
  useState<ConversationAnalysis | null>(null)

// Loading state
const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)
```

### **Hook-Level State** (`useElevenLabsConversation`)

```typescript
// Message history (displayed in UI)
const [messages, setMessages] = useState<Message[]>([])

// Connection state
const [isConnecting, setIsConnecting] = useState(true)
const [error, setError] = useState<string | null>(null)

// Refs for sync between callbacks
const messageHistoryRef = useRef<Message[]>([])
const sessionEndedRef = useRef(false)
```

### **Why Refs Instead of State?**

```typescript
// ❌ Problem: State updates are async
sessionEndedRef.current = true  // ← Immediate
hasEndedRef.current = true      // ← Immediate

// ✅ Solution: Refs for sync access in callbacks
if (!sessionEndedRef.current) {
  // Prevents double-triggering
}
```

### **State Update Patterns**

#### **Optimistic Updates**
```typescript
// Agent messages update immediately as they stream
const updateAgentMessage = (content: string) => {
  setMessages(prev => {
    const lastMsg = getLastItem(prev)
    if (lastMsg && lastMsg.role === "agent") {
      // Update existing message (streaming)
      return [...prev.slice(0, -1), { ...lastMsg, content }]
    }
    // Add new message
    return [...prev, newAgentMessage]
  })
}
```

#### **Callback Props Pattern**
```typescript
// Parent controls state, child triggers updates
<LiveChatConversation 
  onEndSession={(messages) => {
    setConversationAnalysisData(null) // Reset
    // Trigger analysis...
  }}
/>
```

---

## 🌐 API Routes & Services

### **API Routes**

#### **1. POST `/api/conversation-analysis`**

**Purpose:** Analyze conversation and return detailed feedback

**Request:**
```typescript
{
  conversationHistory: ConversationMessage[] // Array of {role, content, timestamp}
}
```

**Response:**
```typescript
{
  sentenceAnalysis: SentenceAnalysis[]
  overallStrengths: string[]
  areasToImprove: AreaToImprove[]
  vocabularySuggestions: VocabSuggestion[]
  summary: string
}
```

**Flow:**
```typescript
1. Validate request body
2. Check GEMINI_API_KEY exists
3. Call analyzeConversation(history, apiKey)
4. Return JSON response
5. On error: Return FALLBACK_FEEDBACK
```

**Error Handling:**
- Always returns 200 OK with fallback data
- Never exposes internal errors to client
- Logs errors for debugging

---

#### **2. GET `/api/elevenlabs-signed-url`**

**Purpose:** Generate signed URL for ElevenLabs WebRTC connection

**Request:** None

**Response:**
```typescript
{
  signedUrl: string // Valid for ~10 minutes
}
```

**Flow:**
```typescript
1. Validate env vars (ELEVENLABS_API_KEY, AGENT_ID)
2. Call getSignedUrl(agentId, apiKey) service
3. Return signed URL to client
4. Client uses URL to initiate WebRTC connection
```

**Security:**
- API key never sent to client
- Signed URLs expire quickly
- Agent ID is public (safe)

---

### **Service Layer**

#### **gemini.service.ts**

```typescript
export async function analyzeConversation(
  conversationHistory: ConversationMessage[],
  apiKey: string
): Promise<ConversationAnalysis>
```

**Responsibilities:**
1. Format conversation into readable transcript
2. Insert transcript into prompt template
3. Call Gemini API with structured config
4. Parse JSON response
5. Handle errors gracefully

**Configuration:**
```typescript
{
  model: 'gemini-2.0-flash-exp',
  maxOutputTokens: 2048,
  temperature: 0.7,
  responseMimeType: 'application/json' // ← Forces JSON output
}
```

---

#### **elevenlabs.service.ts**

```typescript
export async function getSignedUrl(
  agentId: string,
  apiKey: string
): Promise<string>
```

**Responsibilities:**
1. Make authenticated request to ElevenLabs API
2. Extract signed URL from response
3. Handle HTTP errors

**API Endpoint:**
```
GET https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id={agentId}
Headers: { "xi-api-key": apiKey }
```

---

#### **conversation.service.ts**

```typescript
export function formatConversationTranscript(
  history: ConversationMessage[]
): string

export function convertToApiFormat(
  messages: Message[]
): ConversationMessage[]
```

**Purpose:** Transform message formats between different parts of the system

**Example:**
```typescript
// Frontend format (for display)
{ role: "agent", content: "Hello", timestamp: Date }

// ↓ convertToApiFormat()

// API format (for analysis)
{ role: "assistant", content: "Hello", timestamp: Date }
```

---

## 📐 Type System

### **Type Architecture**

```
lib/types/
├── conversation.ts    # Core conversation types
├── gemini.ts          # Gemini-specific types
├── api.ts             # API response types
└── index.ts           # Barrel exports (public API)
```

### **Core Types**

#### **Message Types**

```typescript
// Frontend message (displayed in UI)
interface Message {
  role: "user" | "agent"
  content: string
  timestamp: Date
}

// API message (sent to analysis)
interface ConversationMessage {
  role: "user" | "assistant"  // Note: "assistant" not "agent"
  content: string
  timestamp: Date
}
```

**Why Two Types?**
- `Message`: UI terminology (user sees "agent")
- `ConversationMessage`: API terminology (Gemini expects "assistant")

---

#### **Analysis Types**

```typescript
interface ConversationAnalysis {
  sentenceAnalysis: SentenceAnalysis[]
  overallStrengths: string[]
  areasToImprove: AreaToImprove[]
  vocabularySuggestions: VocabSuggestion[]
  summary: string
}

interface SentenceAnalysis {
  original: string      // What user said
  improved: string      // Better phrasing
  issues: string[]      // Problems identified
  tips: string          // Actionable advice
}

interface AreaToImprove {
  area: string          // e.g., "Pronunciation"
  explanation: string   // What to focus on
  examples: string[]    // Specific examples
}

interface VocabSuggestion {
  word: string          // New vocabulary
  meaning: string       // Definition
  example: string       // Usage example
  context: string       // When/why to use
}
```

---

#### **Config Types**

```typescript
interface GeminiModelConfig {
  name: string                    // Model identifier
  maxOutputTokens: number         // Response length limit
  temperature: number             // Creativity (0-1)
  topP?: number                   // Nucleus sampling
  topK?: number                   // Top-K sampling
  responseMimeType?: string       // Output format
}
```

---

### **Type Organization Principles**

1. **Barrel Exports** - All types exported through `index.ts`
2. **Single Source of Truth** - No duplicate type definitions
3. **Strict Typing** - No `any` types (except error boundaries)
4. **Domain Separation** - Types grouped by domain (conversation, gemini, api)

---

## 📦 Key Dependencies

### **Production Dependencies**

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.x | React framework with App Router |
| `react` | 19.x | UI library |
| `typescript` | 5.x | Type safety |
| `@google/genai` | 1.31.0 | Gemini AI SDK |
| `@elevenlabs/react` | Latest | ElevenLabs voice SDK |
| `tailwindcss` | 4.x | Utility-first CSS |
| `framer-motion` | Latest | Animations |
| `clsx` + `tailwind-merge` | Latest | Conditional classes |
| `lucide-react` | Latest | Icon library |

### **Dev Dependencies**

| Package | Purpose |
|---------|---------|
| `@types/react` | React type definitions |
| `@types/node` | Node.js type definitions |
| `eslint` | Code linting |
| `postcss` | CSS processing |

### **External Services**

| Service | Purpose | Docs |
|---------|---------|------|
| **ElevenLabs Conversational AI** | Real-time voice chat | [docs.elevenlabs.io](https://docs.elevenlabs.io) |
| **Google Gemini API** | Conversation analysis | [ai.google.dev](https://ai.google.dev) |
| **Vercel** | Hosting & deployment | [vercel.com/docs](https://vercel.com/docs) |

---

## 🛠️ Development Guidelines

### **Code Style**

#### **1. Naming Conventions**

```typescript
// Components: PascalCase
export function HeroLanding() {}

// Functions: camelCase
export function formatConversationTranscript() {}

// Constants: SCREAMING_SNAKE_CASE
export const MIN_MESSAGES_FOR_ANALYSIS = 2

// Types/Interfaces: PascalCase
interface ConversationMessage {}

// Hooks: use prefix + camelCase
export function useElevenLabsConversation() {}
```

#### **2. File Organization**

```typescript
// File structure:
// 1. Imports (grouped)
// 2. Types/Interfaces (if local to file)
// 3. Constants
// 4. Helper functions
// 5. Main component/function
// 6. Export

// Example:
import { useState } from "react"        // External
import { Button } from "@/components"   // Internal

interface Props { ... }                 // Types

const MAX_RETRY = 3                     // Constants

function helperFunction() { ... }       // Helpers

export function MainComponent() { ... } // Main export
```

#### **3. Comment Guidelines**

```typescript
// ✅ Good: Explain WHY, not WHAT
// Workaround: Small delay to allow server-side disconnect event to propagate
setTimeout(() => { ... }, ANIMATION.SESSION_END_DELAY_MS)

// ❌ Bad: States the obvious
// Set timeout to 100
setTimeout(() => { ... }, 100)

// ✅ Good: Document complex logic
// Helper: Update or add agent message (supports streaming)
const updateAgentMessage = (content: string) => { ... }

// ❌ Bad: Redundant
// Function to update agent message
const updateAgentMessage = (content: string) => { ... }
```

### **Component Guidelines**

#### **1. Component Structure**

```typescript
// ✅ Preferred structure
export function ComponentName({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState()
  
  // 2. Refs
  const ref = useRef()
  
  // 3. Derived values
  const computedValue = useMemo(() => ...)
  
  // 4. Event handlers
  const handleClick = () => { ... }
  
  // 5. Effects
  useEffect(() => { ... }, [])
  
  // 6. Early returns
  if (loading) return <Loading />
  
  // 7. JSX
  return <div>...</div>
}
```

#### **2. Props Best Practices**

```typescript
// ✅ Good: Specific callback props
interface Props {
  onEndSession: (messages: Message[]) => void
  onBack: () => void
}

// ❌ Bad: Generic event handlers
interface Props {
  onClick: () => void
  onSubmit: () => void
}

// ✅ Good: Explicit required vs optional
interface Props {
  userId: string           // Required
  onUpdate?: () => void    // Optional
}
```

### **State Management Rules**

#### **1. When to Use State vs Props**

```typescript
// ✅ State: Owned by component
const [isOpen, setIsOpen] = useState(false)

// ✅ Props: Controlled by parent
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />

// ❌ Avoid: Duplicating props in state
function Child({ value }: Props) {
  const [localValue, setLocalValue] = useState(value) // ❌ Don't do this
}
```

#### **2. When to Use Refs**

```typescript
// ✅ Refs for: DOM access, timers, sync values in callbacks
const inputRef = useRef<HTMLInputElement>(null)
const sessionEndedRef = useRef(false)

// ❌ Don't use refs for: Values that affect rendering
const countRef = useRef(0)  // ❌ Use useState instead
```

### **Error Handling**

#### **1. API Error Pattern**

```typescript
try {
  const result = await apiCall()
  return Response.json(result)
} catch (error) {
  console.error('❌ [Context] Error:', error)
  return Response.json(FALLBACK_DATA, { status: 200 }) // ← Always 200
}
```

**Why Always 200?**
- Better UX: Users see fallback content instead of error screens
- Graceful degradation: App continues to function
- Errors logged for debugging

#### **2. Frontend Error Handling**

```typescript
// ✅ Good: Graceful degradation
const [error, setError] = useState<string | null>(null)

if (error) {
  return <ErrorMessage message={error} onRetry={retry} />
}

// ❌ Bad: Let errors crash the app
const data = await fetchData() // Uncaught promise rejection
```

### **Performance Considerations**

#### **1. Memoization**

```typescript
// ✅ Memoize expensive computations
const sortedMessages = useMemo(
  () => messages.sort((a, b) => ...),
  [messages]
)

// ✅ Memoize callbacks passed to children
const handleClick = useCallback(() => { ... }, [])
```

#### **2. Avoid Unnecessary Re-renders**

```typescript
// ✅ Extract static components
const LoadingDots = () => <div>...</div>

function Parent() {
  return loading ? <LoadingDots /> : <Content />
}

// ❌ Inline components re-create on every render
function Parent() {
  return loading ? <div>...</div> : <Content />
}
```

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. "Type 'ConversationAnalysisData' not found"**

**Cause:** Old type name still in use  
**Fix:** Replace with `ConversationAnalysis`

```typescript
// ❌ Old
import { ConversationAnalysisData } from '@/lib/types'

// ✅ New
import { ConversationAnalysis } from '@/lib/types'
```

---

#### **2. ElevenLabs Connection Fails**

**Symptoms:** "Failed to start conversation" error

**Debug Steps:**
1. Check `ELEVENLABS_API_KEY` in `.env.local`
2. Check `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` is set
3. Verify microphone permissions granted
4. Check browser console for WebRTC errors

**Common Causes:**
- Invalid API key
- Missing agent ID
- Browser blocks mic access
- Corporate firewall blocks WebRTC

---

#### **3. Gemini Analysis Returns Fallback**

**Symptoms:** Generic "Keep practicing!" feedback instead of detailed analysis

**Debug Steps:**
1. Check `GEMINI_API_KEY` in `.env.local`
2. Check terminal logs for "❌ [Gemini Service]" errors
3. Verify at least 2 user messages sent
4. Check Gemini API quota (1500 requests/day free tier)

**Fix:**
```bash
# Check if key is loaded
echo $GEMINI_API_KEY  # Should not be empty

# Restart dev server
npm run dev
```

---

#### **4. TypeScript Errors After Update**

**Steps:**
1. Delete `.next` folder
2. Clear node_modules
3. Reinstall dependencies

```bash
rm -rf .next node_modules
npm install
npm run dev
```

---

#### **5. Session Ends Twice / Double Analysis**

**Cause:** Race condition between user action and server disconnect

**Fix:** Already handled with `sessionEndedRef` guard

```typescript
if (sessionEndedRef.current) {
  return // Prevents double-triggering
}
sessionEndedRef.current = true
```

If still occurs:
- Increase `SESSION_END_DELAY_MS` in `ui-constants.ts`

---

### **Development Tips**

#### **1. Testing Voice Conversation Locally**

```bash
# 1. Ensure env vars set
cat .env.local

# 2. Run dev server
npm run dev

# 3. Open browser with mic permissions
# Chrome: chrome://settings/content/microphone

# 4. Watch terminal logs for connection status
# Look for: ✅ Connected to ElevenLabs Agent
```

#### **2. Testing Gemini Analysis**

```bash
# Create test conversation in browser DevTools console:
const testMessages = [
  { role: "user", content: "Hello how are you", timestamp: new Date() },
  { role: "agent", content: "I'm great! How about you?", timestamp: new Date() }
]

fetch('/api/conversation-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ conversationHistory: testMessages })
}).then(r => r.json()).then(console.log)
```

#### **3. Debugging State Machine**

Add this to `app/page.tsx` for debugging:

```typescript
useEffect(() => {
  console.log('🎬 Screen:', currentScreen, '| Mode:', subMode)
}, [currentScreen, subMode])
```

#### **4. Inspecting ElevenLabs Messages**

```typescript
// In useElevenLabsConversation.ts
onMessage: (message) => {
  console.log('📨 Message:', JSON.stringify(message, null, 2))
  // ...
}
```

---

## 📚 Additional Resources

### **Documentation Links**

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Gemini AI Documentation](https://ai.google.dev/gemini-api/docs)
- [ElevenLabs Conversational AI](https://docs.elevenlabs.io/conversational-ai)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### **Team Contacts**

- **Frontend Lead:** [Your Name]
- **Backend Lead:** [Your Name]
- **DevOps:** [Your Name]

### **Deployment**

```bash
# Production deployment
git push origin main  # Auto-deploys to Vercel

# Preview deployment
git push origin feature-branch  # Creates preview URL
```

---

## 🔄 Changelog

### **Version 1.0** (December 24, 2025)
- ✅ Initial architecture established
- ✅ Level 1 refactoring completed
- ✅ Modular structure implemented
- ✅ Shared components created
- ✅ Technical documentation written

---

**Questions?** Contact the development team or create an issue in the repository.
