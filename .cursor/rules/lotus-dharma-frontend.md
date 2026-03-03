---
name: lotus-dharma-frontend
description: Lotus-Dharma Frontend Constitution — Zen minimal, contemplative, production-grade UI for Next.js App Router (server-first, strict TypeScript, token-driven).
globs:
  - "app/**/*.{ts,tsx,mdx}"
  - "src/**/*.{ts,tsx,mdx}"
  - "components/**/*.{ts,tsx,mdx}"
  - "packages/**/*.{ts,tsx}"
alwaysApply: true
---

# LOTUS-DHARMA FRONTEND CONSTITUTION
## Aesthetic: Thiền · Tối Giản · Trầm Tĩnh

This is not a startup UI.
This is not a SaaS dashboard.
This is not a trendy gradient website.

Lotus-Dharma must feel:

- Calm
- Spacious
- Grounded
- Intentional
- Contemplative
- Crafted
- Timeless

No noise. No hype. No decorative excess.

---

# I. CORE DESIGN PHILOSOPHY

## 1. Purpose Before Pixels
Every interface must answer:

- Does this reduce cognitive load?
- Does this feel calm?
- Does this respect silence and space?
- Is every element necessary?

If something can be removed, remove it.

## 2. One Emotional Direction Only

Tone is fixed:

> Zen Minimalism with Editorial Depth

No playful.
No maximalist.
No neon.
No flashy motion.

Calm over clever.

## 3. The Memorable Differentiator

Lotus-Dharma is remembered for:

- Spacious vertical rhythm
- Refined typography hierarchy
- Subtle depth through texture and light
- Long-form readability

Not for animations.
Not for gradients.
Not for gimmicks.

---

# II. TYPOGRAPHY SYSTEM (Sacred Hierarchy)

## Rules

- Never use: Inter, Roboto, Arial, default system fonts.
- Use `next/font`.
- Pair:
  - A contemplative serif (for headings)
  - A quiet humanist serif or refined sans (for body)

## Hierarchy Scale (Required)

Define explicit scale tokens:

- `--text-display`
- `--text-h1`
- `--text-h2`
- `--text-body`
- `--text-small`
- `--text-caption`

Vertical rhythm must follow consistent spacing multiples.

Long-form reading must be:
- 65–75ch max width
- Comfortable line-height
- Generous paragraph spacing

Typography is the primary design element.

---

# III. COLOR & THEME SYSTEM (Earth, Air, Silence)

## Palette Philosophy

- One dominant base (warm off-white or deep charcoal)
- One muted accent (earth, moss, clay, ink)
- One subtle highlight (used sparingly)

No high-saturation palettes.
No purple gradients.
No neon accents.

## Token Discipline (Mandatory)

Define semantic tokens only:

- `--bg-primary`
- `--bg-subtle`
- `--text-primary`
- `--text-muted`
- `--border-soft`
- `--accent`
- `--accent-soft`

Never use raw hex values in components.

All colors must route through tokens.

---

# IV. SPACING & COMPOSITION SYSTEM (Breathing Space)

## Rhythm

Choose one base scale:
- 4px system OR 8px system

Apply consistently.

## Layout Principles

- Generous vertical spacing
- Clear reading columns
- Avoid dense grids
- No card explosion

Prefer:

- Vertical flow
- Section separation via space (not borders)
- Asymmetry through whitespace

Whitespace is a design element.

---

# V. MOTION SYSTEM (Slow & Intentional)

Motion is rare.

## Rules

- No bouncing.
- No elastic.
- No flashy entrance animations.

Allowed:

- Soft fade
- Gentle upward reveal
- Subtle opacity transitions

Duration tokens:

- `--motion-fast`
- `--motion-base`
- `--motion-slow`

Respect `prefers-reduced-motion`.

One calm page-load stagger is acceptable.
Nothing more.

Silence > Animation.

---

# VI. BACKGROUND & DEPTH (Subtle Atmosphere)

Avoid flat sterile backgrounds.

Allowed subtle depth:

- Very light noise texture
- Gentle gradient shift (barely visible)
- Soft shadow layering

No heavy blur.
No glassmorphism.
No aggressive glow.

Depth must feel natural, not digital.

---

# VII. ACCESSIBILITY IS NON-NEGOTIABLE

- Proper semantic HTML
- Keyboard navigable
- Visible focus states
- Contrast validated
- No layout shift
- Images sized
- Accessible forms

Calm design must still be inclusive.

---

# VIII. NEXT.JS ARCHITECTURE (Server-First Always)

## 1. Component Philosophy

Default:
- Server Components

Use `"use client"` only when:
- Interaction requires state
- DOM APIs
- Motion libraries

## 2. Data

- Fetch on server.
- Avoid client waterfalls.
- Use route handlers or server actions when appropriate.

## 3. TypeScript

- Strict mode only.
- No `any`.
- Shared types in `/packages`.

## 4. File Structure Discipline

- Separate:
  - UI components
  - Layout components
  - Feature modules
- No giant components.

---

# IX. PERFORMANCE BUDGET

- No heavy runtime animation libraries unless justified.
- Avoid large background images.
- Prefer CSS over JS for visual effects.
- Avoid excessive blur (expensive on mobile).
- Keep CLS at zero.
- Avoid hydration mismatch.

Calm means fast.

---

# X. ANTI-PATTERNS (STRICTLY FORBIDDEN)

- Startup hero + CTA layout clone
- Card grid overload
- Purple gradient on white
- Random shadows and radii
- Decorative icons everywhere
- Over-abstraction of components
- Premature design system complexity

If it feels trendy, remove it.

If it feels noisy, remove it.

If it feels clever, simplify it.

---

# XI. FINAL SELF-CHECK BEFORE OUTPUT

Before generating UI:

- Is it calm?
- Is it spacious?
- Is typography carrying the design?
- Is color restrained?
- Is motion subtle?
- Is everything tokenized?
- Is it server-first?
- Is it fast?

If any answer is no → refine before delivering.

---

# XII. DEFAULT ASSUMPTION (If requirements are vague)

When unclear:

- Favor long-form layout
- Favor reading experience
- Favor vertical flow
- Favor silence
- Remove visual noise
- Reduce component density

Lotus-Dharma is not loud.

It breathes.

---

END OF CONSTITUTION