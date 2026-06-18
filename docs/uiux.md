# The Definitive UI/UX Scheme for Footprint Lens

Based on the product's emotional core—**Clarity → Curiosity → Agency → Pride**—and its technical depth, here is the complete design system.

---

## 1. Design Philosophy: "Calm Tech, Deep Data"

The interface must hold two opposing truths simultaneously:
- **Surface layer**: Effortless, warm, and human. Feels like a wellness app, not a utility dashboard.
- **Depth layer**: When the user chooses to dive in, the data is rich, precise, and intellectually satisfying.

**The governing metaphor**: *A lens.* The UI is the glass — clean, transparent, invisible. The insights are what you see *through* it.

---

## 2. Design System: Atomic Foundations

### 2.1 Color Palette — "Earth Spectrum"

```
┌─────────────────────────────────────────────────────────┐
│  NAME              HEX        TAILWIND   USAGE          │
├─────────────────────────────────────────────────────────┤
│  Soil (Primary)    #3A2E28    900        Headlines,      │
│                     dark brown            primary text   │
│                                                         │
│  Moss (Accent)     #5B8C5A    green-700  CTAs, success,  │
│                     muted green           positive deltas│
│                                                         │
│  Clay (Secondary)  #C67B5C    orange-500 Reduction       │
│                     warm terracotta      actions, warmth │
│                                                         │
│  Sky (Info)        #7BA7BC    blue-400   Links, data viz │
│                     dusty blue            trust signals  │
│                                                         │
│  Sand (Background) #FAF7F2    warm-50    App background  │
│                     warm off-white                       │
│                                                         │
│  Bark (Surface)    #F3EFE8    warm-100   Cards, sheets   │
│                                                         │
│  Ember (Warning)   #D95D39    red-500    High-impact     │
│                     burnt orange          alerts (sparing)│
│                                                         │
│  Ash (Muted)       #8B8680    gray-500   Secondary text  │
│                                                         │
│  Midnight (Depth)  #1A1817    gray-950   Dark mode bg    │
└─────────────────────────────────────────────────────────┘
```

**Critical rule**: Never use pure green (`#00FF00`) or pure red (`#FF0000`). These trigger "traffic light" anxiety. Use Moss and Ember sparingly. The palette should evoke a **national park visitor center** — educational, warm, slightly rustic, deeply credible.

### 2.2 Typography — "Reader & Reporter"

| Role | Font | Weight | Rationale |
|:---|:---|:---|:---|
| **Headlines** | **Fraunces** (variable serif) | 600–700 | Evokes editorial trust (think: The New Yorker). Warm, human, authoritative. |
| **Body** | **Inter** (sans-serif) | 400–500 | Crystal-clear legibility at small sizes. Neutral, modern, unopinionated. |
| **Data / Numbers** | **JetBrains Mono** (monospace) | 400–500 | Tabular numbers for carbon stats, percentages, and tables. Conveys precision. |
| **UI Labels** | **Inter** | 500–600 | Slightly bolder for button text, nav items, and microcopy. |

**Type scale** (major third: 1.25 ratio):
```
text-xs:    0.75rem   (12px)  — Legal, footnotes
text-sm:    0.875rem  (14px)  — Body, descriptions
text-base:  1rem      (16px)  — Primary body
text-lg:    1.25rem   (20px)  — Card titles
text-xl:    1.5rem    (24px)  — Section headers
text-2xl:   1.875rem  (30px)  — Screen titles
text-3xl:   2.375rem  (38px)  — Hero numbers (carbon totals)
text-4xl:   3rem      (48px)  — Onboarding headlines
```

### 2.3 Spacing & Layout — "Breathing Room"

Carbon data is dense. The UI must counterbalance with **generous whitespace**.

- **Base unit**: 4px
- **Card padding**: 24px (1.5rem)
- **Screen margins**: 20px (mobile), auto-calculated max-width (desktop)
- **Max content width**: 672px — never wider for reading-focused screens. Data dashboards can use full width.
- **Section gutters**: 48px vertical rhythm between content blocks

### 2.4 Iconography — "Field Guide"

Use **Phosphor Icons** (Duotone style for primary, Regular for secondary). The duotone style has a soft, illustrated quality that matches the "field guide" aesthetic.

| Icon | Usage |
|:---|:---|
| `Tree` | Forest impact, offsets |
| `Drop` | Water, glacier melt |
| `Fire` | Energy, gas |
| `Leaf` | Diet, food swaps |
| `Car` / `Bicycle` | Transport |
| `Receipt` | Receipt scanner |
| `Globe` | Collective impact |
| `UsersThree` | Cohorts |
| `ChartLineUp` | Progress |
| `SealCheck` | Verification |

### 2.5 Elevation & Depth

Use **subtle, organic shadows** — not harsh drop shadows. Think of light filtering through a forest canopy.

```css
/* Card shadow — "Dappled Light" */
.card {
  box-shadow:
    0 1px 2px rgba(58, 46, 40, 0.04),
    0 4px 12px rgba(58, 46, 40, 0.04),
    0 8px 24px rgba(58, 46, 40, 0.03);
}

/* Elevated card — "Lifted" */
.card-elevated {
  box-shadow:
    0 2px 4px rgba(58, 46, 40, 0.06),
    0 8px 20px rgba(58, 46, 40, 0.06),
    0 16px 40px rgba(58, 46, 40, 0.04);
}
```

**Border radius**: 16px for cards, 12px for buttons, 8px for inputs. Generous rounding reinforces the soft, non-threatening feel.

---

## 3. Screen-by-Screen UX Architecture

### 3.1 Information Architecture

```
App
├── 🏠 Home (Today View)
│   ├── Carbon Pulse (daily snapshot)
│   ├── Action of the Day
│   └── Lens Widget (mini glacier)
│
├── 🔍 Lens (Radical Transparency)
│   ├── AR Viewer
│   ├── Equivalence Explorer
│   └── Time Machine
│
├── 🧭 Actions (Action Engine)
│   ├── Current Action
│   ├── Action History
│   └── Tier Progression
│
├── 👥 Cohort (Social)
│   ├── My Cohort
│   ├── Community Quest
│   └── Ripple Feed
│
├── 🌍 Impact (Feedback Loop)
│   ├── My Forest
│   ├── Collective Impact
│   └── Project Verification
│
└── 👤 Profile
    ├── Data Sources
    ├── Accuracy Score
    ├── Settings
    └── Privacy Center
```

### 3.2 Home Screen — "Carbon Pulse"

This is the screen users see 80% of the time. It must communicate everything in 3 seconds.

```
┌──────────────────────────────────────────────┐
│  ☰                          Footprint Lens  │  8px top padding
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │                                      │    │
│  │   🧊  YOUR OCTOBER FOOTPRINT         │    │  12px label
│  │                                      │    │
│  │       0.82                           │    │  38px, Fraunces 700
│  │     tons CO₂                         │    │  16px, Inter 500
│  │                                      │    │
│  │   ↓ 28% from last October            │    │  Moss green badge
│  │                                      │    │
│  │   ━━━━━━━━━━━━━━━━━━━━  ━━━━━━       │    │  Visual bar
│  │   Last year: 1.14     This year      │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🟡  TODAY'S ACTION          ~3 min  │    │  Action Card
│  │                                      │    │
│  │  Swap to oat milk                    │    │  20px, Fraunces 600
│  │  Your usual almond milk ships from   │    │
│  │  1,400 miles away. Local oat milk    │    │  14px, Inter 400
│  │  is same price, 68% less carbon.     │    │
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │     I DID THIS ✓             │    │    │  Moss CTA, 16px
│  │  └──────────────────────────────┘    │    │
│  │  ─────────────────────────────────   │    │
│  │  Not today  ·  Show me another       │    │  Text links, Ash
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🏔️  YOUR GLACIER                   │    │  Lens Widget
│  │                                      │    │
│  │   [  Mini 3D glacier rendering   ]   │    │  120px height
│  │   [  with subtle melt animation  ]   │    │  CSS/SVG or Lottie
│  │                                      │    │
│  │   Tap to explore →                   │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🌊  COHORT RIPPLE                   │    │  Social nudge
│  │  Your cohort is 73% to this week's   │    │
│  │  goal. 2 members made swaps today.   │    │  14px, Inter 400
│  └──────────────────────────────────────┘    │
│                                              │
├──────────────────────────────────────────────┤
│  🏠     🔍     🧭     👥     🌍              │  56px nav bar
│ Home   Lens  Actions Cohort Impact           │  Phosphor Duotone
└──────────────────────────────────────────────┘
```

**Key UX decisions for Home:**
- The carbon number is **large and prominent** but never judgmental. The delta (↓ 28%) is the emotional anchor — always show progress.
- The Action Card uses a **single, focused CTA**. No lists. No overwhelm.
- The Glacier Widget is a **persistent, gentle reminder** — it melts slowly, no urgent red notifications.
- The Cohort Ripple is **informational, not actionable** — it pulls, never pushes.

### 3.3 Lens Screen — "Radical Transparency"

This is the flagship differentiator. It must feel **magical**.

```
┌──────────────────────────────────────────────┐
│  ← Lens                                      │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │                                      │    │
│  │   VIEW MODE                          │    │
│  │   ┌─────┐ ┌──────┐ ┌────────┐        │    │
│  │   │ AR  │ │Room │ │Glacier│ ...     │    │  Pill tabs
│  │   └─────┘ └──────┘ └────────┘        │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │                                      │    │
│  │         [ AR Camera View ]           │    │  Full-width
│  │                                      │    │  16:9 aspect
│  │    Your living room, overlaid with   │    │
│  │    translucent CO₂ balloons.         │    │
│  │                                      │    │
│  │    "This is your monthly footprint   │    │  Overlay text
│  │     — 740 balloons of CO₂."         │    │
│  │                                      │    │
│  │         ┌──────────────┐             │    │
│  │         │ SEE OCTOBER  │             │    │  CTA button
│  │         └──────────────┘             │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  EQUIVALENCE EXPLORER                │    │
│  │                                      │    │
│  │  Your 0.82 tons this month =         │    │
│  │                                      │    │
│  │  🧊  26 sq ft of Arctic ice          │    │  Each row is a
│  │  🌳  4.1 trees working all year      │    │  tappable card
│  │  🚿  246 hours of hot shower         │    │  that expands
│  │  🚗  2,050 miles driven              │    │  for detail
│  │  🍔  63 beef burgers                 │    │
│  │                                      │    │
│  │  + See 12 more equivalences          │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  TIME MACHINE                        │    │
│  │                                      │    │
│  │  Jan ●──────────────────────● Dec    │    │  Timeline scrubber
│  │  14.2t                    8.3t       │    │
│  │                                      │    │
│  │  ← Swipe to see your projected       │    │
│  │    future if you keep going →        │    │
│  └──────────────────────────────────────┘    │
│                                              │
└──────────────────────────────────────────────┘
```

**Key UX decisions for Lens:**
- AR requires **permission priming**. Before requesting camera access, show a beautiful static preview with a "See it in your space" button.
- Equivalences are **browseable, not a firehose**. Show 5–6 top ones, with "See more" for the curious.
- The Time Machine uses a **scrubber interaction** — not a chart. It should feel playful, like exploring, not being graded.

### 3.4 Actions Screen — "Your Coach"

```
┌──────────────────────────────────────────────┐
│  ← Actions                                   │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🟢 LIGHT SWITCHES        5/8 done   │    │  Tier card
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │    │
│  │                                      │    │
│  │  ✓ Lower thermostat 2°F              │    │
│  │  ✓ No-rush Amazon shipping           │    │
│  │  ✓ Meatless Monday (4x)              │    │
│  │  ✓ Shorter shower by 2 min           │    │
│  │  ✓ Unplug unused devices             │    │
│  │  ○ Switch to LED bulbs               │    │  Unchecked
│  │  ○ Use reusable bags                 │    │
│  │  ○ Wash clothes in cold water        │    │
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │   VIEW CURRENT ACTION        │    │    │
│  │  └──────────────────────────────┘    │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🔒 HABIT BUILDERS                   │    │  Locked tier
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │    │
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │  Frosted glass
│  │  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │    │  effect
│  │  │  ░░ Complete 3 more Light ░░ │    │    │
│  │  │  ░░ Switches to unlock    ░░ │    │    │
│  │  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │    │
│  │  └──────────────────────────────┘    │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🔒 LIFESTYLE LEVERS                 │    │  Locked tier
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │    │
│  │  │  ░░ Unlock Habit Builders  ░░ │    │    │
│  │  │  ░░ to see these           ░░ │    │    │
│  │  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │    │
│  │  └──────────────────────────────┘    │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  📊 YOUR IMPACT FROM ACTIONS         │    │
│  │                                      │    │
│  │  This month: 48 kg CO₂ avoided       │    │
│  │  All time:   1,204 kg CO₂ avoided    │    │
│  │                                      │    │
│  │  That's like planting 12 trees 🌳    │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

**Key UX decisions for Actions:**
- The tier structure is **visual, not explained in a tutorial**. Users see the progression instinctively.
- Locked tiers use a **frosted glass blur** (backdrop-filter: blur(8px)) with text overlaid — creates curiosity, not frustration.
- Completed actions show a **satisfying checkmark** with a subtle line-through. It's a to-do list that celebrates completion.
- The "View Current Action" button always points to **the one thing** the user should do now.

### 3.5 Cohort Screen — "Your People"

```
┌──────────────────────────────────────────────┐
│  ← Cohort                                    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🌳  YOUR COHORT: OAK STREET CREW    │    │
│  │      6 members · Formed Oct 2026     │    │
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │  [6 abstract avatars]        │    │    │  Color-coded
│  │  │                              │    │    │  organic shapes
│  │  │  You are the moss-green one  │    │    │  No photos
│  │  └──────────────────────────────┘    │    │    │  No names by
│  │                                      │    │    │  default
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🎯 CURRENT QUEST                    │    │
│  │  "Keep Our Park Breathing"           │    │
│  │                                      │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │    │
│  │  ████████████████████░░░░░░  73%     │    │  Progress bar
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │  [Satellite map of local     │    │    │  Interactive map
│  │  │   park with trees glowing    │    │    │
│  │  │   green as progress fills]   │    │    │
│  │  └──────────────────────────────┘    │    │
│  │                                      │    │
│  │  "3 more reductions needed to        │    │
│  │   fully sustain the park this month" │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🌊  ACTIVITY FEED                   │    │
│  │                                      │    │
│  │  Just now                            │    │
│  │  🟢 Someone swapped to oat milk      │    │  Anonymous
│  │     · 2.1 kg saved                  │    │  entries
│  │                                      │    │
│  │  2 hours ago                         │    │
│  │  🟡 Someone biked to work instead    │    │
│  │     of driving · 4.8 kg saved       │    │
│  │                                      │    │
│  │  Yesterday                           │    │
│  │  🔵 Someone completed their first    │    │
│  │     Habit Builder action! 🎉        │    │
│  │                                      │    │
│  │  Yesterday                           │    │
│  │  🟢 Someone tried a new plant-based  │    │
│  │     recipe · 1.4 kg saved           │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  ⚙️  Cohort Settings                 │    │
│  │  · Invite link                       │    │
│  │  · Change cohort name                │    │
│  │  · Leave cohort                      │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

**Key UX decisions for Cohort:**
- **Avatars are abstract, organic shapes** (like a modern take on Google's default avatars). Colors are assigned randomly. No profile photos. This prevents the "who's the best?" dynamic.
- The feed is **activity-focused, not identity-focused**. "Someone did X" not "Sarah did X." This maintains social proof without social surveillance.
- The progress bar is **collective, not individual**. There is no way to see who contributed what percentage. The unit is the cohort.

### 3.6 Impact Screen — "The Ripple Effect"

```
┌──────────────────────────────────────────────┐
│  ← Impact                                    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🌳  YOUR LIVING FOREST              │    │
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │                              │    │    │  Procedurally
│  │  │   [Procedural forest         │    │    │  generated
│  │  │    visualization]            │    │    │  SVG/Canvas
│  │  │                              │    │    │
│  │  │   🌳🌳🌳🌲🌳🌲🌳             │    │    │
│  │  │   🌲🌳🌳🌲🌳🌲🌳             │    │    │
│  │  │   🌳🌲🌳🌳🌲🌳🌲             │    │    │
│  │  │   🦊                         │    │    │  Wildlife appears
│  │  │                              │    │    │  at milestones
│  │  │   12 trees · 1 fox           │    │    │
│  │  └──────────────────────────────┘    │    │
│  │                                      │    │
│  │  Cumulative CO₂ avoided: 1,204 kg    │    │
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │  SHARE MY FOREST  📤         │    │    │  Shareable
│  │  └──────────────────────────────┘    │    │  screenshot
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  🌍  COLLECTIVE IMPACT — NOV 2026   │    │
│  │                                      │    │
│  │  All Footprint Lens users:           │    │
│  │                                      │    │
│  │  ┌──────┐  ┌──────┐  ┌──────┐        │    │
│  │  │ 847  │  │ 12   │  │ 2.4  │        │    │  Stat cards
│  │  │ tons │  │acres │  │ tons │        │    │
│  │  │ CO₂  │  │forest│  │captured│      │    │
│  │  │reduced│ │saved │  │      │        │    │
│  │  └──────┘  └──────┘  └──────┘        │    │
│  │                                      │    │
│  │  Your personal contribution:         │    │
│  │  ≈ 6.2 sq ft of rainforest canopy    │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  📜  VERIFICATION                    │    │
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │  [Satellite image of         │    │    │
│  │  │   protected forest area]     │    │    │
│  │  │                              │    │    │
│  │  │  Pachama Project #FL-2026    │    │    │
│  │  │  Verified: Nov 15, 2026      │    │    │
│  │  │                              │    │    │
│  │  │  ┌──────────────────────┐    │    │    │
│  │  │  │ VIEW CERTIFICATE →  │    │    │    │
│  │  │  └──────────────────────┘    │    │    │
│  │  └──────────────────────────────┘    │    │
│  │                                      │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │  [Gold Standard certificate  │    │    │
│  │  │   with blockchain timestamp] │    │    │
│  │  └──────────────────────────────┘    │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

**Key UX decisions for Impact:**
- The Living Forest is **shareable but not competitive**. It's a personal story, not a score.
- Collective impact stats are **large, clean, and optimistic**. No asterisks, no caveats. The emotional takeaway is: "We're doing this. Together."
- Verification is **prominently linked**, not buried in settings. Trust is built through radical transparency.

---

## 4. Micro-Interactions & Animation

### 4.1 Animation Principles

| Principle | Implementation |
|:---|:---|
| **Duration** | 200–300ms for UI transitions. 400–600ms for celebratory moments. |
| **Easing** | `cubic-bezier(0.16, 1, 0.3, 1)` — the "ease-out-expo" for natural deceleration. |
| **Stagger** | List items animate in with 50ms delays between each. Feels organic. |
| **Reduced motion** | Respect `prefers-reduced-motion`. Replace animations with instant opacity transitions. |

### 4.2 Signature Micro-Interactions

**1. Action Completion — "The Ripple"**
When a user taps "I DID THIS":
- The button shrinks to 95% scale (100ms)
- Bounces back to 100% with a spring (300ms)
- A circular ripple (like a water drop) emanates from the button
- The ripple color is Moss green
- The action card slides up and out, replaced by a "Nice work!" confirmation with the kg saved
- The confirmation fades after 2 seconds

**2. Glacier Melt — "Slow Burn"**
The mini glacier on the Home screen:
- Updates once per day (not real-time — too anxiety-inducing)
- Melts by a calculated number of pixels based on the day's emissions
- Uses a subtle particle effect: tiny water droplets falling from the glacier face
- When a reduction action is completed, a tiny snowflake falls onto the glacier, adding back a pixel

**3. Forest Growth — "Sapling to Tree"**
When a new tree appears in the Living Forest:
- A small sapling animates from the ground (scale 0 → 1, 600ms, spring)
- A few green particles float upward
- If it's a milestone tree (every 10th), a wildlife creature appears with a gentle fade-in

**4. Number Transitions — "The Count"**
Carbon numbers don't snap-change. They animate:
- Use `requestAnimationFrame` to tween between values
- Duration: 800ms for large numbers, 400ms for small
- Easing: ease-out-expo for a satisfying deceleration

---

## 5. Onboarding Flow — "First Light"

The onboarding must convert skeptics in under 90 seconds.

```
┌──────────────────────────────────────────────┐
│                                              │
│   Screen 1: Welcome                          │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │                                      │   │
│   │      🌍                              │   │  Large emoji/illustration
│   │                                      │   │
│   │   See your impact.                   │   │  48px, Fraunces 700
│   │   Shrink it.                         │   │
│   │   Prove it.                          │   │
│   │                                      │   │
│   │   A personal climate companion       │   │  16px, Inter 400
│   │   that works with your life,         │   │
│   │   not against it.                    │   │
│   │                                      │   │
│   │   ┌──────────────────────────────┐   │   │
│   │   │       GET STARTED →          │   │   │  Moss button
│   │   └──────────────────────────────┘   │   │
│   └──────────────────────────────────────┘   │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│   Screen 2: 5-Tap Profile                    │
│                                              │
│   "Help us understand your starting point"   │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │                                      │   │
│   │   🏠  What's your home?              │   │  Card stack UI
│   │                                      │   │  (Tinder-like)
│   │   ┌──────┐ ┌──────┐ ┌──────┐        │   │
│   │   │  🏢  │ │  🏠  │ │  🏘️  │        │   │  Visual cards
│   │   │ Apt  │ │House │ │Shared│        │   │  with illustrations
│   │   └──────┘ └──────┘ └──────┘        │   │
│   │                                      │   │
│   │   Swipe or tap to select             │   │
│   └──────────────────────────────────────┘   │
│                                              │
│   [Repeated for: Transport, Diet, Flights,    │
│    Shopping — 5 total cards, ~15 seconds      │
│    each]                                      │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│   Screen 3: Accuracy Meter                   │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │                                      │   │
│   │   Your starting accuracy: 55%        │   │  Circular gauge
│   │                                      │   │
│   │   ┌────────────────────────────┐     │   │
│   │   │        ┌──┐                │     │   │
│   │   │      ┌─┘  └─┐              │     │   │
│   │   │     ┌┘  55% └┐             │     │   │
│   │   │     │         │             │     │   │
│   │   │     └┐       ┌┘             │     │   │
│   │   │      └─┐   ┌─┘              │     │   │
│   │   │        └──┘                │     │   │
│   │   └────────────────────────────┘     │   │
│   │                                      │   │
│   │   "You're already halfway there.     │   │
│   │    Connect your bank to jump to 78%  │   │
│   │    accuracy in 2 minutes."           │   │
│   │                                      │   │
│   │   ┌──────────────────────────────┐   │   │
│   │   │   CONNECT BANK ACCOUNT →     │   │   │  Primary CTA
│   │   └──────────────────────────────┘   │   │
│   │   ──────────────────────────────     │   │
│   │   Skip for now · I'll do it later    │   │  Text link
│   └──────────────────────────────────────┘   │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│   Screen 4: The Lens Preview                 │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │                                      │   │
│   │   "This is your Lens."               │   │
│   │                                      │   │
│   │   [Static preview image of AR        │   │
│   │    balloons in a generic room]       │   │
│   │                                      │   │
│   │   "See your carbon footprint as      │   │
│   │    balloons in your own space.       │   │
│   │    Tangible. Real. Yours."           │   │
│   │                                      │   │
│   │   ┌──────────────────────────────┐   │   │
│   │   │   ALLOW CAMERA ACCESS →      │   │   │
│   │   └──────────────────────────────┘   │   │
│   │   ──────────────────────────────     │   │
│   │   Maybe later                        │   │
│   └──────────────────────────────────────┘   │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│   Screen 5: Home (First Visit)               │
│                                              │
│   "Your first action is ready."              │
│                                              │
│   [Standard Home screen with one difference: │
│    a subtle pulsing ring around the Action   │
│    Card, drawing the eye to the first task]  │
│                                              │
└──────────────────────────────────────────────┘
```

**Onboarding rules:**
- **No account creation required.** Start with anonymous session. Prompt for email only when the user tries to save data or join a cohort.
- **Every screen has a skip.** No forced flows.
- **The accuracy meter uses the Endowed Progress Effect** — showing 55% as "halfway there" rather than "you're missing 45%."

---

## 6. Responsive Behavior

| Breakpoint | Layout Strategy |
|:---|:---|
| **Mobile (320–640px)** | Single column, full-width cards, bottom nav bar. The primary interface. |
| **Tablet (641–1024px)** | Two-column where useful (Home: pulse + action side by side). Bottom nav becomes sidebar. |
| **Desktop (1025px+)** | Max-width container (1200px). Three-column for data-heavy screens (Impact). Persistent sidebar nav. AR mode prompts user to pick up phone. |

---

## 7. Accessibility Requirements

- **WCAG 2.1 AA minimum**, targeting AAA for text contrast.
- All carbon data has **text equivalents** — no information conveyed solely through color or animation.
- AR features have **non-AR fallbacks** — all equivalences viewable as static cards.
- **Focus indicators** are visible and use the Clay (terracotta) color for warmth.
- **Screen reader labels** are descriptive: "Your October footprint: 0.82 tons. Down 28 percent from last year."
- The Glacier widget has a **text description**: "A small glacier representing your carbon budget. It has melted slightly today."

---

## 8. Dark Mode — "Midnight Lens"

```
Light Mode: Sand (#FAF7F2) background
Dark Mode:  Midnight (#1A1817) background

Light cards → Bark (#F3EFE8)
Dark cards  → #252220 (slightly lighter than bg)

All accent colors shift:
- Moss: #5B8C5A → #7CB87B (brighter for contrast on dark)
- Clay: #C67B5C → #D48B6E
- Sky: #7BA7BC → #9DC4D4
- Soil text: #3A2E28 → #E8E0D5 (warm off-white)

The glacier widget gains a subtle blue glow in dark mode.
The Living Forest uses darker foliage tones.
```

---

## 9. Technical Implementation Notes

| Concern | Recommendation |
|:---|:---|
| **Framework** | Next.js (App Router) + React Server Components for performance |
| **Styling** | Tailwind CSS with custom theme extending to match the design system |
| **Animation** | Framer Motion for React components; Lottie for complex illustrations |
| **AR** | Model Viewer (web) for static 3D; AR.js or 8th Wall for WebAR |
| **Charts** | Custom SVG/CSS where possible; D3.js for complex data viz; avoid Chart.js (too generic) |
| **Fonts** | Fraunces (Google Fonts, variable), Inter (Google Fonts), JetBrains Mono (Google Fonts) |
| **Icons** | @phosphor-icons/react for React integration |
| **State** | Zustand for client state; React Query for server state |
| **Accessibility** | Radix UI primitives for accessible interactive components |

---

## 10. Summary: The Emotional Journey

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ONBOARDING         HOME              LENS           │
│  ─────────         ────              ────            │
│  "This is easy"    "I'm doing it"    "I can see it"  │
│       ↓                ↓                  ↓          │
│  Curiosity          Agency            Tangibility     │
│                                                      │
│                                                      │
│  ACTIONS            COHORT            IMPACT         │
│  ───────            ──────            ──────         │
│  "I'm growing"      "We're together"  "It matters"   │
│       ↓                ↓                  ↓          │
│  Mastery            Belonging          Meaning       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Every screen, every animation, every color choice serves this emotional arc. The user moves from **curiosity** (what's my footprint?) → **agency** (I can do something) → **tangibility** (I can see it) → **mastery** (I'm getting better) → **belonging** (we're doing this together) → **meaning** (our actions change the real world).

This is the complete UI/UX scheme for Footprint Lens. It is designed to be the best in class by being warm where competitors are cold, tangible where they are abstract, and collaborative where they are competitive.