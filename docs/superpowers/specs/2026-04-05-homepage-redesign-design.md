# Autom8Lab Homepage Redesign — Design Spec

**Date:** 2026-04-05
**Scope:** Homepage rebuild + Express/EJS project scaffold
**Status:** Approved

---

## 1. Goal

Rebuild the Autom8Lab homepage from a static HTML page into a Node.js app with premium animations and interactive elements. Shift positioning from "AI agency" to "Cosmo as trusted AI consultant" — approachable expert tone. Deploy via Vercel.

The existing static site files remain untouched. The new app lives alongside them until all pages are rebuilt, at which point the old files are removed.

---

## 2. Tech Stack

| Layer | Tool | Rationale |
|-------|------|-----------|
| Server | Express.js | Simple routing, Vercel-compatible via serverless functions |
| Templates | EJS | HTML-like syntax, partials for nav/footer, easy transition from static files |
| CSS | Tailwind CSS via PostCSS | Proper build pipeline, purging, custom config (not CDN) |
| Animations | GSAP + ScrollTrigger plugin | Industry standard for scroll-linked and entrance animations |
| Interactive BG | Canvas API | Dot grid with cursor proximity glow effect |
| Fonts | Satoshi (display) + Cabinet Grotesk (body) | Distinctive free fonts from Fontshare, replace Inter |
| Deployment | Vercel | Native Node.js and serverless function support |

---

## 3. Design System

### 3.1 Colors

```css
:root {
  --bg-page:        #0b0f1a;
  --bg-card:        rgba(255, 255, 255, 0.03);
  --bg-card-border: rgba(255, 255, 255, 0.06);
  --border-subtle:  #1e293b;
  --text-primary:   #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted:     #64748b;
  --accent:         #3b82f6;
  --accent-hover:   #60a5fa;
  --accent-warm:    #f59e0b;
}
```

Cards use glassmorphism: `background: var(--bg-card)` + `backdrop-filter: blur(12px)` + `border: 1px solid var(--bg-card-border)`.

### 3.2 Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headlines | Satoshi | 700-900 | Display font, hero ~5rem |
| Subheadlines | Satoshi | 500 | |
| Body | Cabinet Grotesk | 400 | |
| Labels/tags | Cabinet Grotesk | 500 | Uppercase, letter-spacing: 0.05em |

Fonts self-hosted in `public/fonts/` for performance and reliability.

### 3.3 Spacing

Generous padding between sections: 120-160px vertical. Each section has one clear focal point. The site should feel open and breathable, not dense.

---

## 4. Page Sections

The homepage has 7 sections plus a sticky nav.

### 4.0 Navigation (sticky)

- Starts transparent, full-size
- On scroll: shrinks height, gains glassmorphic backdrop-blur background
- Links: Services | Approach | About | Free Resources | **[Book a Call]** (accent button)
- Mobile: hamburger icon, slide-in panel with same links
- Transition between states: smooth CSS transition (~300ms)
- Logo: inline SVG (existing Autom8Lab logo)

### 4.1 Hero

**Layout:** Two columns. Left: text content. Right: abstract animated visual.

**Left column:**
- Headline: Approachable, benefit-focused (e.g. "AI Systems That Actually Work For Your Business")
- Sub-copy: 1-2 sentences. Who Cosmo is, what you get, the result.
- "Certified Claude Architect" badge — small, uses `--accent-warm` amber color
- Primary CTA: "Book a Free Consultation" (links to Calendly)
- Secondary CTA: "See Services" (smooth scroll to services section)

**Right column:**
- Abstract animated node graph rendered on canvas
- Dots/nodes connecting with lines, gentle ambient motion
- Color palette: blues and teals from the design system
- Purely atmospheric — no specific data represented

**Animations:**
- Headline fades up (GSAP)
- Sub-copy follows at +200ms delay
- CTAs at +400ms
- Node graph fades in simultaneously with hero load

### 4.2 Services (4 cards, AI Agents featured)

**Layout:** AI Agents gets a large hero card (full width). Below it: 3 cards in a row for the remaining services.

**Service definitions:**

| Service | Description | Card size |
|---------|-------------|-----------|
| AI Agents | Custom AI agents that handle leads, support, scheduling, and operations autonomously | Large (full width) |
| AI Workflow Automations | Connect existing tools, eliminate manual data entry, automate task routing | Standard (1/3) |
| AI Trainings | Staff training on AI tools and workflows. Certified Claude Architect-led sessions. | Standard (1/3) |
| AI Strategy | Consulting and roadmapping to identify where AI fits in your operations | Standard (1/3) |

**Card style:** Glassmorphic containers. Each card has an icon or simple illustration, title, 2-line description.

**AI Trainings card:** Includes a "Certified Claude Architect" callout/badge.

**Interactions:**
- 3D tilt on mouse hover (CSS perspective + JS mouse position tracking)
- Tilt range: subtle, ~5-8 degrees max

**Animations:**
- Scroll-triggered staggered entrance via GSAP ScrollTrigger
- Large card enters first, then 3 smaller cards cascade in with 100ms stagger

### 4.3 Process Timeline (4 steps)

**Layout:** Vertical centerline with steps alternating left and right.

**Steps:**

| # | Title | Description | Badge |
|---|-------|-------------|-------|
| 01 | AI Audit | Map operations, find inefficiencies, project ROI | FREE 30-MIN CALL |
| 02 | System Design | Build the roadmap, define scope, set timeline | DELIVERABLE: TECHNICAL SPEC |
| 03 | Implementation | Build and integrate on your current stack | LIVE IN ~14 DAYS |
| 04 | Optimization | Ongoing tuning, expansion, performance reviews | MONTHLY REVIEWS |

**Each step:** Numbered blue glowing circle on the centerline, title, description paragraph, badge tag.

**Animations:**
- Vertical line draws itself progressively as user scrolls (GSAP ScrollTrigger, `drawSVG` or scaleY approach)
- Each step card slides in from its respective side (left or right) as the line reaches it
- Step number circles pulse/glow briefly on entrance

### 4.4 Results (3 case study cards)

**Layout:** 3 cards in a row.

**Cards:**
- Healthcare (Specialty Clinic)
- Construction (General Contractor)
- Property Management

**Each card:** Industry tag label, headline metric (large number), brief 1-sentence description, "Read Case Study" link.

**Animations:**
- Metrics count up from zero when scrolled into view (GSAP number counter)
- Cards stagger in from bottom with 150ms delay between each

### 4.5 Contact Form

**Layout:** Two columns. Left: info sidebar. Right: form.

**Left sidebar:**
- "What to expect" — 4 items with checkmark icons:
  - Free consultation
  - Response within 24 hours
  - No obligation
  - Clear ROI projection
- Email fallback link
- "Certified Claude Architect" mention

**Right side — form fields:**
- Name (text input)
- Email (email input)
- Website (text input, optional)
- Industry (chip/pill selector: Healthcare, Construction, Property Mgmt, Professional Services, Other)
- Budget range (chip selector: ranges TBD)
- Biggest challenge (textarea)
- Submit button: "Book Your Free AI Audit"

**Backend:** Form POSTs to `/api/contact`. Placeholder handler returns JSON success response. Structured to later plug in MailerLite (mailing list), Notion (lead database), and calendar booking.

**Animations:**
- Form slides in from right on scroll
- Checklist items stagger in from left

### 4.6 FAQ (4 items)

**Implementation:** `<details>/<summary>` elements with custom styling.

**Questions:**
1. "Do we need to replace our software?"
2. "Is this consulting or implementation?"
3. "How quickly can this go live?"
4. "What does this cost?"

**Animations:** Accordion items dealt in with stagger effect on scroll.

### 4.7 Footer (4 columns)

| Column | Contents |
|--------|----------|
| Brand | Logo, tagline, email, social icons |
| Services | AI Agents, Workflow Automations, AI Trainings, AI Strategy |
| Company | Our Approach, Case Studies, About, Contact |
| Resources | Free Resources, AI Audit, Vision Map, AI Mastermind |

---

## 5. Global Effects

### 5.1 Dot Grid Background
- Full-page `<canvas>` element behind all content, fixed position
- Small dots arranged in a grid pattern
- Dots within ~100px of cursor glow brighter with blue tint
- Subtle ambient effect — should not distract from content
- Performance: requestAnimationFrame loop, only redraws dots near cursor change

### 5.2 Cursor Glow
- Soft radial gradient (`radial-gradient`) that follows cursor position
- Applied as a pseudo-element or additional overlay div
- Very subtle — just enough to add warmth to the dark background

### 5.3 Magnetic Buttons
- CTA buttons pull slightly toward cursor when cursor is within ~50px
- Uses JS mousemove listener with transform translate
- Smooth return to original position on mouse leave

### 5.4 Section Entrance Animations
- All handled by GSAP ScrollTrigger
- Each section has a unique entrance style (specified per section above)
- Trigger point: when section is ~20% visible in viewport
- Elements animate once only (no replay on scroll back up)

---

## 6. Project Structure

```
autom8-website/
├── api/
│   └── contact.js              # Vercel serverless function — form POST handler (placeholder)
├── public/
│   ├── css/
│   │   └── styles.css          # Tailwind build output + custom properties
│   ├── js/
│   │   ├── animations.js       # GSAP ScrollTrigger setup for all section entrances
│   │   ├── dot-grid.js         # Canvas dot grid with cursor proximity glow
│   │   ├── magnetic.js         # Magnetic button hover effect
│   │   ├── nav.js              # Sticky nav scroll behavior (shrink + blur)
│   │   └── tilt.js             # 3D card tilt on mouse hover
│   ├── fonts/
│   │   ├── Satoshi-Variable.woff2
│   │   └── CabinetGrotesk-Variable.woff2
│   └── assets/
│       └── logos/              # Existing SVG logo files (copied from current site)
├── views/
│   ├── partials/
│   │   ├── head.ejs            # Shared <head>: meta, fonts, Tailwind CSS link
│   │   ├── nav.ejs             # Sticky glassmorphic navigation
│   │   └── footer.ejs          # 4-column footer
│   └── index.ejs               # Homepage template
├── server.js                   # Express app entry point (local dev + Vercel)
├── vercel.json                 # Vercel routing: serves Express app + serverless functions
├── tailwind.config.js          # Custom theme: colors, fonts, spacing scale
├── postcss.config.js           # Tailwind PostCSS pipeline
├── package.json                # Dependencies: express, ejs, tailwindcss, gsap, etc.
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-05-homepage-redesign-design.md  # This file
```

### File responsibilities

- **server.js**: Express setup, EJS view engine config, static file serving from `public/`, routes (`GET /` renders `index.ejs`). Used for local dev; Vercel handles production routing.
- **api/contact.js**: Vercel serverless function. Accepts POST with form data, validates required fields, returns JSON response. Placeholder — logs submission and returns success. Structured with clear TODO comments for MailerLite, Notion, and calendar integrations.
- **views/index.ejs**: The homepage. Includes partials for head, nav, footer. Contains all 7 sections with proper class names for GSAP targeting.
- **public/js/animations.js**: Registers GSAP ScrollTrigger animations for every section. Each section's animation config is a separate function for maintainability.
- **public/js/dot-grid.js**: Self-contained canvas module. Creates grid, listens for mousemove, animates dot glow. Exports nothing — runs on DOMContentLoaded.
- **public/js/tilt.js**: Attaches to elements with `[data-tilt]` attribute. Calculates mouse position relative to card center, applies CSS transform.
- **public/js/magnetic.js**: Attaches to elements with `[data-magnetic]` attribute. Applies subtle translate transform toward cursor on proximity.
- **public/js/nav.js**: Listens for scroll events, toggles classes on nav element for shrink/blur state transition.

---

## 7. Out of Scope

- About page, Free Resources page, case study pages (separate future plans)
- MailerLite, Notion, calendar integrations (placeholder only in this build)
- Final copywriting (draft copy during implementation, refine later)
- SEO optimization
- Migration or removal of existing static HTML files
- Analytics or tracking setup
