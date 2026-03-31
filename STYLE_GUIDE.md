# Autom8Lab — Website Style Guide

This is the **single source of truth** for all visual design decisions on the Autom8Lab website. Every page, component, and future addition must follow these rules. No exceptions.

> **Important:** `services_menu.html` and `complexity_guide.html` were imported from an external source and contain their own legacy color schemes (category colors, complexity badges, etc.). Those colors are NOT part of the Autom8Lab design system. Do not pull colors, patterns, or styles from those files into new pages. All new work must be based exclusively on the design tokens and patterns defined in this document.

---

## Design Philosophy

Dark-mode, premium consulting aesthetic. Inspired by Linear, Raycast, Vercel — tools built for high-agency operators.

The feeling is **quiet confidence**. Nothing screams. The dark background creates negative space that lets content breathe. Strategic pops of color (gold, teal, purple) guide attention without overwhelming.

The design says: *"This is for serious business owners who don't need to be sold — they need to be shown."*

**Core principles:**
1. **Dark mode as canvas** — black isn't background, it's negative space
2. **Color has meaning** — gold = action/premium, teal = links/trust, purple = tertiary accent
3. **Generous spacing** — nothing feels cramped, every element has room to breathe
4. **Subtle depth** — cards float above background through slight color shifts, not shadows
5. **Gradient restraint** — the hero gradient is bold, but it's the ONLY bold gradient
6. **Consistent corners** — same large border-radius everywhere, no sharp corners
7. **No fluff** — matches the brand voice: direct, confident, no filler

---

## Color System

### Core Tokens (defined in `css/styles.css`)

```css
:root {
  /* Backgrounds */
  --bg-page: #0a0a0b;          /* Page background — not pure black, hint of warmth */
  --bg-card: #141414;          /* Cards, elevated surfaces */

  /* Borders */
  --border-subtle: #262626;    /* Card borders, dividers */

  /* Text */
  --text-primary: #ffffff;     /* Headings, key text */
  --text-secondary: #9ca3af;   /* Body text, descriptions */
  --text-muted: #6b7280;       /* Captions, footer, helper text */

  /* Brand Accents */
  --accent-gold: #c9a66b;      /* Primary brand color — CTAs, the "8" in logo, eyebrows */
  --accent-gold-hover: #d4b07a; /* Gold hover state */
  --accent-teal: #2dd4bf;      /* Links, trust indicators */
  --accent-purple: #a78bfa;    /* Tertiary accent */
}
```

**Rules:**
- Always reference these tokens or their hex values. Do NOT introduce new grays, new blues, or any other colors without explicit approval.
- `#1f1f1f` is used for footer/nav borders (slightly lighter than `--border-subtle`).
- `#1a1a1a` is used for hover states on cards (between `--bg-card` and `--border-subtle`).
- Never use pure `#000000`. Always `#0a0a0b`.

### The Gold Gradient (Hero Text)

The signature look. Warm gold fading into soft lavender. Used ONLY on hero headlines.

```css
.hero-gradient {
  background: linear-gradient(135deg, #f5e6d3 0%, #e8c4a0 30%, #d4a574 60%, #c4b5d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Do NOT** apply this gradient to body text, buttons, cards, or anything other than large hero headings. Its power comes from scarcity.

---

## Typography

### Font

**Inter** — loaded from Google Fonts, weights 400 through 900.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

Override Tailwind's default sans-serif:
```js
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

**Do NOT** use any other font. No Poppins, no Montserrat, no exceptions.

### Type Scale

| Element             | Size (mobile → desktop)             | Weight        | Color              | Tracking         |
|---------------------|--------------------------------------|---------------|--------------------|------------------|
| Hero headline       | `text-4xl` → `text-7xl`             | Black (900)   | `.hero-gradient`   | `tracking-tight` |
| Section headline    | `text-3xl` → `text-5xl`             | Bold (700)    | White              | `tracking-tight` |
| Card heading        | `text-lg` → `text-xl`               | Semi-bold (600)| White             | Normal           |
| Eyebrow/label       | `text-xs`                            | Medium (500)  | Gold `#c9a66b`     | `tracking-widest`, uppercase |
| Body text           | `text-base` → `text-lg`             | Regular (400) | Secondary `#9ca3af`| Normal           |
| Muted/caption       | `text-sm` → `text-base`             | Regular (400) | Muted `#6b7280`    | Normal           |
| Strong body line    | `text-lg` → `text-xl`               | Medium (500)  | White              | Normal           |

**Rules:**
- Hierarchy comes from weight and color, not dramatic size jumps.
- `font-black` (900) is reserved for hero headlines ONLY.
- Body text is always `#9ca3af`, never white (white body text looks like a heading).
- Muted text (`#6b7280`) for secondary info: captions, footers, helper text.

---

## Layout & Spacing

### Container Widths

| Context              | Max Width    | Tailwind Class  |
|----------------------|-------------|-----------------|
| Hero / main content  | `max-w-3xl` | 768px           |
| General content      | `max-w-5xl` | 1024px          |

### Horizontal Padding

```html
px-6 md:px-8
```

Always. Every section, every page. Consistent edge breathing room.

### Vertical Rhythm

- Sections: `py-20` to `py-32` (generous, creates "chapters")
- Between elements within a section: `mb-4` to `mb-12` depending on visual weight
- Dividers: `w-16 h-px bg-[#262626] mx-auto` — short, centered, subtle

### Centering

Most content is centered: `mx-auto text-center`. The site feels focused, not sprawling.

---

## Components

### CTA Buttons (Primary)

```html
<a class="inline-block bg-[#c9a66b] text-black font-semibold text-lg px-10 py-5 rounded-xl hover:bg-[#d4b07a] transition-colors cta-glow">
  Book Your Free AI Audit &rarr;
</a>
```

| Property       | Value                              |
|----------------|-------------------------------------|
| Background     | Gold `#c9a66b`                     |
| Text           | Black (high contrast on gold)       |
| Font weight    | Semi-bold (600)                     |
| Padding        | Generous: `px-10 py-5` (large) or `px-5 py-2.5` (nav) |
| Border-radius  | `rounded-xl` (12px)                |
| Hover          | `#d4b07a` (lighter gold)           |
| Glow           | `.cta-glow` — subtle pulsing box-shadow |
| Arrow          | `&rarr;` at end of label            |

**Smaller CTA (nav bars):**
```html
<a class="inline-block bg-[#c9a66b] text-black text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#d4b07a] transition-colors">
  Book a Call
</a>
```

### Cards

| Property       | Value                   |
|----------------|-------------------------|
| Background     | `#141414`               |
| Border         | `1px solid #262626`     |
| Border-radius  | `rounded-2xl` (16px)    |
| Padding        | `px-8 py-6` or similar  |
| Shadow         | None (depth from color) |
| Hover BG       | `#1a1a1a`               |

### Dividers / Borders

| Context         | Color     | Style                     |
|-----------------|-----------|---------------------------|
| Section divider | `#262626` | `w-16 h-px mx-auto`       |
| Footer/nav border | `#1f1f1f` | `border-t border-[#1f1f1f]` |
| Card borders    | `#262626` | `border border-[#262626]`  |

### Nav Bar Pattern

```html
<nav class="border-b border-[#1f1f1f] py-4">
  <div class="max-w-5xl mx-auto px-6 md:px-8 flex justify-between items-center">
    <!-- Logo (inline SVG, unlinked on partner pages) -->
    <!-- CTA or back link on right side -->
  </div>
</nav>
```

### Footer Pattern

```html
<footer class="border-t border-[#1f1f1f] py-8">
  <div class="max-w-5xl mx-auto px-6 md:px-8">
    <!-- Logo SVG + copyright/status text -->
  </div>
</footer>
```

---

## Animations

### Fade-in on Scroll

Add `.fade-in` to any element. `js/main.js` uses `IntersectionObserver` to add `.visible` when it scrolls into view. Each element only animates once.

```css
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Headline Rotation

Uses `display:none/block` swap (NOT opacity crossfade — that causes gradient text ghosting).

```css
.headline-item { display: none; }
.headline-item.active {
  display: block;
  animation: headline-enter 0.7s ease-out both;
}
```

JS swaps `.active` class every 4 seconds with a reflow trick to restart the animation.

### CTA Pulse

```css
.cta-glow {
  animation: cta-pulse 3s ease-in-out infinite;
}
```

Gentle gold box-shadow pulse. Used on primary CTA buttons only.

### Background Glow

```css
.bg-glow {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201, 166, 107, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 80% 80%, rgba(167, 139, 250, 0.05) 0%, transparent 70%);
}
```

Subtle gold glow from top-center, faint purple glow from bottom-right. Very low opacity — if you can clearly see it, it's too strong.

### Animation Philosophy

- **Calm, not flashy.** Slow ease-outs, no bouncing, no aggressive movement.
- **Animate once.** Elements fade in on scroll and stay. No re-triggering.
- **Subtle always wins.** If an animation is noticeable, dial it back.

---

## Logo Usage

### The Autom8Lab Icon

Two overlapping circles (outline, gold stroke) with a solid gold center dot. The "8" in the brand name.

```html
<!-- Icon only (hero, nav) -->
<svg width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="14" r="10" fill="none" stroke="#c9a66b" stroke-width="2.5"/>
  <circle cx="24" cy="34" r="10" fill="none" stroke="#c9a66b" stroke-width="2.5"/>
  <circle cx="24" cy="24" r="3.5" fill="#c9a66b"/>
</svg>
```

### The Full Logo (Footer)

Wordmark: **AUTOM8LAB** — the "8" is gold `#c9a66b`, rest is white. Tagline: "YOUR AI PARTNER" in muted gray with wide letter-spacing.

### Critical Rule: Inline All SVGs

**NEVER use `<img src="...svg">` references.** Always inline the SVG directly into the HTML. External SVG references break on cPanel due to MIME type issues. The files in `assets/logos/` are source references only — no page loads them.

---

## Responsive Behavior

### Breakpoints (Tailwind defaults)

| Prefix | Min-width |
|--------|-----------|
| `sm`   | 640px     |
| `md`   | 768px     |
| `lg`   | 1024px    |

### Key Responsive Patterns

- Hero headline scales: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`
- Body text scales: `text-base md:text-lg` or `text-lg md:text-xl`
- Layout stacks: `flex-col md:flex-row`
- Padding stays consistent: `px-6 md:px-8`

---

## Tailwind Usage

Tailwind is loaded via CDN. There is no build step.

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Use Tailwind utility classes for all layout and most styling. Use `css/styles.css` ONLY for:
- CSS custom properties (design tokens)
- Animations / keyframes
- Complex selectors that can't be expressed as utilities
- The gradient text technique (requires `background-clip`)

**Do NOT** create new CSS files per page. If a page needs unique styles, use an inline `<style>` block in that page's `<head>`.

---

## Brand Voice (for copy guidance)

- Direct and confident, never salesy or hype-driven
- "No fluff. No theory. Just systems that work."
- Speaks to business owners, not developers
- Uses "we/you" framing — personal, not corporate
- The "8" in Autom8Lab is always gold in visual contexts

---

## What NOT to Do

- Do not use pure black `#000000` — always `#0a0a0b`
- Do not use bright white backgrounds — this is a dark-mode-only site
- Do not add shadows to cards — depth comes from background color shifts
- Do not use fonts other than Inter
- Do not use the hero gradient on anything other than hero headings
- Do not use external SVG `<img>` tags — always inline
- Do not add aggressive animations (bouncing, spinning, flashing)
- Do not use Tailwind's default gray palette — always use the exact hex values above
- Do not introduce new accent colors without explicit approval
