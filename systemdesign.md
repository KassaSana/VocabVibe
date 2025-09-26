# 🎸 VocalVibe - System Design Document

**AI AGENT CONTEXT**: This is a music learning app (think Guitar Hero meets Duolingo for singing). Users sing into their mic, get real-time pitch feedback, and level up their vocal skills through gamified lessons.

## 🎯 PROJECT OVERVIEW
- **Goal**: Build a viral music learning app with modern tech stack
- **Target**: Get hired as a full-stack TypeScript developer
- **Timeline**: MVP in 1 week, polish in 1 month
- **Architecture**: Monorepo with Next.js frontend + Hono backend

🎯 CORE PRODUCT LOOP

User opens app → instant mic access (no signup)
Picks a song/lesson → sees notes coming at them
Sings into mic → sees real-time pitch feedback
Completes song → gets score, XP, dopamine hit
Unlocks next challenge → returns tomorrow for streak

🏗 TECH STACK (2025 HIRE-WORTHY)
yamlFrontend:
  Framework: Next.js 15 (App Router) + TypeScript
  State: Zustand + TanStack Query
  Styling: Tailwind CSS + shadcn/ui + Framer Motion
  Audio: Web Audio API + Tone.js
  3D/Games: Three.js + React Three Fiber
  Forms: React Hook Form + Zod
  Testing: Vitest + Playwright

Backend:
  Runtime: Bun (faster than Node)
  Framework: Hono (faster than Express)
  ORM: Drizzle (TypeScript-first)
  Database: PostgreSQL (Neon.tech for serverless)
  Auth: Lucia Auth v3
  Validation: Zod everywhere
  Realtime: PartyKit (better than Socket.io)

Infrastructure:
  Hosting: Vercel (frontend) + Railway (backend)
  Database: Neon (Postgres) + Upstash (Redis)
  Storage: Uploadthing or S3
  Monitoring: Sentry + PostHog
  CI/CD: GitHub Actions
  Email: Resend
📁 PROJECT STRUCTURE
/apps
  /web (Next.js frontend)
  /api (Hono backend)
/packages
  /database (Drizzle schemas)
  /shared (Zod schemas, types)
  /audio-engine (Pitch detection)
/infrastructure
  docker-compose.yml
  .env.example
🗄 DATA MODELS
Core Entities
typescript// User - Keep it simple at first
User {
  id: uuid
  email?: string // optional for guests
  username: string
  createdAt: timestamp
  streakDays: number
  currentLevel: number
  totalXP: number
}

// Session - Every practice attempt
Session {
  id: uuid
  userId: uuid
  songId?: uuid
  startedAt: timestamp
  endedAt?: timestamp
  score: number
  accuracy: number // 0-100%
  maxCombo: number
  perfectNotes: number
  missedNotes: number
}

// Song - Content to practice
Song {
  id: uuid
  title: string
  artist: string
  difficulty: 1-10
  bpm: number
  durationMs: number
  audioUrl: string
  chartData: jsonb // Note timing data
}

// Progress - Track learning
Progress {
  id: uuid
  userId: uuid
  songId: uuid
  bestScore: number
  playCount: number
  mastered: boolean
  lastPlayedAt: timestamp
}
🔥 KEY FEATURES (MVP)
Phase 1: Core Magic (Week 1)

 Mic input + pitch detection
 Visual pitch indicator
 Single song with note highway
 Basic scoring
 Local storage persistence

Phase 2: Addiction Mechanics (Week 2)

 User accounts
 XP and leveling
 Daily streaks
 5 songs catalog
 Leaderboard

Phase 3: Social Proof (Week 3)

 Share scores on Twitter
 Friend challenges
 Weekly tournaments
 Achievement badges

🎮 AUDIO ENGINE SPECS
typescript// Client-side pitch detection
class AudioEngine {
  - Sample rate: 44100 Hz
  - Buffer size: 2048
  - Pitch algorithm: Autocorrelation (ML5.js or Pitchy)
  - Latency target: <50ms
  - Confidence threshold: 0.8
}

// Scoring algorithm
score = (accuracy * 0.6) + (timing * 0.3) + (combo * 0.1)
// Accuracy: How close to target pitch
// Timing: Hit notes in time window
// Combo: Consecutive correct notes
🚀 API ENDPOINTS
typescript// Auth
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/session

// Game
GET    /songs
GET    /songs/:id
POST   /sessions/start
PATCH  /sessions/:id/end
GET    /sessions/:userId

// Social
GET    /leaderboard?period=weekly
GET    /users/:id/profile
POST   /challenges

// Realtime (PartyKit)
WS     /party/room/:roomId
🏃 PERFORMANCE TARGETS

First Contentful Paint: <1s
Time to Interactive: <2s
Lighthouse Score: >90
API Response: <100ms (p95)
WebSocket Latency: <50ms
Bundle Size: <200KB (initial)

🔐 SECURITY CHECKLIST

 Input sanitization (Zod everywhere)
 Rate limiting (Upstash ratelimit)
 CORS properly configured
 SQL injection prevention (Drizzle ORM)
 JWT stored in httpOnly cookies
 Environment variables in .env.vault

💡 VIBE CODING RULES

Ship daily - Deploy something every day
User feedback > Perfect code - Get it live, iterate
Animations everywhere - Framer Motion on every interaction
Sound effects - Every click should have feedback
Dark mode default - This is 2025
Mobile-first - Design for phone, scale to desktop

🎯 SUCCESS METRICS

Day 1 Retention: >40%
Day 7 Retention: >20%
Session Length: >5 minutes
Sessions per Day: >2
Viral Coefficient: >0.5

🧠 AI AGENT INSTRUCTIONS
When I ask you to implement something:

Use the tech stack above (no substitutions)
Make it beautiful by default (use shadcn/ui)
Add animations (Framer Motion)
Include error handling
Add loading states
Make it mobile responsive
Use TypeScript strictly
Follow the folder structure
Keep components under 150 lines
Extract hooks for logic

🎨 UI/UX PRINCIPLES

Instant feedback (no loading screens)
Juice everything (particles, sounds, haptics)
Progress visible always (XP bar, streak counter)
One-thumb mobile navigation
60fps animations minimum
Celebrate wins (confetti, sounds)

📝 CURRENT FOCUS
TODAY'S GOAL: Get pitch detection working with visual feedback
THIS WEEK: Ship MVP with 1 song playable
THIS MONTH: 100 users with >20% retention