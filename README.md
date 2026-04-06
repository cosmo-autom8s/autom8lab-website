# Autom8Lab Website

Official website for **Autom8Lab** — Cosmo's AI consulting practice.

> **V1** is the current live site (static HTML, cPanel, gold accent). **V2** is the redesign in progress (Express + EJS, Vercel, blue accent). See `NEXT-STEPS.md` for the full V2 implementation plan.

---

# V1 — Current Live Site (Static HTML + cPanel)

Official website for **Autom8Lab** — an AI consulting agency that helps businesses understand, adopt, and implement AI. From free resources and guides to full AI audits and custom system builds, we make AI practical and accessible. This repo is synced to production via cPanel Git deployment.

---

## Project Structure

```
autom8-website/
├── index.html                          # Homepage — main landing page
├── ai-audit.html                       # AI Audit page — free 30-min audit offer
├── about.html                          # About page — founder story, team, mission
├── case-studies/
│   ├── specialty-clinic.html           # Case study: Specialty Clinic, Florida
│   ├── general-contractor.html         # Case study: GC Contractor, Phoenix
│   ├── property-management.html        # Case study: PM Company, Tampa
│   └── diagnostics-lab.html            # Case study: Diagnostics Lab, South Florida
├── coming-soon.html                    # Old "Coming Soon" landing page (archived)
├── soon_index.html                     # Old homepage template (archived)
├── services_menu.html                  # 54 AI systems accordion UI (partner-facing)
├── complexity_guide.html               # 54 systems sorted by complexity (partner-facing)
├── css/
│   └── styles.css                      # Shared design system (tokens, animations, components)
├── js/
│   └── main.js                         # Shared JS (IntersectionObserver for fade-in animations)
├── assets/
│   ├── cosmo.jpg                       # Founder headshot
│   └── logos/                          # SVG brand assets (icon, logo variants, favicon)
└── .claude/
    └── launch.json                     # Dev server config (python3 http.server on port 8080)
```

## Pages

### `index.html` — Homepage (LIVE)
- **Purpose:** Main public-facing landing page.
- **Sections:** Hero (3-line headline, gold checkmarks, CTA), Social Proof Band, Two Outcomes ($ and clock icons), The Real Issue (two-column: pain points + conclusion card), Our Work (table layout), How It Works (3 steps), Is This a Fit? (Good Fit gold border card + Probably Not a Fit card), Results (3 case study cards with metrics), Case Studies (4 links), What We Don't Do, FAQ (4 accordions), Final CTA (founder photo + Book a Call).
- **Calendly link:** `https://calendly.com/cosminlungu/30min`

### `ai-audit.html` — AI Audit
- **Purpose:** Dedicated page for the free 30-minute AI Audit offer.
- **Sections:** Hero (gold checkmarks: 30 min / Free / No obligation), What Happens in the Audit (3 numbered cards), What This Is Not ("not a sales pitch"), Is This a Fit? (same Good Fit / Not a Fit cards as index), FAQ (4 accordions), Final CTA.

### `about.html` — About
- **Purpose:** Founder story, team introduction, and company mission.
- **Sections:** About Us (founder story, 4 paragraphs + photo), Who We Are (5 team member cards in grid), Why We Built This (origin story + two outcome cards), Final CTA.
- **Team:** Cosmo (AI Expert & Visionary), Claudiu (Head of Technology), Alexandra (Head of Customer Satisfaction), Maria (Head of Marketing), Dr. Gerhard (Head of Life Sciences).

### `case-studies/` — Case Studies (4 pages)
- **Purpose:** Individual case study pages for each client industry.
- **Pages:** specialty-clinic.html, general-contractor.html, property-management.html, diagnostics-lab.html
- **Navigation:** Full nav matching index (logo links to `../index.html`), matching footer.
- **Internal links:** Use `../` prefix for correct pathing from subdirectory.

### `services_menu.html` — AI Service Menu (Partner-Facing)
- **Purpose:** Standalone page for partners showing all 54 AI systems organized by business domain.
- **UI:** Accordion pattern — Mega Categories > Categories > Individual Systems.
- **Navigation:** Own nav with logo (unlinked) + "Book a Call" CTA. Does NOT link to homepage.

### `complexity_guide.html` — System Complexity Guide (Partner-Facing)
- **Purpose:** Same 54 systems sorted by implementation complexity level.
- **UI:** Three tabs: Quick Wins (19 systems), Medium (25), Major (10).
- **Navigation:** Logo (unlinked) + "Back to Service Menu" link.

## Shared Navigation

All public pages (index, ai-audit, about, case studies) share the same nav structure:
- **Logo:** Inline SVG, linked to index.html (or ../index.html for case studies)
- **Desktop links:** How It Works, Case Studies, AI Audit, About, Book a Call (gold CTA)
- **Mobile:** Hamburger toggle menu with same links
- **Active state:** Current page link shown in white text (others in gray)

## Shared Footer

All public pages use the same simplified footer:
- Logo + tagline ("AI systems for businesses that want results, not theory.")
- Copyright 2026
- "Book Your AI Audit" link

## Tech Stack

| Layer      | Tool                                   |
|------------|----------------------------------------|
| CSS        | Tailwind CSS via CDN + custom `styles.css` |
| Fonts      | Google Fonts — Inter (400-900)          |
| JS         | Vanilla JS (no frameworks)             |
| Hosting    | cPanel-compatible static files          |
| Dev server | `python3 -m http.server 8080`          |

## Design System

### Colors (CSS custom properties in `styles.css`)

| Token                | Value     | Usage                          |
|----------------------|-----------|--------------------------------|
| `--bg-page`          | `#0a0a0b` | Page background                |
| `--bg-card`          | `#141414` | Card/container backgrounds     |
| `--border-subtle`    | `#262626` | Dividers, borders              |
| `--text-primary`     | `#ffffff` | Headings, key text             |
| `--text-secondary`   | `#9ca3af` | Subheadings, descriptions      |
| `--text-muted`       | `#6b7280` | Captions, footer text          |
| `--accent-gold`      | `#c9a66b` | Primary brand accent (CTAs, "8" in logo) |
| `--accent-gold-hover`| `#d4b07a` | Gold hover state               |

### Key CSS Classes

| Class              | Purpose                                            |
|--------------------|----------------------------------------------------|
| `.hero-gradient`   | Gradient text effect (gold to mauve) on headings     |
| `.fade-in`         | Scroll-triggered fade-up animation (needs `.visible` via JS) |
| `.bg-glow`         | Fixed background with subtle radial glow effects   |
| `.cta-glow`        | Pulsing box-shadow animation on CTA buttons        |

## Shared JS (`js/main.js`)

Uses `IntersectionObserver` to add `.visible` class to `.fade-in` elements when they scroll into view (15% threshold). Each element only animates once (`unobserve` after triggering).

## Important Notes

### SVG Logos Are Inlined
All pages use **inline SVGs** rather than `<img>` references to `assets/logos/`. This was done because external SVG `<img>` tags broke on cPanel (MIME type issues). The files in `assets/logos/` are kept as source references but are not loaded by any page.

### Page Isolation
- Public pages (index, ai-audit, about, case studies) all share the same nav/footer and link to each other.
- `services_menu.html` and `complexity_guide.html` are standalone partner-facing tools and do NOT link to the public pages.

### FAQ Accordions
Uses native HTML `<details>/<summary>` elements with custom styling (hidden marker, rotating + icon). No JS required for toggle behavior.

### Adding New Pages (V1)
When creating new pages, include the standard boilerplate in `<head>`:
```html
<script src="https://cdn.tailwindcss.com"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
  }
</script>
<link rel="stylesheet" href="css/styles.css">
```
Include `<script src="js/main.js"></script>` before `</body>` for fade-in animations. Copy the nav and footer from an existing page (index.html or ai-audit.html). Inline the SVG logo directly into the HTML.

## V1 Dev Server

```bash
cd /Users/cosmo/autom8-website
python3 -m http.server 8080
# Visit http://localhost:8080
```

---

# V2 — Redesign (Express + EJS + Vercel)

Complete redesign repositioning from "AI agency" to "Cosmo as trusted AI consultant" with an approachable expert tone. Dark blue palette with glassmorphism, interactive canvas effects, and premium typography.

## V2 Tech Stack

| Layer       | Tool                                                    |
|-------------|---------------------------------------------------------|
| Server      | Express.js 4.x + EJS templates                         |
| CSS         | Tailwind CSS 3.x via PostCSS (custom config)            |
| Fonts       | Self-hosted Satoshi (display) + Cabinet Grotesk (body)  |
| Animations  | GSAP 3.x + ScrollTrigger (currently disabled — see Known Issues) |
| Interactive | Canvas API (dot grid, node graph), magnetic/tilt effects |
| Forms       | Vercel serverless functions (`/api/contact`)            |
| Hosting     | Vercel (not yet deployed)                               |

## V2 Project Structure

```
autom8-website/
  server.js                  # Express app (EJS view engine, static serving, exports for Vercel)
  vercel.json                # Vercel routing config
  package.json               # Dependencies and scripts
  tailwind.config.js         # Custom colors, fonts, spacing tokens
  src/input.css              # Font-face, Tailwind directives, CSS components (glass-card, etc.)
  views/
    index.ejs                # Homepage (DONE)
    partials/
      head.ejs               # <head> — dynamic title/description
      nav.ejs                # Fixed nav — desktop links + mobile hamburger
      footer.ejs             # 4-column footer
  public/
    css/output.css           # Compiled Tailwind output
    js/
      animations.js          # GSAP ScrollTrigger (COMMENTED OUT — timing bug)
      dot-grid.js            # Canvas dot grid + cursor glow
      hero-nodes.js          # Animated node graph in hero section
      nav.js                 # Sticky nav blur on scroll + mobile menu
      magnetic.js            # Magnetic hover on [data-magnetic] elements
      tilt.js                # 3D tilt on [data-tilt] elements
      form.js                # Contact form: chip selectors, validation, async POST
    fonts/                   # Satoshi + Cabinet Grotesk .woff2 variable fonts
  api/
    contact.js               # Vercel serverless function (placeholder — logs only)
  docs/superpowers/
    specs/                   # Approved design spec
    plans/                   # Homepage implementation plan
  NEXT-STEPS.md              # Detailed handoff doc for building remaining pages
```

### Legacy / Iteration Files
```
  index-redesign-v1.html     # Early redesign iteration
  index-v2.html              # Second redesign iteration
  REDESIGN-PLAN.md           # Original redesign planning notes
  free-resources.html        # Old static free resources page
  ai-mastermind.html         # Old static AI mastermind page
```

## V2 Pages

### Done
- **Homepage** (`/`) — 7 sections: Hero, Services (4 glass cards), Process Timeline, Results (3 case studies with metrics), Contact Form (chip selectors + validation), FAQ (accordion), Footer (4-column)

### To Build
- **About** (`/about`) — Cosmo's personal page, certifications, philosophy
- **Free Resources** (`/free-resources`) — Content hub / lead magnets
- **AI Audit** (`/ai-audit`) — Landing page for free audit offer
- **Vision Map** (`/vision-map`) — Service landing page
- **AI Mastermind** (`/ai-mastermind`) — Service landing page

See `NEXT-STEPS.md` for detailed specs, EJS page template, and the exact pattern for adding new pages.

## V2 Design System

### Colors

| Token            | Value                      | Usage            |
|------------------|----------------------------|------------------|
| `page`           | `#0a0f1a`                  | Page background  |
| `card`           | `#111827`                  | Card backgrounds |
| `accent`         | `#3b82f6`                  | Primary blue     |
| `accent-warm`    | `#f59e0b`                  | Secondary amber  |
| `text-primary`   | `#f1f5f9`                  | Headings         |
| `text-secondary` | `#94a3b8`                  | Body text        |
| `text-muted`     | `#64748b`                  | Captions         |
| `border-subtle`  | `rgba(148,163,184,0.1)`    | Card borders     |

### Key CSS Classes
| Class          | Purpose                                          |
|----------------|--------------------------------------------------|
| `glass-card`   | Glassmorphism card (backdrop blur, border, bg)    |
| `font-display` | Satoshi font for headings                         |
| `font-body`    | Cabinet Grotesk for body text                     |
| `py-section`   | 10rem vertical padding for sections               |
| `py-section-sm`| 7.5rem vertical padding for smaller sections      |

## V2 Dev Commands

```bash
# If node isn't on PATH:
export PATH="/usr/local/bin:$PATH"

npm run dev          # Express (nodemon) + Tailwind watch
npm run css:build    # One-time Tailwind compile
npm run build        # Production Tailwind build (minified)
npm start            # Production Express start
```

Local dev server runs on http://localhost:3000

## V2 Known Issues

1. **GSAP ScrollTrigger animations disabled** — `animations.js` is commented out. `gsap.from()` immediately sets `opacity: 0` on elements, and ScrollTrigger fails to play them back when sections are already in viewport on load. Fix: switch to `gsap.fromTo()` with `immediateRender: false`, or use Intersection Observer.

2. **Contact form backend is a placeholder** — `api/contact.js` logs submissions but doesn't send emails or integrate with anything. Planned: MailerLite (mailing list), Notion (lead tracking), email notifications.

## V2 Nav Links

- Services → `#services` (homepage anchor)
- Approach → `#process` (homepage anchor)
- About → `/about` (page needed)
- Free Resources → `/free-resources` (page needed)
- Book a Call → `https://calendly.com/cosminlungu/30min` (external)
