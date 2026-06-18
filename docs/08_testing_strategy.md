# Testing Strategy Document

**Project:** Footprint Lens
**Version:** 1.0
**Date:** June 2026
**Status:** Draft

---

## 1. Testing Philosophy

> **Test what matters, test it well, test it fast.**

### 1.1 Testing Pyramid

```
                    ╱╲
                   ╱  ╲
                  ╱ E2E╲          ~10% — Critical user journeys
                 ╱──────╲
                ╱        ╲
               ╱Integration╲      ~20% — API, database, service interactions
              ╱──────────────╲
             ╱                ╲
            ╱    Unit Tests    ╲   ~70% — Pure logic, utilities, components
           ╱────────────────────╲
```

### 1.2 Test Tools

| Tool | Purpose | Layer |
|:---|:---|:---|
| **Vitest** | Unit tests, integration tests | Unit + Integration |
| **React Testing Library** | Component testing | Unit |
| **Playwright** | End-to-end browser tests | E2E |
| **MSW (Mock Service Worker)** | API mocking for frontend tests | Unit + Integration |
| **Drizzle Test Utils** | Database test fixtures and cleanup | Integration |
| **Faker.js** | Test data generation | All |
| **GitHub Actions** | CI test execution | Infrastructure |

---

## 2. Unit Testing

### 2.1 What to Unit Test

| Component | Test Focus | Coverage Target |
|:---|:---|:---|
| Carbon Calculation Engine | Emission factor lookups, CO₂e calculations, category mapping | ≥ 95% |
| Equivalence Engine | CO₂ → physical metaphor conversions | ≥ 95% |
| Action Ranking Algorithm | Scoring, feasibility filtering, context modifiers, dismissal logic | ≥ 90% |
| Zod Schemas | Input validation for all API endpoints | ≥ 95% |
| Utility Functions | Date formatting, number formatting, currency conversion | ≥ 90% |
| React Components | Rendering, props, state changes, event handlers | ≥ 80% |

### 2.2 Unit Test Examples

#### Carbon Calculation Engine

```typescript
// __tests__/services/carbon-engine.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCO2e, mapMerchantToCategory } from '@/services/carbon-engine';

describe('Carbon Calculation Engine', () => {
  describe('calculateCO2e', () => {
    it('calculates fuel purchase emissions correctly', () => {
      const result = calculateCO2e({
        category: 'transport',
        subcategory: 'fuel',
        amount: 45.00,
        currency: 'USD',
        region: 'US',
      });
      expect(result.co2e_kg).toBeCloseTo(38.2, 1);
      expect(result.emission_factor_source).toBe('EPA');
    });

    it('calculates grocery item emissions from receipt', () => {
      const result = calculateCO2e({
        category: 'diet',
        subcategory: 'beef_mince',
        quantity: 0.5,
        unit: 'kg',
        region: 'US',
      });
      expect(result.co2e_kg).toBeCloseTo(13.0, 1);
      expect(result.impact_level).toBe('high');
    });

    it('returns zero for unrecognized categories', () => {
      const result = calculateCO2e({
        category: 'unknown',
        subcategory: 'unknown',
        amount: 100,
        currency: 'USD',
        region: 'US',
      });
      expect(result.co2e_kg).toBe(0);
      expect(result.confidence).toBe('low');
    });

    it('handles different currencies correctly', () => {
      const usd = calculateCO2e({ category: 'dining', amount: 50, currency: 'USD', region: 'US' });
      const gbp = calculateCO2e({ category: 'dining', amount: 40, currency: 'GBP', region: 'GB' });
      expect(usd.co2e_kg).toBeGreaterThan(0);
      expect(gbp.co2e_kg).toBeGreaterThan(0);
    });
  });

  describe('mapMerchantToCategory', () => {
    it('maps Shell Gas Station to transport/fuel', () => {
      const result = mapMerchantToCategory('Shell Gas Station');
      expect(result).toEqual({ category: 'transport', subcategory: 'fuel', confidence: 95 });
    });

    it('maps McDonald\'s to dining/fast_food', () => {
      const result = mapMerchantToCategory("McDonald's");
      expect(result).toEqual({ category: 'diet', subcategory: 'fast_food', confidence: 90 });
    });

    it('returns generic category for unknown merchants', () => {
      const result = mapMerchantToCategory('Random Store ABC');
      expect(result.confidence).toBeLessThan(50);
    });
  });
});
```

#### Equivalence Engine

```typescript
// __tests__/services/equivalence-engine.test.ts
describe('Equivalence Engine', () => {
  it('converts 1 ton CO₂ to correct balloon count', () => {
    const result = getEquivalences(1000); // 1 ton = 1000 kg
    expect(result.balloons).toBe(564700); // ~564.7 balloons per kg
  });

  it('converts CO₂ to Arctic ice square feet', () => {
    const result = getEquivalences(1000);
    expect(result.arctic_ice_sqft).toBeCloseTo(32, 0);
  });

  it('converts CO₂ to trees working for a year', () => {
    const result = getEquivalences(100);
    expect(result.trees_working_year).toBeCloseTo(5, 0);
  });

  it('handles zero CO₂ gracefully', () => {
    const result = getEquivalences(0);
    expect(result.balloons).toBe(0);
    expect(result.arctic_ice_sqft).toBe(0);
  });
});
```

#### Action Ranking Algorithm

```typescript
// __tests__/services/action-engine.test.ts
describe('Action Engine', () => {
  describe('rankActions', () => {
    it('ranks high-reduction, high-feasibility actions first', () => {
      const actions = rankActions(mockProfile, mockHotspots, mockActionLibrary);
      expect(actions[0].estimated_co2e_reduction_kg).toBeGreaterThan(actions[1].estimated_co2e_reduction_kg);
    });

    it('filters out actions not matching user profile', () => {
      const veganProfile = { ...mockProfile, diet_type: 'vegan' };
      const actions = rankActions(veganProfile, mockHotspots, mockActionLibrary);
      const dietActions = actions.filter(a => a.category === 'diet');
      expect(dietActions.every(a => !a.title.includes('beef'))).toBe(true);
    });

    it('retires action after 3 dismissals', () => {
      const history = [{ action_id: 'a1', dismissal_count: 3 }];
      const actions = rankActions(mockProfile, mockHotspots, mockActionLibrary, history);
      expect(actions.find(a => a.id === 'a1')).toBeUndefined();
    });

    it('applies context modifiers for weekend mornings', () => {
      const context = { dayOfWeek: 'Saturday', timeOfDay: 'morning' };
      const actions = rankActions(mockProfile, mockHotspots, mockActionLibrary, [], context);
      expect(actions[0].context).toBe('meal_prep');
    });
  });
});
```

### 2.3 Component Testing

```typescript
// __tests__/components/CarbonPulse.test.tsx
import { render, screen } from '@testing-library/react';
import { CarbonPulse } from '@/components/CarbonPulse';

describe('CarbonPulse', () => {
  it('displays the carbon total prominently', () => {
    render(<CarbonPulse totalCO2eKg={820} previousCO2eKg={1140} />);
    expect(screen.getByText('0.82')).toBeInTheDocument();
    expect(screen.getByText('tons CO₂')).toBeInTheDocument();
  });

  it('shows positive delta with moss green color', () => {
    render(<CarbonPulse totalCO2eKg={820} previousCO2eKg={1140} />);
    const delta = screen.getByText(/28%/);
    expect(delta).toHaveClass('text-moss');
    expect(delta.textContent).toContain('↓');
  });

  it('shows negative delta with ember color when footprint increased', () => {
    render(<CarbonPulse totalCO2eKg={1200} previousCO2eKg={1000} />);
    const delta = screen.getByText(/20%/);
    expect(delta).toHaveClass('text-ember');
    expect(delta.textContent).toContain('↑');
  });

  it('is accessible with descriptive screen reader text', () => {
    render(<CarbonPulse totalCO2eKg={820} previousCO2eKg={1140} />);
    expect(screen.getByLabelText(/your october footprint/i)).toBeInTheDocument();
  });
});
```

---

## 3. Integration Testing

### 3.1 What to Integration Test

| Integration | Test Focus |
|:---|:---|
| tRPC API endpoints | Request/response validation, auth checks, error handling |
| Database operations | CRUD operations, RLS enforcement, migration integrity |
| Plaid integration | Webhook handling, token exchange (sandbox) |
| Receipt OCR pipeline | Image upload → OCR → item parsing → carbon tagging |
| Action Engine + DB | Recommendation with real DB state, tier progression |
| Cohort system | Join/leave, quest progress, anonymized feed generation |

### 3.2 Integration Test Examples

#### API Endpoint Tests

```typescript
// __tests__/api/carbon-summary.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestUser, createTestTransactions, cleanupTestUser } from '@/test/helpers';

describe('GET /v1/carbon/summary', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    testUser = await createTestUser();
    authToken = await getTestToken(testUser.id);
    await createTestTransactions(testUser.id, [
      { merchant: 'Shell', amount: 45, category: 'transport', co2e_kg: 38.2 },
      { merchant: 'Whole Foods', amount: 120, category: 'diet', co2e_kg: 15.5 },
    ]);
  });

  afterAll(async () => {
    await cleanupTestUser(testUser.id);
  });

  it('returns monthly summary with correct totals', async () => {
    const response = await fetch('/api/v1/carbon/summary?period=month', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.status).toBe(200);
    const { data } = await response.json();
    expect(data.total_co2e_kg).toBeCloseTo(53.7, 1);
    expect(data.breakdown).toHaveLength(2);
  });

  it('returns 401 without auth token', async () => {
    const response = await fetch('/api/v1/carbon/summary?period=month');
    expect(response.status).toBe(401);
  });

  it('prevents access to another user\'s data', async () => {
    const otherUser = await createTestUser();
    const otherToken = await getTestToken(otherUser.id);
    const response = await fetch('/api/v1/carbon/summary?period=month', {
      headers: { Authorization: `Bearer ${otherToken}` },
    });
    const { data } = await response.json();
    expect(data.total_co2e_kg).toBe(0); // Other user has no transactions
    await cleanupTestUser(otherUser.id);
  });
});
```

#### Database Integration Tests

```typescript
// __tests__/db/carbon-records.test.ts
describe('Carbon Records', () => {
  it('enforces RLS - user can only query own records', async () => {
    const user1 = await createTestUser();
    const user2 = await createTestUser();
    await insertCarbonRecord(user1.id, { co2e_kg: 10, category: 'transport' });

    const records = await getCarbonRecords(user2.id);
    expect(records).toHaveLength(0);
  });

  it('cascades delete when user is deleted', async () => {
    const user = await createTestUser();
    await insertCarbonRecord(user.id, { co2e_kg: 10, category: 'transport' });
    await deleteUser(user.id);

    const records = await getAllCarbonRecords(); // Admin query
    expect(records.find(r => r.user_id === user.id)).toBeUndefined();
  });
});
```

---

## 4. End-to-End Testing

### 4.1 E2E Test Strategy

- Use **Playwright** for cross-browser testing (Chromium, Firefox, WebKit)
- Test **critical user journeys** that span multiple screens
- Run against **staging environment** with seeded test data
- **Visual regression** via screenshot comparison for key screens

### 4.2 Critical User Journeys

| Journey | Priority | Steps |
|:---|:---|:---|
| Onboarding → Dashboard | P0 | Open app → 5-Tap → See accuracy meter → View dashboard |
| Bank Connection | P0 | Settings → Connect bank → Plaid Link → See transactions |
| Receipt Scan | P0 | Camera → Scan → View items → See carbon tags |
| Action Completion | P0 | View action → Tap "I Did This" → See confirmation → Check tier |
| Cohort Join | P1 | Enter invite code → Join → See cohort → View quest progress |
| Subscription | P1 | Upgrade → Stripe checkout → Verify premium access |
| Dark Mode Toggle | P2 | Settings → Toggle dark mode → Verify all screens |

### 4.3 E2E Test Examples

```typescript
// e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('complete onboarding and reach dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Screen 1: Welcome
    await expect(page.getByText('See your impact.')).toBeVisible();
    await page.getByRole('button', { name: /get started/i }).click();

    // Screen 2: 5-Tap Profile
    // Home type
    await expect(page.getByText("What's your home?")).toBeVisible();
    await page.getByRole('button', { name: /apartment/i }).click();

    // Transport
    await expect(page.getByText(/primary transport/i)).toBeVisible();
    await page.getByRole('button', { name: /transit/i }).click();

    // Diet
    await page.getByRole('button', { name: /flexitarian/i }).click();

    // Flights
    await page.getByRole('button', { name: /1-3/i }).click();

    // Shopping
    await page.getByRole('button', { name: /average/i }).click();

    // Screen 3: Accuracy meter
    await expect(page.getByText('55%')).toBeVisible();
    await expect(page.getByText(/halfway there/i)).toBeVisible();
    await page.getByText(/skip for now/i).click();

    // Screen 4: Lens preview
    await page.getByText(/maybe later/i).click();

    // Screen 5: Dashboard
    await expect(page.getByText(/your .* footprint/i)).toBeVisible();
    await expect(page.getByText(/today's action/i)).toBeVisible();
  });

  test('accuracy meter updates after bank connection', async ({ page }) => {
    // Setup: logged in user with 55% accuracy
    await loginAsTestUser(page, 'onboarding-complete');
    
    await page.goto('/profile/data-sources');
    await page.getByRole('button', { name: /connect bank/i }).click();
    
    // Plaid Link sandbox flow
    await completePlaidSandbox(page);

    // Verify accuracy updated
    await page.goto('/');
    await expect(page.getByText('78%')).toBeVisible();
  });
});
```

```typescript
// e2e/action-engine.spec.ts
test.describe('Action Engine', () => {
  test('complete action and see tier progress', async ({ page }) => {
    await loginAsTestUser(page, 'with-actions');
    await page.goto('/actions');

    // View current action
    await page.getByRole('button', { name: /view current action/i }).click();
    await expect(page.getByText(/swap to oat milk/i)).toBeVisible();

    // Complete action
    await page.getByRole('button', { name: /i did this/i }).click();

    // Verify confirmation
    await expect(page.getByText(/nice work/i)).toBeVisible();
    await expect(page.getByText(/2.1 kg/i)).toBeVisible();

    // Verify tier progress updated
    await page.goto('/actions');
    await expect(page.getByText(/6\/8 done/i)).toBeVisible();
  });

  test('locked tiers show frosted glass overlay', async ({ page }) => {
    await loginAsTestUser(page, 'tier-1-incomplete');
    await page.goto('/actions');

    const lockedTier = page.getByText(/habit builders/i).locator('..');
    await expect(lockedTier.getByText(/complete .* more/i)).toBeVisible();

    // Screenshot for visual regression
    await expect(lockedTier).toHaveScreenshot('locked-tier.png');
  });
});
```

```typescript
// e2e/receipt-scan.spec.ts
test.describe('Receipt Scanner', () => {
  test('scan receipt and view carbon tags', async ({ page }) => {
    await loginAsTestUser(page, 'premium-user');
    
    // Upload test receipt image (simulate camera)
    await page.goto('/receipts/scan');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/fixtures/test-receipt.jpg');

    // Wait for OCR processing
    await expect(page.getByText(/processing/i)).toBeVisible();
    await expect(page.getByText(/beef mince/i)).toBeVisible({ timeout: 10000 });

    // Verify color coding
    const beefItem = page.getByText(/beef mince/i).locator('..');
    await expect(beefItem).toHaveClass(/impact-high/);

    // Verify swap suggestion
    await beefItem.click();
    await expect(page.getByText(/lentils/i)).toBeVisible();
    await expect(page.getByText(/93% reduction/i)).toBeVisible();
  });
});
```

---

## 5. Test Cases & Acceptance Criteria

### 5.1 Onboarding

| TC-ID | Test Case | Acceptance Criteria |
|:---|:---|:---|
| TC-001 | Complete 5-Tap onboarding | User profile created with all 5 selections; accuracy at 55% |
| TC-002 | Skip bank connection | User proceeds to dashboard with estimated data |
| TC-003 | Skip camera permission | App works without AR; static equivalences shown |
| TC-004 | Each onboarding screen has skip | Every screen has a visible skip/later option |
| TC-005 | Anonymous session persists | User data retained until browser clears or account upgrade |

### 5.2 Carbon Dashboard

| TC-ID | Test Case | Acceptance Criteria |
|:---|:---|:---|
| TC-010 | Monthly summary displays correctly | Total CO₂e, delta %, category breakdown visible |
| TC-011 | Positive delta shown in green | Reduction shown with ↓ arrow, Moss color |
| TC-012 | Negative delta shown in warm color | Increase shown with ↑ arrow, Ember color |
| TC-013 | Category breakdown adds to total | Sum of categories equals total within ±0.1 kg |
| TC-014 | Time Machine shows trajectory | Past, current, and projected values on timeline |
| TC-015 | Glacier widget visible on home | Mini glacier rendered, proportional to carbon budget |

### 5.3 Action Engine

| TC-ID | Test Case | Acceptance Criteria |
|:---|:---|:---|
| TC-020 | Action shown matches user profile | Action is relevant to user's top carbon hotspot |
| TC-021 | Completing action logs CO₂e saved | CO₂e saved recorded; total updated; forest progress updated |
| TC-022 | Dismissing action 3x retires it | Action no longer shown after 3 dismissals |
| TC-023 | Tier 2 unlocks after 5 Tier 1 completions | Frosted glass removed; Tier 2 actions visible |
| TC-024 | Tier 3 locked while Tier 2 locked | Nested lock dependency respected |
| TC-025 | Only one action shown at a time | No action list; single focused recommendation |

### 5.4 Receipt Scanner

| TC-ID | Test Case | Acceptance Criteria |
|:---|:---|:---|
| TC-030 | Receipt processed in ≤ 3 seconds | Timer from upload to results ≤ 3000ms |
| TC-031 | Items color-coded correctly | Green (low), amber (moderate), red (high) |
| TC-032 | High-impact items have swap suggestions | Red items show alternative with % reduction |
| TC-033 | OCR failure shows fallback | Error message with manual entry option |
| TC-034 | Receipt history persisted | Previous scans visible in receipt list |

### 5.5 Cohorts & Social

| TC-ID | Test Case | Acceptance Criteria |
|:---|:---|:---|
| TC-040 | Create cohort generates invite code | Unique code displayed; shareable |
| TC-041 | Join cohort via valid code | User added to cohort; max members respected |
| TC-042 | Activity feed is anonymous | No names, no photos; "Someone did X" format |
| TC-043 | Quest progress is collective | Single progress bar; no individual breakdowns |
| TC-044 | Ripple notification delivered | Cohort members notified on action completion (anonymized) |
| TC-045 | Leave cohort cleans up properly | User removed; can join another; no data leaked |

### 5.6 Impact & Forest

| TC-ID | Test Case | Acceptance Criteria |
|:---|:---|:---|
| TC-050 | Forest grows with reductions | New tree for every 100 kg CO₂ reduced |
| TC-051 | Tree species match reduction category | Transport = birch, diet = oak, energy = pine |
| TC-052 | Wildlife appears at milestones | Fox at 1 ton, deer at 5 tons, eagle at 10 tons |
| TC-053 | Forest is shareable | Share button generates screenshot |
| TC-054 | Collective impact shows real numbers | Platform-wide totals with verification links |

### 5.7 Subscription

| TC-ID | Test Case | Acceptance Criteria |
|:---|:---|:---|
| TC-060 | Free user sees premium gates | Premium features show upgrade prompt |
| TC-061 | Stripe checkout completes | Payment processed; plan updated to premium |
| TC-062 | Premium features unlock | AR, Tier 3, advanced analytics accessible |
| TC-063 | Cancellation takes effect at period end | User retains access until current period ends |

---

## 6. Test Environments & Data

### 6.1 Test Data Strategy

| Environment | Data Source | Refresh |
|:---|:---|:---|
| Unit tests | In-memory mocks (Faker.js) | Every run |
| Integration tests | Test database (Neon branch) | Before each test suite |
| E2E tests | Seeded staging database | Before each test run |
| Manual testing | Plaid sandbox + generated data | Persistent staging data |

### 6.2 Test Fixtures

```
__tests__/
├── fixtures/
│   ├── users.ts              # Test user profiles
│   ├── transactions.ts       # Sample bank transactions
│   ├── carbon-records.ts     # Pre-calculated carbon data
│   ├── actions.ts            # Action library subset
│   ├── receipts/
│   │   ├── grocery-receipt.jpg
│   │   └── gas-receipt.jpg
│   └── emission-factors.ts   # Test emission factor data
├── helpers/
│   ├── db.ts                 # Database setup/teardown
│   ├── auth.ts               # Test auth helpers
│   └── plaid.ts              # Plaid sandbox helpers
```

---

## 7. Coverage Targets

| Layer | Coverage Target | Enforcement |
|:---|:---|:---|
| Unit Tests (logic) | ≥ 90% line coverage | CI gate (fail build below 85%) |
| Unit Tests (components) | ≥ 80% line coverage | CI gate (fail build below 75%) |
| Integration Tests | All API endpoints covered | PR review checklist |
| E2E Tests | All P0 journeys covered | Release gate |
| Overall | ≥ 85% line coverage | CI reporting |

---

## 8. Performance Testing

| Test Type | Tool | Target |
|:---|:---|:---|
| Load testing | k6 or Artillery | 1,000 concurrent users; P95 < 200ms |
| Stress testing | k6 | Identify breaking point |
| Lighthouse CI | lighthouse-ci | Score ≥ 90 on all categories |
| Bundle size | bundlewatch | JS bundle ≤ 250KB gzipped |

---

*Document maintained by the QA & Engineering Teams. Last updated: June 2026.*
