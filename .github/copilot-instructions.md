 re# min-speak Copilot Instructions

## Project Overview

**min-speak** is a Next.js 16 language learning app helping Vietnamese speakers practice English through voice-based conversation, translation exercises, reflective journaling, and AI-powered feedback.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Google Gemini AI, ElevenLabs TTS

## Architecture Patterns

### State Management & Screen Flow
- **Single-page state machine** in [app/page.tsx](app/page.tsx) controls all screen transitions (`landing → conversation → feedback/translation → chat → diary`)
- No external state management - uses React `useState` for app-wide flow
- Screen navigation: `AppScreen` type defines all valid screens, `setCurrentScreen()` handles transitions
- Two modes: `full` (complete workflow with feedback) and `quick` (translate only)

### Centralized AI Configuration
All Gemini AI configs live in [lib/gemini-config.ts](lib/gemini-config.ts):
- **MODELS** constant: Model configs for conversation (`gemini-2.0-flash-exp`) and feedback/analysis
- **PROMPTS** constant: All system prompts including conversation, reflective chat, diary generation, translation analysis
- Helper functions: `getChatConfig()`, `getTranslationFeedbackConfig()`, `buildConversationPrompt()`
- Cost tracking: `calculateGeminiCost()`, `estimateTokens()`, `logCost()` for monitoring API usage
- **Pattern:** Export complete config objects, not raw strings

### Dynamic Prompt Loading
Prompts can be fetched from Google AI Studio via [lib/prompts.ts](lib/prompts.ts):
- 5-minute cache prevents excessive API calls
- Fallback to hardcoded prompts in gemini-config.ts if fetch fails
- Set `GEMINI_PROMPT_ID` env var to enable (see [PROMPT_SETUP.md](PROMPT_SETUP.md))
- Allows non-technical team members to edit prompts without code changes

### API Routes Pattern
All API routes in `app/api/*` follow consistent structure:
1. Extract request body
2. Validate env vars (API keys)
3. Get config from gemini-config.ts helpers
4. Call Gemini API with structured prompts
5. Calculate & log cost estimates
6. Parse JSON responses (with fallback for analysis endpoints)
7. Return structured data

**Example:** [app/api/feedback/route.ts](app/api/feedback/route.ts) demonstrates full pattern with 3 analysis modes (translation comparison, Vietnamese-only, English-only)

### Voice Processing Flow
**STT (Speech-to-Text):**
- Frontend: MediaRecorder API → audio blob → FormData
- Backend: `/api/stt` (not shown in workspace but referenced)
- Languages: Vietnamese (`vi`) or English (`en`) based on phase

**TTS (Text-to-Speech):**
- Primary: ElevenLabs API via `/api/tts` for natural voice quality
- Fallback: Web Speech Synthesis API if ElevenLabs fails
- Audio delivery: Base64-encoded MP3 from backend → Audio element on frontend
- Voice ID configurable via `ELEVENLABS_VOICE_ID` env var

## Critical Files & Their Roles

- [lib/gemini-config.ts](lib/gemini-config.ts): Single source of truth for AI configuration, prompts, models, cost calculation
- [app/page.tsx](app/page.tsx): Main state machine controlling entire app flow
- [components/conversation-mode.tsx](components/conversation-mode.tsx): Two-phase recording (Vietnamese → English) with STT integration
- [app/api/chat/route.ts](app/api/chat/route.ts): Conversation API with optional reflective mode
- [app/api/feedback/route.ts](app/api/feedback/route.ts): Translation analysis with multiple input scenarios
- [app/api/diary/route.ts](app/api/diary/route.ts): Two-stage diary generation (authentic voice → literary polish)

## Component Conventions

### Screen Components
All screen components follow this pattern:
- Accept callback props for navigation (`onBack`, `onNext`, `onEndSession`, etc.)
- No direct state mutation of parent - communicate via callbacks
- Loading states passed as props from parent
- Named exports (not default): `export function LandingScreen({ ... })`

### UI Components
Located in [components/ui/](components/ui/):
- shadcn/ui components with Tailwind CSS
- Use `cn()` utility from [lib/utils.ts](lib/utils.ts) for conditional classes
- Radix UI primitives for accessibility

## Environment Variables

Required for full functionality:
```
GEMINI_API_KEY              # Google Gemini API key (primary AI)
ELEVENLABS_API_KEY          # ElevenLabs TTS (voice synthesis)
ELEVENLABS_VOICE_ID         # Voice selection (default: Rachel)
GEMINI_PROMPT_ID            # Optional: AI Studio prompt sync
```

See [PROMPT_SETUP.md](PROMPT_SETUP.md) for AI Studio integration guide.

## Development Workflow

**Run dev server:**
```bash
npm run dev
```

**Build:**
```bash
npm run build
```

**Lint:**
```bash
npm run lint
```

**Key development notes:**
- All cost estimates logged to console via `logCost()` - check terminal for API usage
- Conversation history format: `ConversationMessage[]` with `role`, `content`, `timestamp`
- JSON responses from Gemini require markdown stripping: `text.replace(/```json\n?/g, '').replace(/```\n?/g, '')`

## Project-Specific Patterns

### Conversation History Management
- Always passed as `ConversationMessage[]` type (defined in [app/page.tsx](app/page.tsx))
- Format for API: Map to `"${role}: ${content}"` strings (see `formatConversationTranscript()`)
- Context caching enabled after 2+ messages to reduce costs

### Multi-Mode Prompts
Several endpoints handle different input scenarios:
- **Feedback API:** Adapts prompt based on whether user provided Vietnamese, English, or both
- **Chat API:** Switches between conversation mode and reflective mode via `mode` parameter
- **Diary API:** Two sequential Gemini calls (authentic → literary) using chained prompts

### Error Handling Philosophy
- Always provide fallback content rather than showing errors to users
- Log errors to console for debugging but return graceful defaults
- Example: `FALLBACK_FEEDBACK` constant used when analysis fails

### Cost Optimization
- Token estimation: ~4 characters per token (see `estimateTokens()`)
- Free tier: 1,500 requests/day on Gemini
- ElevenLabs: 10,000 characters/month free tier
- Caching reduces input token costs by 90% (see `CACHE_CONFIG` in gemini-config.ts)

## Testing & Debugging

**Check AI responses:**
- Terminal logs show prompt preview, token counts, cost estimates
- Look for `🎯 [API_NAME]` emoji prefixes in logs

**Voice testing:**
- If TTS fails, app falls back to Web Speech API automatically
- Check browser console for audio playback errors

**Prompt iteration:**
- Edit prompts in AI Studio (if `GEMINI_PROMPT_ID` set) or directly in gemini-config.ts
- Changes to gemini-config.ts require server restart
- AI Studio prompts auto-refresh after 5-minute cache expiry
