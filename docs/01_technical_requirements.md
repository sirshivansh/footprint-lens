# Technical Requirements Document (TRD)

**Project:** Footprint Lens
**Version:** 1.0
**Date:** June 2026
**Status:** Draft

---

## 1. Document Purpose

This document defines the complete set of technical requirements for the Footprint Lens platform — a personal carbon intelligence application that transforms financial, utility, and lifestyle data into actionable environmental impact insights with coaching, social features, and verified impact reporting.

---

## 2. Functional Requirements

### 2.1 User Management

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-001 | The system shall support anonymous session creation without requiring account registration | P0 |
| FR-002 | The system shall prompt for email/password registration only when saving data or joining a cohort | P0 |
| FR-003 | The system shall support OAuth 2.0 authentication via Google, Apple, and email/password | P0 |
| FR-004 | The system shall allow users to delete their account and all associated data (GDPR/CCPA compliance) | P0 |
| FR-005 | The system shall support a "Pause" mode allowing users to freeze activity for up to 30 days without data loss | P1 |
| FR-006 | The system shall maintain user preferences for dark/light mode, notification frequency, and privacy settings | P1 |

### 2.2 Data Ingestion — Tier 1: Automatic

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-010 | The system shall integrate with Open Banking APIs (Plaid, TrueLayer, Yodlee) to ingest transaction data | P0 |
| FR-011 | The system shall auto-categorize transactions into carbon buckets (groceries, fuel, flights, dining, fashion, etc.) using merchant-level data | P0 |
| FR-012 | The system shall integrate with UtilityAPI / Green Button Connect for electricity, gas, and water usage data | P1 |
| FR-013 | The system shall cross-reference utility data with grid carbon intensity (electricityMap API) for location-aware emissions | P1 |
| FR-014 | The system shall sync with smart home devices (Nest, Ecobee, smart plugs) for real-time appliance-level energy consumption | P2 |
| FR-015 | The system shall pull bank transaction data at minimum every 24 hours via background sync | P0 |

### 2.3 Data Ingestion — Tier 2: Low-Friction

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-020 | The system shall provide OCR receipt scanning via camera (Google Vision / AWS Textract) with item-level carbon tagging | P0 |
| FR-021 | The system shall map scanned receipt items to per-SKU emission factors using Open Food Facts + Climatiq API | P0 |
| FR-022 | The system shall support background location + motion API for automatic commute mode detection (car/bus/bike/walk) | P1 |
| FR-023 | The system shall detect flights via calendar event parsing or email receipt scanning (Gmail/Outlook API) | P2 |
| FR-024 | Receipt scanning shall complete within 3 seconds and return item-level carbon data | P0 |

### 2.4 Data Ingestion — Tier 3: Onboarding

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-030 | The system shall provide a "5-Tap Profile" onboarding (home type, transport, diet, flights/year, shopping habit) completable in ≤90 seconds | P0 |
| FR-031 | The 5-Tap Profile shall use a visual card-swipe UI (not a questionnaire form) | P0 |
| FR-032 | Profile estimates shall be progressively refined and overwritten by Tier 1 & Tier 2 data within 2 weeks | P0 |

### 2.5 Carbon Calculation Engine

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-040 | The system shall map every transaction: `Merchant → Category → Emission Factor × Amount = kg CO₂e` | P0 |
| FR-041 | The system shall source emission factors from DEFRA, EPA eGRID, Climatiq API, and Open Food Facts | P0 |
| FR-042 | The system shall support user feedback to correct miscategorizations (e.g., "This Uber charge was Uber Eats, not a ride") | P1 |
| FR-043 | ML models shall refine category mapping over time using the correction feedback loop | P2 |
| FR-044 | The system shall display an accuracy score (55%–95%) based on connected data sources | P0 |

### 2.6 Action Engine (Personal Climate Coach)

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-050 | The system shall present ONE action at a time, selected based on the user's top 3 carbon hotspots | P0 |
| FR-051 | Actions shall be ranked by `Reduction Potential × Feasibility` | P0 |
| FR-052 | Action delivery shall be context-aware (time of day, day of week, recent purchases) | P1 |
| FR-053 | The system shall support three tiers of action difficulty: Light Switches, Habit Builders, Lifestyle Levers | P0 |
| FR-054 | Tier 2 actions shall be locked until 5 Tier 1 actions are completed | P0 |
| FR-055 | Tier 3 actions shall be locked until Tier 2 is unlocked | P0 |
| FR-056 | If an action is dismissed 3 times, the system shall retire it and try a different hotspot | P1 |
| FR-057 | Each action shall include a carbon reduction estimate in kg CO₂e | P0 |

### 2.7 Radical Transparency (The Lens)

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-060 | The system shall provide a "Lens View" toggle converting carbon numbers to physical equivalences (balloons, ice, trees, showers, miles) | P0 |
| FR-061 | The system shall provide AR "Living Room Fill" — rendering translucent CO₂ balloons in camera view via ARKit/ARCore | P1 |
| FR-062 | The system shall display a persistent mini glacier widget on the Home screen, proportional to remaining annual carbon budget | P0 |
| FR-063 | The system shall support "Receipt Lens" — color-coded auras (green/amber/red) on scanned receipt items with tap-to-compare | P1 |
| FR-064 | The system shall provide a "Time Machine" swipeable timeline showing past, current, and projected footprint | P0 |

### 2.8 Social & Gamification (Carbon Cohorts)

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-070 | The system shall support Carbon Cohorts of 4–12 members | P0 |
| FR-071 | Cohorts can be formed via invite link, auto-suggested by zip code, workplace teams, or interest-based groups | P0 |
| FR-072 | The system shall support Community Quests (Conservation Anchor, Offset Race, Swap Sprint) | P1 |
| FR-073 | The system shall provide anonymized "Ripple" notifications when cohort members complete actions | P0 |
| FR-074 | The system shall show percentile rank (e.g., "top 20%") but NEVER a named leaderboard | P0 |
| FR-075 | All cohort data shall be anonymized — no member names, no individual contribution percentages | P0 |
| FR-076 | The system shall support "Pause" mode without losing streaks or rank | P1 |

### 2.9 Impact & Feedback Loop

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-080 | The system shall maintain a "Living Forest" — a procedurally generated digital forest representing cumulative CO₂ reductions | P0 |
| FR-081 | Each tree = 100 kg CO₂ reduced; tree species vary by reduction type | P0 |
| FR-082 | Wildlife shall appear at milestones (fox at 1 ton, deer at 5 tons, eagle at 10 tons) | P1 |
| FR-083 | The forest shall be shareable as a screenshot | P1 |
| FR-084 | The system shall aggregate and display collective platform-wide impact with verified project links | P0 |
| FR-085 | Users shall be able to view Gold Standard / Pachama / Climeworks verification certificates | P0 |
| FR-086 | Users shall be able to vote quarterly on which project categories receive funding | P2 |

### 2.10 Subscription & Monetization

| ID | Requirement | Priority |
|:---|:---|:---|
| FR-090 | The system shall support a freemium model with a free tier and premium tier ($4.99/month) | P0 |
| FR-091 | Premium features: advanced analytics, AR features, Tier 3 action coaching | P0 |
| FR-092 | 10% of subscription revenue shall be allocated to the Footprint Lens Impact Fund | P0 |
| FR-093 | The system shall support in-app subscriptions via Apple App Store and Google Play billing | P0 |

---

## 3. Non-Functional Requirements

### 3.1 Usability

| ID | Requirement | Target |
|:---|:---|:---|
| NFR-001 | Onboarding completion rate | ≥ 70% of users complete 5-Tap Profile |
| NFR-002 | Time to first insight | ≤ 120 seconds from app open to seeing first carbon score |
| NFR-003 | WCAG compliance | WCAG 2.1 AA minimum, AAA for text contrast |
| NFR-004 | Reduced motion support | Respect `prefers-reduced-motion` system setting |
| NFR-005 | Supported languages | English (v1.0); i18n architecture for future localization |

### 3.2 Reliability

| ID | Requirement | Target |
|:---|:---|:---|
| NFR-010 | System availability | 99.9% uptime (8.76 hours/year max downtime) |
| NFR-011 | Data durability | 99.999% (no user data loss) |
| NFR-012 | Graceful degradation | App functional with offline cached data; sync when connected |
| NFR-013 | Error recovery | Automatic retry with exponential backoff for failed API calls |

### 3.3 Compatibility

| ID | Requirement | Target |
|:---|:---|:---|
| NFR-020 | Mobile browsers | Safari 15+, Chrome 100+ on mobile |
| NFR-021 | Desktop browsers | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| NFR-022 | iOS native (future) | iOS 16+ (ARKit 6 for AR features) |
| NFR-023 | Android native (future) | Android 12+ (ARCore 1.36 for AR features) |
| NFR-024 | Responsive breakpoints | 320px (mobile), 641px (tablet), 1025px (desktop) |

---

## 4. Performance Requirements

| ID | Requirement | Target |
|:---|:---|:---|
| PR-001 | Initial page load (First Contentful Paint) | ≤ 1.5 seconds on 4G connection |
| PR-002 | Time to Interactive (TTI) | ≤ 3.0 seconds on 4G connection |
| PR-003 | Largest Contentful Paint (LCP) | ≤ 2.5 seconds |
| PR-004 | Cumulative Layout Shift (CLS) | ≤ 0.1 |
| PR-005 | First Input Delay (FID) | ≤ 100ms |
| PR-006 | Receipt OCR processing time | ≤ 3 seconds end-to-end |
| PR-007 | API response time (p95) | ≤ 200ms for reads, ≤ 500ms for writes |
| PR-008 | API response time (p99) | ≤ 500ms for reads, ≤ 1000ms for writes |
| PR-009 | Carbon calculation latency | ≤ 100ms per transaction |
| PR-010 | Animation frame rate | 60fps for all UI animations, 30fps minimum for AR |
| PR-011 | Lighthouse score | ≥ 90 for Performance, Accessibility, Best Practices, SEO |
| PR-012 | App bundle size (initial) | ≤ 250KB gzipped (JavaScript) |
| PR-013 | Image/asset budget per screen | ≤ 500KB total |

---

## 5. Scalability Requirements

| ID | Requirement | Target |
|:---|:---|:---|
| SR-001 | Concurrent users | Support 100,000 concurrent users at launch, scalable to 1M |
| SR-002 | Transactions processed | Handle 10M carbon calculations per day |
| SR-003 | Database growth | Support 50M user profiles with 5-year transaction history |
| SR-004 | Horizontal scaling | All stateless services must support horizontal auto-scaling |
| SR-005 | Peak load handling | Handle 5x average traffic during viral/press events |
| SR-006 | Background job throughput | Process 1M bank sync jobs within a 6-hour overnight window |
| SR-007 | CDN caching | Static assets served from edge locations within 50ms globally |
| SR-008 | Database read replicas | Support read replicas for analytics queries without impacting OLTP |

---

## 6. Security Requirements

| ID | Requirement | Priority |
|:---|:---|:---|
| SEC-001 | All data in transit shall be encrypted using TLS 1.3 | P0 |
| SEC-002 | All PII and financial data at rest shall be encrypted using AES-256 | P0 |
| SEC-003 | Authentication shall use JWT tokens with short-lived access tokens (15 min) and long-lived refresh tokens (30 days) | P0 |
| SEC-004 | Password storage shall use bcrypt with a minimum cost factor of 12 | P0 |
| SEC-005 | The system shall implement rate limiting on all public endpoints | P0 |
| SEC-006 | The system shall log all authentication events for audit | P0 |
| SEC-007 | Financial data (bank connections) shall be handled exclusively via Plaid/TrueLayer — raw credentials never stored | P0 |
| SEC-008 | The system shall comply with GDPR, CCPA, and applicable data protection regulations | P0 |
| SEC-009 | API keys and secrets shall be stored in environment variables or a secrets manager (never in code) | P0 |
| SEC-010 | All user inputs shall be validated and sanitized to prevent injection attacks | P0 |
| SEC-011 | Content Security Policy (CSP) headers shall be enforced on all responses | P1 |
| SEC-012 | CORS shall be restricted to known origins only | P0 |
| SEC-013 | The system shall support SOC 2 Type II compliance readiness | P2 |
| SEC-014 | Penetration testing shall be conducted before each major release | P1 |

---

## 7. Data Requirements

| ID | Requirement | Details |
|:---|:---|:---|
| DR-001 | Data retention — active users | All data retained while account is active |
| DR-002 | Data retention — deleted accounts | Data purged within 30 days of deletion request |
| DR-003 | Data portability | Users can export all their data in JSON/CSV format |
| DR-004 | Backup frequency | Full database backup every 24 hours; incremental every 6 hours |
| DR-005 | Backup retention | 30-day backup retention with 90-day archive |
| DR-006 | Emission factor updates | Emission factor databases shall be updated at least quarterly |
| DR-007 | Data anonymization | All cohort/aggregate data shall be anonymized before display |

---

## 8. Integration Requirements

| ID | Integration | Protocol | Purpose |
|:---|:---|:---|:---|
| IR-001 | Plaid / TrueLayer / Yodlee | REST API | Bank transaction ingestion |
| IR-002 | UtilityAPI / Green Button Connect | REST API | Utility data ingestion |
| IR-003 | Google Vision / AWS Textract | REST API | Receipt OCR |
| IR-004 | Climatiq API | REST API | Emission factors |
| IR-005 | Open Food Facts | REST API | Product lifecycle data |
| IR-006 | electricityMap API | REST API | Grid carbon intensity |
| IR-007 | Nest / Ecobee APIs | REST/OAuth | Smart home data |
| IR-008 | Gmail / Outlook API | REST/OAuth | Flight receipt detection |
| IR-009 | Google Calendar API | REST/OAuth | Calendar event parsing |
| IR-010 | Apple/Google IAP | Native | Subscription billing |
| IR-011 | ARKit / ARCore / 8th Wall | Native/WebAR | AR visualization |
| IR-012 | Gold Standard / Pachama / Climeworks | REST API / Webhook | Impact verification |
| IR-013 | Firebase Cloud Messaging / APNs | Push | Notifications |

---

## 9. Constraint Summary

| Constraint | Details |
|:---|:---|
| Budget | Startup-stage; prioritize managed services to minimize DevOps overhead |
| Timeline | MVP within 16 weeks (see Development Roadmap) |
| Team | 2-4 full-stack engineers, 1 ML engineer, 1 designer |
| Compliance | GDPR, CCPA from day one |
| Third-party dependency | Core carbon calculations depend on Climatiq API availability |
| Platform | Web-first (PWA); native iOS/Android in Phase 2 |

---

*Document maintained by the Engineering Team. Last updated: June 2026.*
