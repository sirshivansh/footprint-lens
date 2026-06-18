# Project Structure Document

**Project:** Footprint Lens
**Version:** 1.0
**Date:** June 2026
**Status:** Draft

---

## 1. Folder Structure

```
footprint-lens/
├── docs/                              # Project documentation
│   ├── product_design.md
│   ├── uiux.md
│   ├── 01_technical_requirements.md
│   ├── 02_system_architecture.md
│   ├── 03_database_design.md
│   ├── 04_api_specification.md
│   ├── 05_development_roadmap.md
│   ├── 06_devops_deployment.md
│   ├── 07_security_design.md
│   ├── 08_testing_strategy.md
│   ├── 09_project_structure.md
│   ├── 10_ai_development_context.md
│   └── README.md
│
├── src/
│   ├── app/                           # Next.js App Router (pages + layouts)
│   │   ├── (auth)/                    # Auth route group (no layout nesting)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (onboarding)/              # Onboarding route group
│   │   │   ├── welcome/
│   │   │   │   └── page.tsx
│   │   │   ├── profile-setup/
│   │   │   │   └── page.tsx
│   │   │   ├── accuracy/
│   │   │   │   └── page.tsx
│   │   │   ├── lens-preview/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/               # Main app route group
│   │   │   ├── page.tsx               # Home (Carbon Pulse)
│   │   │   ├── lens/
│   │   │   │   └── page.tsx           # Lens (Radical Transparency)
│   │   │   ├── actions/
│   │   │   │   ├── page.tsx           # Actions overview (tiers)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Individual action detail
│   │   │   ├── cohort/
│   │   │   │   ├── page.tsx           # My Cohort
│   │   │   │   ├── join/
│   │   │   │   │   └── page.tsx       # Join cohort
│   │   │   │   └── quest/
│   │   │   │       └── page.tsx       # Quest detail
│   │   │   ├── impact/
│   │   │   │   ├── page.tsx           # Impact overview (forest + collective)
│   │   │   │   └── verification/
│   │   │   │       └── page.tsx       # Verification certificates
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx           # Profile settings
│   │   │   │   ├── data-sources/
│   │   │   │   │   └── page.tsx       # Connected data sources
│   │   │   │   └── privacy/
│   │   │   │       └── page.tsx       # Privacy center
│   │   │   ├── receipts/
│   │   │   │   ├── page.tsx           # Receipt history
│   │   │   │   └── scan/
│   │   │   │       └── page.tsx       # Receipt scanner
│   │   │   └── layout.tsx             # Dashboard layout (nav, header)
│   │   ├── api/                       # API routes
│   │   │   ├── v1/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── [...nextauth]/
│   │   │   │   │   │   └── route.ts   # NextAuth.js catch-all
│   │   │   │   │   └── anonymous/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── carbon/
│   │   │   │   │   ├── summary/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── transactions/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── receipts/
│   │   │   │   │   └── route.ts
│   │   │   │   └── webhooks/
│   │   │   │       ├── plaid/
│   │   │   │       │   └── route.ts
│   │   │   │       └── stripe/
│   │   │   │           └── route.ts
│   │   │   ├── trpc/
│   │   │   │   └── [trpc]/
│   │   │   │       └── route.ts       # tRPC catch-all handler
│   │   │   └── health/
│   │   │       └── route.ts           # Health check endpoint
│   │   ├── layout.tsx                 # Root layout (providers, fonts)
│   │   ├── not-found.tsx              # 404 page
│   │   ├── error.tsx                  # Error boundary
│   │   └── globals.css                # Global styles + Tailwind
│   │
│   ├── components/                    # Shared React components
│   │   ├── ui/                        # Design system primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   ├── pill-tabs.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── index.ts               # Barrel export
│   │   ├── carbon/                    # Carbon-specific components
│   │   │   ├── carbon-pulse.tsx        # Monthly summary card
│   │   │   ├── category-breakdown.tsx  # Pie/bar chart by category
│   │   │   ├── delta-badge.tsx         # ↓28% change indicator
│   │   │   ├── accuracy-meter.tsx      # Circular gauge (55%→95%)
│   │   │   └── equivalence-card.tsx    # CO₂ → physical metaphor
│   │   ├── actions/                   # Action engine components
│   │   │   ├── action-card.tsx         # Single action CTA card
│   │   │   ├── tier-card.tsx           # Tier with progress/lock
│   │   │   ├── frosted-lock.tsx        # Frosted glass lock overlay
│   │   │   └── action-completion.tsx   # "Nice work" confirmation
│   │   ├── lens/                      # Lens & visualization components
│   │   │   ├── glacier-widget.tsx      # Mini glacier SVG/Lottie
│   │   │   ├── time-machine.tsx        # Timeline scrubber
│   │   │   ├── receipt-lens.tsx        # Color-coded receipt view
│   │   │   └── ar-viewer.tsx           # AR camera view (WebAR)
│   │   ├── social/                    # Cohort & social components
│   │   │   ├── cohort-card.tsx         # Cohort overview
│   │   │   ├── quest-progress.tsx      # Quest progress bar + map
│   │   │   ├── activity-feed.tsx       # Anonymous activity feed
│   │   │   ├── ripple-notification.tsx # Ripple nudge
│   │   │   └── avatar.tsx              # Abstract organic avatar
│   │   ├── impact/                    # Impact & forest components
│   │   │   ├── living-forest.tsx       # Procedural forest SVG/Canvas
│   │   │   ├── forest-tree.tsx         # Individual tree component
│   │   │   ├── collective-stats.tsx    # Platform-wide impact cards
│   │   │   └── verification-card.tsx   # Certificate/satellite card
│   │   ├── onboarding/               # Onboarding-specific components
│   │   │   ├── card-swipe.tsx          # Tinder-style card selector
│   │   │   └── onboarding-step.tsx     # Step wrapper with skip
│   │   ├── layout/                    # Layout components
│   │   │   ├── nav-bar.tsx             # Bottom nav (mobile) / sidebar (desktop)
│   │   │   ├── header.tsx              # Top bar with logo
│   │   │   └── page-shell.tsx          # Max-width container + padding
│   │   └── providers/                 # React context providers
│   │       ├── theme-provider.tsx
│   │       ├── auth-provider.tsx
│   │       └── trpc-provider.tsx
│   │
│   ├── server/                        # Server-side code
│   │   ├── api/                       # tRPC router definitions
│   │   │   ├── root.ts                # Root router
│   │   │   ├── trpc.ts                # tRPC initialization + context
│   │   │   └── routers/
│   │   │       ├── auth.ts
│   │   │       ├── carbon.ts
│   │   │       ├── actions.ts
│   │   │       ├── receipts.ts
│   │   │       ├── cohorts.ts
│   │   │       ├── impact.ts
│   │   │       ├── profile.ts
│   │   │       ├── subscriptions.ts
│   │   │       └── notifications.ts
│   │   ├── services/                  # Business logic services
│   │   │   ├── carbon-engine.ts       # Carbon calculation pipeline
│   │   │   ├── action-engine.ts       # Action recommendation algorithm
│   │   │   ├── equivalence-engine.ts  # CO₂ → equivalence translator
│   │   │   ├── ocr-service.ts         # Receipt OCR processing
│   │   │   ├── plaid-service.ts       # Plaid integration
│   │   │   ├── notification-service.ts
│   │   │   ├── subscription-service.ts
│   │   │   └── impact-service.ts
│   │   ├── jobs/                      # Background job handlers
│   │   │   ├── bank-sync.ts           # Plaid transaction sync
│   │   │   ├── utility-sync.ts        # Utility data sync
│   │   │   ├── carbon-recalculate.ts  # Bulk recalculation
│   │   │   ├── impact-report.ts       # Monthly report generation
│   │   │   └── data-cleanup.ts        # Retention policy enforcement
│   │   └── auth/                      # Auth configuration
│   │       ├── auth.config.ts         # NextAuth configuration
│   │       └── auth.ts                # Session helpers
│   │
│   ├── db/                            # Database layer
│   │   ├── schema/                    # Drizzle ORM schema definitions
│   │   │   ├── users.ts
│   │   │   ├── transactions.ts
│   │   │   ├── carbon-records.ts
│   │   │   ├── actions.ts
│   │   │   ├── cohorts.ts
│   │   │   ├── impact.ts
│   │   │   ├── subscriptions.ts
│   │   │   ├── notifications.ts
│   │   │   └── index.ts               # Schema barrel export
│   │   ├── migrations/               # Drizzle migration files
│   │   │   └── 0001_initial.sql
│   │   ├── seed/                      # Seed data
│   │   │   ├── emission-factors.ts
│   │   │   ├── merchant-categories.ts
│   │   │   ├── action-library.ts
│   │   │   └── seed.ts                # Seed runner
│   │   ├── index.ts                   # DB connection + Drizzle client
│   │   └── drizzle.config.ts          # Drizzle Kit configuration
│   │
│   ├── lib/                           # Shared utilities
│   │   ├── utils.ts                   # General utility functions
│   │   ├── constants.ts               # App constants
│   │   ├── validators.ts              # Zod schemas for shared types
│   │   ├── format.ts                  # Number, date, currency formatters
│   │   ├── cn.ts                      # Tailwind class merge utility
│   │   └── errors.ts                  # Custom error classes
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── use-carbon-summary.ts
│   │   ├── use-current-action.ts
│   │   ├── use-cohort.ts
│   │   ├── use-forest.ts
│   │   ├── use-theme.ts
│   │   ├── use-media-query.ts
│   │   └── use-reduced-motion.ts
│   │
│   ├── stores/                        # Zustand stores (client state)
│   │   ├── onboarding-store.ts
│   │   ├── ui-store.ts
│   │   └── receipt-store.ts
│   │
│   └── types/                         # TypeScript type definitions
│       ├── carbon.ts
│       ├── actions.ts
│       ├── cohorts.ts
│       ├── user.ts
│       └── api.ts
│
├── public/                            # Static assets
│   ├── fonts/                         # Self-hosted fonts (if needed)
│   ├── icons/                         # App icons, favicons
│   ├── images/                        # Static images
│   ├── lottie/                        # Lottie animation files
│   │   ├── glacier.json
│   │   ├── tree-growth.json
│   │   └── ripple.json
│   ├── manifest.json                  # PWA manifest
│   └── sw.js                          # Service worker
│
├── __tests__/                         # Test files (mirrors src/ structure)
│   ├── services/
│   │   ├── carbon-engine.test.ts
│   │   ├── action-engine.test.ts
│   │   └── equivalence-engine.test.ts
│   ├── components/
│   │   ├── carbon-pulse.test.tsx
│   │   └── action-card.test.tsx
│   ├── api/
│   │   ├── carbon-summary.test.ts
│   │   └── actions.test.ts
│   ├── fixtures/                      # Test data & fixtures
│   │   ├── users.ts
│   │   ├── transactions.ts
│   │   └── receipts/
│   └── helpers/                       # Test utility functions
│       ├── db.ts
│       └── auth.ts
│
├── e2e/                               # Playwright E2E tests
│   ├── onboarding.spec.ts
│   ├── dashboard.spec.ts
│   ├── actions.spec.ts
│   ├── receipt-scan.spec.ts
│   ├── cohorts.spec.ts
│   └── fixtures/
│       └── test-receipt.jpg
│
├── .github/                           # GitHub configuration
│   ├── workflows/
│   │   ├── ci.yml                     # CI pipeline
│   │   ├── deploy-staging.yml
│   │   └── deploy-production.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── .husky/                            # Git hooks
│   ├── pre-commit                     # Lint-staged
│   └── commit-msg                     # Commitlint
│
├── .env.example                       # Environment variable template
├── .env.local                         # Local dev env (gitignored)
├── .eslintrc.cjs                      # ESLint configuration
├── .prettierrc                        # Prettier configuration
├── .gitignore
├── commitlint.config.js               # Commit message rules
├── drizzle.config.ts                  # Drizzle Kit config
├── next.config.mjs                    # Next.js configuration
├── package.json
├── playwright.config.ts               # Playwright configuration
├── postcss.config.js                  # PostCSS for Tailwind
├── tailwind.config.ts                 # Tailwind theme (design system)
├── tsconfig.json                      # TypeScript configuration
├── vitest.config.ts                   # Vitest configuration
└── README.md                          # Project README
```

---

## 2. Naming Conventions

### 2.1 Files & Directories

| Entity | Convention | Example |
|:---|:---|:---|
| **Directories** | kebab-case | `carbon-records/`, `data-sources/` |
| **React Components** | kebab-case filename, PascalCase export | `carbon-pulse.tsx` → `export function CarbonPulse()` |
| **Utilities / Hooks** | kebab-case | `use-carbon-summary.ts`, `format.ts` |
| **Types** | kebab-case | `carbon.ts`, `actions.ts` |
| **API Routes** | kebab-case (matches URL path) | `api/v1/carbon/summary/route.ts` |
| **Test Files** | `*.test.ts(x)` or `*.spec.ts` | `carbon-engine.test.ts` |
| **DB Schema** | kebab-case | `carbon-records.ts` |
| **DB Migrations** | `NNNN_description.sql` | `0001_initial.sql` |
| **Constants** | SCREAMING_SNAKE_CASE | `MAX_COHORT_MEMBERS = 12` |
| **Environment Vars** | SCREAMING_SNAKE_CASE | `PLAID_CLIENT_ID` |

### 2.2 Code Entities

| Entity | Convention | Example |
|:---|:---|:---|
| **React Components** | PascalCase | `CarbonPulse`, `ActionCard` |
| **Functions** | camelCase | `calculateCO2e()`, `mapMerchantToCategory()` |
| **Variables** | camelCase | `totalCo2eKg`, `userProfile` |
| **Constants** | SCREAMING_SNAKE_CASE | `EMISSION_FACTOR_SOURCES` |
| **Types / Interfaces** | PascalCase | `CarbonRecord`, `UserProfile` |
| **Enums** | PascalCase (values: PascalCase) | `ActionTier.LightSwitch` |
| **DB Tables** | snake_case (plural) | `carbon_records`, `user_actions` |
| **DB Columns** | snake_case | `co2e_kg`, `created_at` |
| **API Endpoints** | kebab-case | `/v1/data-sources`, `/v1/carbon/time-machine` |
| **CSS Classes** | kebab-case (BEM-style when needed) | `action-card`, `action-card--locked` |

### 2.3 Component Structure

```typescript
// Standard component file structure
// 1. Imports (external → internal → types → styles)
// 2. Types/Interfaces
// 3. Component
// 4. Sub-components (if any)
// 5. Export

import { useState } from 'react';                   // External
import { Card, Badge } from '@/components/ui';        // Internal
import type { CarbonSummary } from '@/types/carbon';  // Types

interface CarbonPulseProps {
  summary: CarbonSummary;
  showDelta?: boolean;
}

export function CarbonPulse({ summary, showDelta = true }: CarbonPulseProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
}
```

---

## 3. Coding Standards

### 3.1 TypeScript

- **Strict mode** enabled (`"strict": true` in tsconfig.json)
- **No `any`** — Use `unknown` for truly unknown types, then narrow with type guards
- **Prefer interfaces** for object shapes; use `type` for unions/intersections
- **Exhaustive switch/case** — Always handle all enum values
- **Path aliases** — Use `@/` for `src/` imports

### 3.2 React

- **Functional components only** — No class components
- **Server Components by default** — Use `'use client'` only when needed (state, effects, browser APIs)
- **Colocation** — Keep related files close (component + test + types in same directory when appropriate)
- **Props interface** — Always define a typed props interface (no inline object types)
- **No prop drilling > 2 levels** — Use context or Zustand store
- **Memoization** — Use `React.memo`, `useMemo`, `useCallback` only when profiling shows a need (not by default)

### 3.3 API

- **Input validation** — Zod schema on every endpoint input
- **Error handling** — Custom error classes; consistent error response format
- **No business logic in route handlers** — Call service functions
- **Idempotency** — All mutation endpoints accept `Idempotency-Key` header

### 3.4 CSS / Styling

- **Tailwind utilities** for layout, spacing, colors
- **Custom theme** in `tailwind.config.ts` extending the design system
- **No arbitrary values** without design system justification
- **Dark mode** via Tailwind `dark:` variant
- **Responsive** via Tailwind breakpoint prefixes (`sm:`, `md:`, `lg:`)
- **Animation** via Framer Motion (not CSS `@keyframes` — for consistency and `prefers-reduced-motion` support)

### 3.5 Error Handling

```typescript
// Custom error hierarchy
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message: string, details: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super('Authentication required', 'UNAUTHORIZED', 401);
  }
}
```

---

## 4. Git Workflow

### 4.1 Branching Strategy — Git Flow (Simplified)

```mermaid
gitgraph
    commit id: "Initial"
    branch develop
    commit id: "Setup"
    branch feature/auth
    commit id: "Auth: Login"
    commit id: "Auth: OAuth"
    checkout develop
    merge feature/auth
    branch feature/carbon-engine
    commit id: "Carbon: Calculator"
    commit id: "Carbon: Emissions DB"
    checkout develop
    merge feature/carbon-engine
    branch release/v1.0
    commit id: "v1.0 RC"
    checkout main
    merge release/v1.0 tag: "v1.0.0"
    checkout develop
    merge release/v1.0
```

### 4.2 Branch Naming

| Type | Pattern | Example |
|:---|:---|:---|
| Feature | `feature/<short-description>` | `feature/carbon-engine` |
| Bug Fix | `fix/<short-description>` | `fix/dashboard-delta-calc` |
| Hotfix | `hotfix/<short-description>` | `hotfix/auth-token-expiry` |
| Chore | `chore/<short-description>` | `chore/update-dependencies` |
| Release | `release/v<version>` | `release/v1.0` |

### 4.3 Commit Messages — Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

| Type | Usage |
|:---|:---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring (no behavior change) |
| `style` | Formatting, no logic changes |
| `docs` | Documentation only |
| `test` | Adding/updating tests |
| `chore` | Build, CI, dependencies |
| `perf` | Performance improvement |

**Examples:**
```
feat(carbon): add emission factor lookup for transport category
fix(actions): correct tier unlock threshold from 8 to 5
refactor(db): migrate transaction queries to Drizzle ORM
docs(api): update carbon summary endpoint response schema
test(engine): add edge cases for zero-emission transactions
chore(deps): update Next.js to 14.3.0
```

### 4.4 Pull Request Process

1. **Branch from `develop`** (never from `main`)
2. **Keep PRs small** — Aim for < 400 lines changed
3. **Self-review** before requesting review
4. **PR description** must include:
   - What changed and why
   - Screenshots for UI changes
   - Testing performed
   - Breaking changes (if any)
5. **Minimum 1 approval** before merge
6. **Squash merge** to `develop` (clean history)
7. **Delete branch** after merge

### 4.5 Branch Protection Rules

| Rule | `main` | `develop` |
|:---|:---|:---|
| Require PR | ✅ | ✅ |
| Require approvals | 1 | 1 |
| Require CI pass | ✅ | ✅ |
| Require up-to-date | ✅ | ❌ |
| Allow force push | ❌ | ❌ |
| Allow deletions | ❌ | ❌ |

---

## 5. Import Organization

```typescript
// Import order (enforced by ESLint)
// 1. Node built-ins
import { readFile } from 'fs/promises';

// 2. External packages
import { z } from 'zod';
import { eq } from 'drizzle-orm';

// 3. Internal: server
import { db } from '@/db';
import { carbonRecords } from '@/db/schema';

// 4. Internal: services
import { calculateCO2e } from '@/server/services/carbon-engine';

// 5. Internal: components
import { Card, Badge } from '@/components/ui';

// 6. Internal: hooks, stores, utils
import { useCarbonSummary } from '@/hooks/use-carbon-summary';
import { formatCO2 } from '@/lib/format';

// 7. Types (type-only imports)
import type { CarbonRecord } from '@/types/carbon';

// 8. Styles (if any)
import './styles.css';
```

---

## 6. Editor Configuration

### `.editorconfig`

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

### VS Code Settings (`.vscode/settings.json`)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

*Document maintained by the Engineering Team. Last updated: June 2026.*
