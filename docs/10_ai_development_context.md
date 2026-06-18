# AI Development Context Document

**Project:** Footprint Lens
**Version:** 1.0
**Date:** June 2026
**Purpose:** Provide AI coding assistants with comprehensive, accurate context to maximize code quality and minimize hallucinations.

---

> **INSTRUCTION TO AI ASSISTANT:** Read this entire document before writing any code. Reference it continuously. If something contradicts this document, this document wins. If something is ambiguous, ask the developer — do not guess.

---

## 1. Project Overview

**Footprint Lens** is a personal carbon intelligence web application that:

1. **Ingests** financial transaction data (via Plaid), utility bills, and receipt scans
2. **Calculates** per-transaction carbon emissions (kg CO₂e) using emission factor databases
3. **Coaches** users with personalized, one-at-a-time action recommendations across 3 difficulty tiers
4. **Visualizes** carbon footprint through physical equivalences (balloons, Arctic ice, trees) and AR
5. **Connects** users in anonymous "Carbon Cohorts" for collective climate action
6. **Proves** impact through verified conservation project funding with satellite-verified certificates

**Business Model:** Freemium ($4.99/month premium). 10% of subscription revenue funds verified conservation projects.

**Target Users:** Environmentally curious consumers who want to understand and reduce their footprint without guilt or complexity.

**Emotional Design Core:** Clarity → Curiosity → Agency → Pride (never guilt or shame).

---

## 2. Tech Stack

**DO use these exact technologies. DO NOT substitute alternatives.**

| Layer | Technology | Version |
|:---|:---|:---|
| **Runtime** | Node.js | 20.x LTS |
| **Language** | TypeScript | 5.x (strict mode) |
| **Framework** | Next.js (App Router) | 14+ |
| **UI Library** | React | 18+ |
| **Styling** | Tailwind CSS | 3.4+ |
| **Animation** | Framer Motion | 11+ |
| **Complex Animations** | Lottie (lottie-react) | Latest |
| **API Protocol** | tRPC | 11+ |
| **ORM** | Drizzle ORM | Latest |
| **Database** | PostgreSQL | 16 (via Neon serverless) |
| **Cache** | Redis (via Upstash REST) | N/A |
| **Auth** | NextAuth.js v5 (Auth.js) | 5.x |
| **State (Client)** | Zustand | 4+ |
| **State (Server)** | React Query (via tRPC) | 5+ |
| **Icons** | Phosphor Icons (@phosphor-icons/react) | Latest |
| **Validation** | Zod | 3+ |
| **Background Jobs** | Inngest | Latest |
| **Object Storage** | Cloudflare R2 (S3-compatible) | N/A |
| **Payments** | Stripe | Latest |
| **OCR** | Google Vision API | v1 |
| **Hosting** | Vercel | N/A |
| **Testing** | Vitest + Playwright + React Testing Library | Latest |
| **Accessibility** | Radix UI Primitives | Latest |

### Explicitly NOT in the Stack

- ❌ **Express.js** — We use Next.js API routes
- ❌ **Prisma** — We use Drizzle ORM
- ❌ **MongoDB** — We use PostgreSQL
- ❌ **GraphQL** — We use tRPC (with REST fallback)
- ❌ **Redux / MobX** — We use Zustand + React Query
- ❌ **styled-components / Emotion** — We use Tailwind CSS
- ❌ **Jest** — We use Vitest
- ❌ **Cypress** — We use Playwright
- ❌ **Firebase Auth** — We use NextAuth.js
- ❌ **AWS Lambda** — We deploy on Vercel serverless
- ❌ **Chart.js** — We use custom SVG/D3 for data visualization
- ❌ **Class components** — Only functional components

---

## 3. Architecture Summary

```
Client (Next.js PWA)
    ↕ tRPC (type-safe)
API Layer (Next.js API Routes + tRPC handlers)
    ↕
Service Layer (business logic — carbon-engine, action-engine, etc.)
    ↕
Data Layer (Drizzle ORM → PostgreSQL, Upstash Redis, Cloudflare R2)
    ↕
Background Jobs (Inngest — bank sync, utility sync, impact reports)
    ↕
External APIs (Plaid, Climatiq, Google Vision, Stripe, electricityMap)
```

### Key Architecture Rules

1. **Server Components by default.** Only add `'use client'` when the component needs state, effects, or browser APIs.
2. **No business logic in route handlers.** Route handlers call service functions.
3. **All data fetching via tRPC.** Do not use raw `fetch()` for internal APIs.
4. **Database queries via Drizzle ORM.** No raw SQL strings. Use Drizzle's query builder.
5. **Background work via Inngest.** Never run long-running tasks in API route handlers.
6. **TypeScript strict mode.** No `any`. No `@ts-ignore` without a comment explaining why.

---

## 4. Database Schema Summary

### Core Tables

| Table | Purpose | Key Columns |
|:---|:---|:---|
| `users` | User accounts (supports anonymous) | `id`, `email`, `auth_provider`, `is_anonymous` |
| `user_profiles` | Lifestyle profile from onboarding | `home_type`, `diet_type`, `accuracy_score`, `total_co2_reduced_kg` |
| `user_preferences` | App settings | `theme`, `notification_frequency`, `pause_mode` |
| `data_sources` | Connected integrations | `source_type`, `provider`, `status`, `last_sync_at` |
| `transactions` | Raw bank transactions | `merchant_name`, `amount`, `transaction_date`, `user_corrected` |
| `carbon_records` | Calculated emissions per transaction/item | `co2e_kg`, `category`, `source_type`, `record_date` |
| `receipt_scans` | Uploaded receipt images | `image_url`, `status`, `raw_ocr_result` |
| `receipt_items` | Parsed receipt line items | `item_name`, `co2e_kg`, `impact_level`, `suggested_swap` |
| `emission_factors` | Carbon emission factor reference data | `category`, `factor_kg_co2e`, `source`, `region` |
| `merchant_categories` | Merchant → category mapping | `merchant_pattern`, `category` |
| `actions` | Action library | `title`, `tier_id`, `estimated_co2e_reduction_kg`, `context_rules` |
| `action_tiers` | Tier definitions (3 tiers) | `name`, `tier_level`, `unlock_threshold` |
| `user_actions` | Per-user action tracking | `status`, `dismissal_count`, `actual_co2e_saved_kg` |
| `cohorts` | Social groups | `name`, `type`, `invite_code` |
| `cohort_members` | Group membership | `avatar_color`, `avatar_shape`, `role` |
| `quests` | Collective challenges | `quest_type`, `target_co2e_kg`, `current_co2e_kg` |
| `forest_trees` | Living Forest visualization data | `tree_species`, `reduction_category`, `position_x`, `position_y` |
| `subscriptions` | Premium subscription state | `plan`, `status`, `payment_provider` |
| `notifications` | Notification feed | `type`, `title`, `is_read` |
| `impact_reports` | Monthly aggregate impact | `total_co2e_reduced_kg`, `fund_amount_usd` |
| `impact_projects` | Verified conservation projects | `partner`, `certificate_id`, `verification_url` |

### Database Rules

1. **UUIDs for all primary keys** (`gen_random_uuid()`)
2. **Soft delete for users** (`deleted_at` column)
3. **All tables have `created_at`** (TIMESTAMPTZ DEFAULT NOW())
4. **Foreign keys with CASCADE delete** for user-owned data
5. **Row-Level Security (RLS)** enabled on all user-scoped tables
6. **JSONB** for flexible/evolving data (context_rules, raw_data, metadata)
7. **snake_case** for all table and column names

---

## 5. API Standards

### Endpoint Pattern

```
METHOD /api/v1/<resource>[/<sub-resource>]
```

### Response Envelope

```typescript
// Success
{ data: T, meta: { request_id: string, timestamp: string } }

// Paginated
{ data: T[], meta: {...}, pagination: { page, per_page, total, total_pages, has_next, has_prev } }

// Error
{ error: { code: string, message: string, details?: Array<{ field, message, code }> }, meta: {...} }
```

### Error Codes

- `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `PREMIUM_REQUIRED` (403), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500), `UPSTREAM_ERROR` (502)

### Authentication

- JWT (RS256) access tokens — 15 min lifetime — in `Authorization: Bearer <token>` header
- Refresh tokens — 30 day lifetime — in HttpOnly Secure SameSite cookie
- Access token stored in memory only (never localStorage)

### Validation

- **Every API input** must have a Zod schema
- Validate on both client and server
- Return structured validation errors with field-level details

---

## 6. Coding Conventions

### TypeScript

```typescript
// ✅ DO
const totalCo2eKg: number = 820.5;
interface CarbonSummary { totalCo2eKg: number; deltaPercent: number; }
function calculateCO2e(input: CalculationInput): CarbonResult { }

// ❌ DON'T
let x: any = getData();
var total = 820.5;
function calc(a, b, c) { }
```

### React Components

```typescript
// ✅ DO — Functional component with typed props
interface CarbonPulseProps {
  totalCo2eKg: number;
  previousCo2eKg: number;
  showDelta?: boolean;
}

export function CarbonPulse({ totalCo2eKg, previousCo2eKg, showDelta = true }: CarbonPulseProps) {
  return <Card>...</Card>;
}

// ❌ DON'T — Class component, untyped props, inline styles
class CarbonPulse extends React.Component {
  render() {
    return <div style={{ color: 'green' }}>...</div>;
  }
}
```

### File Naming

- Components: `kebab-case.tsx` → PascalCase export (`carbon-pulse.tsx` → `export function CarbonPulse`)
- Hooks: `use-carbon-summary.ts`
- Utils: `format.ts`
- Types: `carbon.ts`
- DB Schema: `carbon-records.ts`
- Tests: `carbon-engine.test.ts` or `onboarding.spec.ts` (E2E)

### Import Order

```typescript
// 1. External packages
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal: server/services
import { calculateCO2e } from '@/server/services/carbon-engine';

// 3. Internal: components
import { Card, Badge } from '@/components/ui';

// 4. Internal: hooks, utils
import { useCarbonSummary } from '@/hooks/use-carbon-summary';
import { formatCO2 } from '@/lib/format';

// 5. Types (type-only imports)
import type { CarbonRecord } from '@/types/carbon';
```

---

## 7. Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, register
│   ├── (onboarding)/       # 5-Tap profile, accuracy meter
│   ├── (dashboard)/        # Main app (home, lens, actions, cohort, impact)
│   └── api/                # API routes (REST + tRPC + webhooks)
├── components/
│   ├── ui/                 # Design system primitives (Button, Card, Input)
│   ├── carbon/             # Carbon-specific (CarbonPulse, DeltaBadge)
│   ├── actions/            # Action engine (ActionCard, TierCard)
│   ├── lens/               # Visualizations (GlacierWidget, TimeMachine)
│   ├── social/             # Cohorts (CohortCard, ActivityFeed)
│   ├── impact/             # Forest, collective impact
│   ├── onboarding/         # CardSwipe, OnboardingStep
│   ├── layout/             # NavBar, Header, PageShell
│   └── providers/          # ThemeProvider, AuthProvider
├── server/
│   ├── api/routers/        # tRPC routers (carbon.ts, actions.ts, etc.)
│   ├── services/           # Business logic (carbon-engine.ts, action-engine.ts)
│   ├── jobs/               # Background jobs (bank-sync.ts, impact-report.ts)
│   └── auth/               # NextAuth.js configuration
├── db/
│   ├── schema/             # Drizzle ORM table definitions
│   ├── migrations/         # SQL migration files
│   ├── seed/               # Seed data (emission factors, actions)
│   └── index.ts            # DB connection client
├── lib/                    # Shared utils (format.ts, validators.ts, cn.ts)
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
└── types/                  # TypeScript type definitions
```

---

## 8. Constraints — Do NOT Violate These

### Absolute Rules

1. **Never store bank credentials.** Plaid handles all financial auth. We only store Plaid access tokens (encrypted).
2. **Never create a leaderboard.** Show percentile rank only. Never show named rankings.
3. **All cohort activity is anonymous.** No names, no photos, no individual contribution percentages.
4. **The forest cannot shrink.** It represents cumulative impact. Trees can fade (go grey) but never disappear.
5. **No guilt-based messaging.** The emotional arc is Clarity → Curiosity → Agency → Pride. Never shame.
6. **One action at a time.** The Action Engine shows a single recommendation. Never a list.
7. **Tier 2 actions are locked until 5 Tier 1 actions are completed.** This is a hard product rule.
8. **Every skip is optional.** No forced flows in onboarding. Every screen has a "Skip" or "Later" option.
9. **Reduced motion must be respected.** Check `prefers-reduced-motion` and replace animations with opacity transitions.
10. **All CO₂ values are in kg CO₂e** (kilograms of carbon dioxide equivalent). Display as tons when ≥1000 kg.

### Data Rules

1. Receipt images are deleted after 1 year (S3 lifecycle policy).
2. OCR raw results are deleted after 90 days.
3. User data is purged 30 days after account deletion request.
4. Emission factors are updated quarterly.
5. All carbon calculations log the emission factor source for auditability.

### Performance Rules

1. Initial page load (FCP) ≤ 1.5 seconds on 4G.
2. API responses (p95) ≤ 200ms for reads, ≤ 500ms for writes.
3. Receipt OCR end-to-end ≤ 3 seconds.
4. JS bundle ≤ 250KB gzipped.
5. Lighthouse ≥ 90 on all categories.

---

## 9. Security Rules

1. **All inputs validated with Zod** — both client and server side.
2. **All API routes require authentication** except: health check, public impact reports, webhook receivers.
3. **JWT access tokens are 15 minutes.** Refresh via HttpOnly cookie.
4. **Row-Level Security (RLS)** on all user-scoped PostgreSQL tables.
5. **Never log PII** — no emails, no names, no financial amounts in logs.
6. **CSP headers enforced** on all responses.
7. **CORS restricted** to `footprintlens.app` and known subdomains only.
8. **Rate limiting** on all endpoints (100 req/min free, 300 req/min premium).
9. **Webhook signatures verified** (Plaid signature, Stripe signature).
10. **No raw SQL.** All queries through Drizzle ORM.

---

## 10. UI Design Principles

### Color Palette (Use Exact Values)

| Name | Hex | CSS Variable | Usage |
|:---|:---|:---|:---|
| Soil | `#3A2E28` | `--color-soil` | Headlines, primary text |
| Moss | `#5B8C5A` | `--color-moss` | CTAs, success, positive deltas |
| Clay | `#C67B5C` | `--color-clay` | Reduction actions, warmth |
| Sky | `#7BA7BC` | `--color-sky` | Links, data viz, trust signals |
| Sand | `#FAF7F2` | `--color-sand` | App background (light mode) |
| Bark | `#F3EFE8` | `--color-bark` | Cards, surfaces (light mode) |
| Ember | `#D95D39` | `--color-ember` | High-impact alerts (use sparingly) |
| Ash | `#8B8680` | `--color-ash` | Secondary text, muted elements |
| Midnight | `#1A1817` | `--color-midnight` | Dark mode background |

### Typography

| Role | Font | Weight |
|:---|:---|:---|
| Headlines | Fraunces (variable serif) | 600–700 |
| Body | Inter (sans-serif) | 400–500 |
| Data/Numbers | JetBrains Mono (monospace) | 400–500 |
| UI Labels | Inter | 500–600 |

### Design Rules

1. **Never use pure green (#00FF00) or pure red (#FF0000).** Use Moss and Ember.
2. **Border radius:** 16px for cards, 12px for buttons, 8px for inputs.
3. **Shadows:** Subtle, organic (see "Dappled Light" shadow values in UI/UX doc).
4. **Animation duration:** 200–300ms for UI transitions; 400–600ms for celebrations.
5. **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo).
6. **Stagger:** List items animate in with 50ms delays.
7. **WCAG 2.1 AA minimum.** Target AAA for text contrast.
8. **Max content width:** 672px for reading; full width for data dashboards.
9. **Icons:** Phosphor Icons, Duotone style for primary, Regular for secondary.
10. **Dark mode:** Midnight (#1A1817) background; accent colors shift brighter for contrast.

---

## 11. Development Rules

### What to Do

- ✅ Use Server Components by default; `'use client'` only when needed
- ✅ Validate all inputs with Zod schemas (client + server)
- ✅ Use tRPC for all internal data fetching
- ✅ Use Drizzle ORM for all database queries
- ✅ Write unit tests for all business logic (carbon engine, action engine)
- ✅ Use path aliases (`@/components`, `@/server`, `@/lib`)
- ✅ Handle errors with custom error classes (AppError hierarchy)
- ✅ Use environment variables for all secrets and configuration
- ✅ Add `aria-label` and `role` attributes for accessibility
- ✅ Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- ✅ Return loading states with Skeleton components during data fetch
- ✅ Use Suspense boundaries for async Server Components

### What NOT to Do

- ❌ Never use `any` type — use `unknown` and narrow
- ❌ Never use `@ts-ignore` without an explanatory comment
- ❌ Never use `console.log` in production code — use structured logger
- ❌ Never store secrets in code — always environment variables
- ❌ Never use `dangerouslySetInnerHTML` — sanitize if absolutely necessary
- ❌ Never use `localStorage` for tokens — memory only
- ❌ Never make API calls directly from components — use tRPC hooks
- ❌ Never write raw SQL — use Drizzle ORM query builder
- ❌ Never create utility CSS classes outside the Tailwind config
- ❌ Never skip error handling — every async operation needs try/catch or error boundary

---

## 12. Definition of Done

A feature is "done" when ALL of the following are true:

### Code Quality
- [ ] TypeScript compiles with zero errors
- [ ] ESLint passes with zero warnings
- [ ] Prettier formatting applied
- [ ] No `any` types (unless justified with comment)
- [ ] All imports use path aliases (`@/`)

### Functionality
- [ ] Feature works as specified in requirements
- [ ] Edge cases handled (empty states, error states, loading states)
- [ ] Works on mobile (320px), tablet (768px), and desktop (1280px)
- [ ] Dark mode supported
- [ ] Reduced motion respected

### Testing
- [ ] Unit tests written for business logic (≥ 90% coverage)
- [ ] Component tests for interactive UI components
- [ ] Integration tests for new API endpoints
- [ ] All existing tests pass
- [ ] Manual testing on Chrome, Safari, Firefox

### Accessibility
- [ ] Keyboard navigable
- [ ] Screen reader tested (VoiceOver or NVDA)
- [ ] Focus indicators visible
- [ ] Color is not the sole information carrier
- [ ] WCAG 2.1 AA contrast ratios met

### Security
- [ ] Inputs validated with Zod
- [ ] No PII in logs
- [ ] Authorization checks on API endpoints
- [ ] No secrets in code

### Documentation
- [ ] API endpoints documented (if new)
- [ ] Complex logic has inline comments
- [ ] README updated (if setup changed)

### Performance
- [ ] No unnecessary re-renders (React DevTools profiler)
- [ ] Images optimized (Next.js Image component)
- [ ] No layout shifts (CLS ≤ 0.1)
- [ ] Bundle size not significantly increased

### Review
- [ ] PR description includes what/why/testing
- [ ] At least 1 approval from team member
- [ ] CI pipeline passes

---

## 13. Common Patterns

### tRPC Router Example

```typescript
// src/server/api/routers/carbon.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { getCarbonSummary } from '@/server/services/carbon-engine';

export const carbonRouter = createTRPCRouter({
  getSummary: protectedProcedure
    .input(z.object({
      period: z.enum(['day', 'week', 'month', 'year']).default('month'),
      date: z.string().date().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return getCarbonSummary(ctx.session.user.id, input.period, input.date);
    }),
});
```

### Drizzle ORM Query Example

```typescript
// src/server/services/carbon-engine.ts
import { db } from '@/db';
import { carbonRecords, transactions } from '@/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export async function getCarbonSummary(userId: string, period: string, date?: string) {
  const { startDate, endDate } = getDateRange(period, date);

  const records = await db
    .select({
      category: carbonRecords.category,
      total: sql<number>`SUM(${carbonRecords.co2eKg})`,
    })
    .from(carbonRecords)
    .where(
      and(
        eq(carbonRecords.userId, userId),
        gte(carbonRecords.recordDate, startDate),
        lte(carbonRecords.recordDate, endDate)
      )
    )
    .groupBy(carbonRecords.category);

  return records;
}
```

### Component with tRPC Example

```typescript
// src/components/carbon/carbon-pulse.tsx
'use client';

import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { DeltaBadge } from '@/components/carbon/delta-badge';
import { Skeleton } from '@/components/ui/skeleton';

export function CarbonPulse() {
  const { data, isLoading } = trpc.carbon.getSummary.useQuery({ period: 'month' });

  if (isLoading) return <Skeleton className="h-48 rounded-2xl" />;
  if (!data) return null;

  return (
    <Card>
      <h2 className="font-fraunces text-3xl font-bold text-soil">
        {(data.totalCo2eKg / 1000).toFixed(2)}
      </h2>
      <p className="text-base text-ash">tons CO₂</p>
      <DeltaBadge current={data.totalCo2eKg} previous={data.previousCo2eKg} />
    </Card>
  );
}
```

### Inngest Job Example

```typescript
// src/server/jobs/bank-sync.ts
import { inngest } from '@/lib/inngest';
import { syncPlaidTransactions } from '@/server/services/plaid-service';

export const bankSync = inngest.createFunction(
  { id: 'bank-sync', retries: 3 },
  { cron: '0 6 * * *' }, // Daily at 6 AM
  async ({ step }) => {
    const dataSources = await step.run('fetch-active-sources', async () => {
      return getActiveDataSources('bank');
    });

    for (const source of dataSources) {
      await step.run(`sync-${source.id}`, async () => {
        await syncPlaidTransactions(source);
      });
    }
  }
);
```

---

*This document is the single source of truth for AI-assisted development on Footprint Lens. When in doubt, reference this document. When this document is insufficient, ask the developer.*
