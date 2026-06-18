# Footprint Lens

> **See Your Impact. Shrink It. Prove It.**

A personal carbon intelligence platform that transforms your financial and lifestyle data into a living map of your environmental impact — then coaches you, step by step, toward a lighter life.

[![CI](https://github.com/footprint-lens/footprint-lens/actions/workflows/ci.yml/badge.svg)](https://github.com/footprint-lens/footprint-lens/actions)
[![License](https://img.shields.io/badge/license-proprietary-blue.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://typescriptlang.org)

---

## ✨ Features

- **Passive Carbon Tracking** — Automatically calculates your carbon footprint from bank transactions, utility bills, and smart home data
- **AI-Powered Coaching** — Personalized, one-action-at-a-time recommendations ranked by impact and feasibility
- **Receipt Scanner** — Snap a photo for item-level carbon tagging with swap suggestions
- **Radical Transparency** — See your footprint as AR balloons filling your room, melting glaciers, or trees working overtime
- **Carbon Cohorts** — Join anonymous groups for collective climate action without competition or shame
- **Living Forest** — Watch your personal forest grow as you reduce emissions, with wildlife appearing at milestones
- **Verified Impact** — Every gram reduced is tracked, aggregated, and matched with funded conservation projects

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | Next.js 14+ (App Router, RSC) |
| **Language** | TypeScript (full-stack) |
| **Styling** | Tailwind CSS + Framer Motion |
| **API** | tRPC + Next.js API Routes |
| **Database** | PostgreSQL (Neon serverless) |
| **ORM** | Drizzle ORM |
| **Cache** | Redis (Upstash) |
| **Auth** | NextAuth.js v5 (Auth.js) |
| **Jobs** | Inngest |
| **Storage** | Cloudflare R2 |
| **Hosting** | Vercel |
| **Monitoring** | Sentry + Vercel Analytics |

---

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Git** 2.x or higher
- **Neon** account (database) — [neon.tech](https://neon.tech)
- **Plaid** developer account — [plaid.com](https://plaid.com/docs)
- **Stripe** account — [stripe.com](https://stripe.com)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/footprint-lens/footprint-lens.git
cd footprint-lens
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and fill in your keys:

```bash
cp .env.example .env.local
```

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host/footprint-lens"
DIRECT_DATABASE_URL="postgresql://user:pass@host/footprint-lens"

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Plaid (sandbox for local dev)
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-sandbox-secret"
PLAID_ENV="sandbox"

# Climatiq
CLIMATIQ_API_KEY="your-climatiq-key"
```

See `.env.example` for the complete list.

### 4. Database Setup

Create a Neon database branch and run migrations:

```bash
# Generate migrations from schema
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Seed initial data (emission factors, action library)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
footprint-lens/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components (ui/, carbon/, actions/, etc.)
│   ├── server/           # tRPC routers, services, jobs
│   ├── db/               # Drizzle schema, migrations, seeds
│   ├── lib/              # Utilities, constants, validators
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand client state
│   └── types/            # TypeScript type definitions
├── public/               # Static assets, Lottie animations
├── __tests__/            # Unit & integration tests
├── e2e/                  # Playwright E2E tests
├── docs/                 # Project documentation
└── .github/              # CI/CD workflows
```

See [Project Structure Document](docs/09_project_structure.md) for detailed breakdown.

---

## 🧪 Testing

### Run Unit & Integration Tests

```bash
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

### Run E2E Tests

```bash
npx playwright install  # First time only
npm run test:e2e        # Run Playwright tests
npm run test:e2e:ui     # Interactive UI mode
```

### Lint & Type Check

```bash
npm run lint            # ESLint
npm run type-check      # TypeScript compiler
npm run format          # Prettier
```

---

## 🔧 Development Workflow

### Git Branching

We use a simplified Git Flow:

```
main ← release/v1.x ← develop ← feature/your-feature
```

1. Branch from `develop`
2. Use conventional commits: `feat(scope): description`
3. Open PR against `develop`
4. Squash merge after approval

### Commit Convention

```
feat(carbon): add emission factor lookup for transport
fix(actions): correct tier unlock threshold
docs(api): update response schema
test(engine): add edge cases for zero emissions
chore(deps): update Next.js to 14.3
```

---

## 🚢 Deployment

### Staging

Automatically deployed when pushing to `develop`:

```
https://staging.footprintlens.app
```

### Production

1. Create a release branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b release/v1.0
   ```

2. After QA approval, merge to `main`:
   ```bash
   git checkout main
   git merge release/v1.0
   git tag v1.0.0
   git push origin main --tags
   ```

3. Vercel auto-deploys to production.

### Database Migrations (Production)

```bash
# Preview migration changes
npx drizzle-kit check

# Apply to production (via CI or manual)
DATABASE_URL=$PROD_DATABASE_URL npx drizzle-kit migrate
```

---

## 📖 Documentation

All project documentation is in the [`docs/`](docs/) directory:

| Document | Description |
|:---|:---|
| [Product Design](docs/product_design.md) | Product vision, features, behavioral science |
| [UI/UX Design](docs/uiux.md) | Design system, screens, animations |
| [Technical Requirements](docs/01_technical_requirements.md) | Functional & non-functional requirements |
| [System Architecture](docs/02_system_architecture.md) | Architecture, components, tech stack |
| [Database Design](docs/03_database_design.md) | Schema, ER diagram, indexes |
| [API Specification](docs/04_api_specification.md) | REST endpoints, auth, OpenAPI |
| [Development Roadmap](docs/05_development_roadmap.md) | Phases, sprints, priorities |
| [DevOps & Deployment](docs/06_devops_deployment.md) | CI/CD, hosting, monitoring |
| [Security Design](docs/07_security_design.md) | Threat model, OWASP, data protection |
| [Testing Strategy](docs/08_testing_strategy.md) | Test plan, cases, coverage |
| [Project Structure](docs/09_project_structure.md) | Folders, naming, coding standards |
| [AI Dev Context](docs/10_ai_development_context.md) | Context document for AI assistants |

---

## 🔑 Key APIs & Integrations

| Integration | Purpose | Docs |
|:---|:---|:---|
| Plaid | Bank transaction ingestion | [plaid.com/docs](https://plaid.com/docs) |
| Climatiq | Emission factor database | [climatiq.io/docs](https://www.climatiq.io/docs) |
| electricityMap | Grid carbon intensity | [electricitymap.org](https://www.electricitymap.org) |
| Open Food Facts | Product lifecycle data | [openfoodfacts.org](https://world.openfoodfacts.org) |
| Google Vision | Receipt OCR | [cloud.google.com/vision](https://cloud.google.com/vision) |
| Stripe | Subscription billing | [stripe.com/docs](https://stripe.com/docs) |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read the [Project Structure Document](docs/09_project_structure.md) for coding standards and conventions.

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Team

Built with 🌿 by the Footprint Lens team.

---

*"What if the most powerful climate action on Earth started with your morning coffee?"*
