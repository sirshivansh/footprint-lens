# 🌿 Footprint Lens

> **See Your Impact. Shrink It. Prove It.**

A personal carbon intelligence platform that helps individuals understand, track, and reduce their carbon footprint through personalized insights and simple actions.

---

## ✨ What It Does

- **Understand** — Complete a quick lifestyle profile to get your estimated carbon footprint
- **Track** — See monthly CO₂ breakdowns across transport, diet, energy, and shopping
- **Reduce** — Receive personalized, one-at-a-time action recommendations ranked by impact
- **Prove** — Watch your Living Forest grow as you reduce emissions

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + Framer Motion |
| API | tRPC (end-to-end type safety) |
| Database | PostgreSQL (Neon serverless) |
| ORM | Drizzle ORM |
| Auth | NextAuth.js v5 |
| Testing | Vitest + React Testing Library |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Neon PostgreSQL account (free tier)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run database migrations
npx drizzle-kit migrate

# Seed initial data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Challenge

**PromptWars Virtual — Challenge 3**

*"Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights."*

### Approach

Footprint Lens follows a **Understand → Track → Reduce → Prove** loop:

1. **5-Tap Onboarding** — Card-swipe profile (home, transport, diet, flights, shopping) estimates your footprint in under 90 seconds
2. **Carbon Calculation Engine** — Maps transactions to emission factors (DEFRA/EPA data) to produce kg CO₂e per activity
3. **Action Engine** — Recommends ONE action at a time across 3 progressive tiers, ranked by `Reduction Potential × Feasibility`
4. **Equivalence Engine** — Translates abstract CO₂ numbers into physical metaphors (balloons, Arctic ice, trees)
5. **Living Forest** — Procedural visualization where each tree = 100 kg CO₂ reduced
6. **Carbon Cohorts** — Anonymous groups for collective climate action without shame or competition

### Key Design Decisions

- **Emotional arc:** Clarity → Curiosity → Agency → Pride (never guilt)
- **Progressive accuracy:** Profile estimates (55%) improve as users add data sources (up to 95%)
- **Tiered coaching:** Light Switches → Habit Builders → Lifestyle Levers (Tier 2 unlocks after 5 Tier 1 completions)
- **Privacy-first social:** All cohort activity is anonymous — no names, no leaderboards

### Assumptions

- Emission factors are sourced from publicly available DEFRA and EPA databases
- Receipt scanning uses client-side OCR (Tesseract.js) for zero-cost processing
- Demo transactions are seeded on onboarding to showcase the full dashboard experience
- Carbon calculations use spend-based estimation where item-level data is unavailable

## 📁 Project Structure

```
src/
├── app/              # Next.js pages & API routes
├── components/       # React components (ui/, carbon/, actions/, etc.)
├── server/           # tRPC routers & business logic services
├── db/               # Drizzle schema, migrations, seeds
├── lib/              # Utilities, constants, validators
├── hooks/            # Custom React hooks
├── stores/           # Zustand client state
└── types/            # TypeScript type definitions
```

## 🧪 Testing

```bash
npm run test            # Unit tests
npm run test:coverage   # With coverage
npm run lint            # ESLint
npm run type-check      # TypeScript
```

## 📄 License

MIT
