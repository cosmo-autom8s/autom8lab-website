# Autom8Lab Website - Current State & Next Steps

Last updated: 2026-04-06

## Architecture

- **Framework**: Express.js + EJS templates, deployed via Vercel
- **Styling**: Tailwind CSS 3.x via PostCSS (custom config in `tailwind.config.js`)
- **Fonts**: Self-hosted Satoshi (display) and Cabinet Grotesk (body) variable fonts in `public/fonts/`
- **Design tokens**: Defined as CSS custom properties in `src/input.css` and mirrored in Tailwind config
- **Interactive effects**: Canvas dot-grid background, cursor glow, magnetic buttons (`[data-magnetic]`), card tilt (`[data-tilt]`), hero node graph

## Project Structure

```
autom8-website/
  server.js              # Express app, exports for Vercel
  vercel.json            # Routes /api/* to serverless, rest to server.js
  package.json           # deps: express, ejs, gsap; dev: tailwind, postcss, etc.
  tailwind.config.js     # Custom colors, fonts, spacing tokens
  src/input.css          # @font-face, Tailwind directives, CSS components (glass-card, etc.)
  public/
    css/output.css       # Compiled Tailwind (run `npm run css:build` to regenerate)
    js/
      dot-grid.js        # Canvas dot grid + cursor glow
      hero-nodes.js      # Animated node graph in hero
      nav.js             # Sticky nav blur + mobile menu
      magnetic.js        # Magnetic hover effect on [data-magnetic] elements
      tilt.js            # 3D tilt on [data-tilt] elements
      form.js            # Contact form: chip selectors, validation, async submit
      animations.js      # GSAP ScrollTrigger animations (CURRENTLY COMMENTED OUT - see Known Issues)
    fonts/               # Satoshi + Cabinet Grotesk variable .woff2 files
  views/
    index.ejs            # Homepage (DONE)
    partials/
      head.ejs           # <head> with dynamic title/description
      nav.ejs            # Fixed nav with desktop + mobile menu
      footer.ejs         # 4-column footer
  api/
    contact.js           # Serverless function for form submissions (placeholder - logs only)
  docs/superpowers/
    specs/               # Design spec (approved)
    plans/               # Implementation plan (homepage)
```

## What's Done

### Homepage (`/`) - COMPLETE
All 7 sections built and styled:
1. **Hero** - headline, subtext, dual CTAs, animated node graph canvas
2. **Services** - 4 glass cards (AI Agents featured, Workflow Automations, AI Trainings, AI Strategy)
3. **Process Timeline** - 4-step vertical timeline with alternating cards and dots
4. **Results** - 3 case study cards (Healthcare, Construction, Property Management) with static metrics
5. **Contact Form** - chip-based industry/budget selectors, validation, async POST to `/api/contact`
6. **FAQ** - accordion-style with 6 questions
7. **Footer** - 4-column with brand, services, company, resources links

### Shared Components
- `nav.ejs` - responsive nav with links to: Services (anchor), Approach (anchor), About, Free Resources, Book a Call (Calendly)
- `footer.ejs` - links to: About, Free Resources, AI Audit, Vision Map, AI Mastermind, Case Studies, Contact
- `head.ejs` - accepts `title` and `description` variables
- All interactive JS effects work across any page that includes the scripts

## Known Issues

### GSAP ScrollTrigger Animations (DISABLED)
`public/js/animations.js` is fully commented out. The animations use `gsap.from()` which immediately sets elements to `opacity: 0`, but ScrollTrigger fails to play them back when:
- The page loads with sections already in viewport
- Programmatic scrolling (scrollIntoView) bypasses trigger detection

**Fix approach**: Replace `gsap.from()` with `gsap.fromTo()` and add `immediateRender: false`, or use Intersection Observer as a simpler fallback. The commented code is complete and correct in structure - just needs the timing/render issue resolved.

### Contact Form Backend
`api/contact.js` is a placeholder that logs submissions and returns success. Needs:
- MailerLite integration (add to mailing list)
- Notion integration (create lead entry)
- Calendly auto-booking or redirect
- Email notification to Cosmo

## Pages to Build

### 1. About Page (`/about`)
**Nav link already exists.** This is the "Cosmo as trusted AI consultant" positioning page.

Suggested sections:
- Hero: Photo + intro paragraph (who you are, what you believe about AI)
- Story: Background, how you got into AI, Certified Claude Architect credential
- Philosophy: Your approach to AI consulting (practical, results-first, partner not vendor)
- CTA: Book a call

**To build:**
- Create `views/about.ejs`
- Add route in `server.js`: `app.get('/about', (req, res) => res.render('about', { title: '...', description: '...' }));`
- Reuse: head, nav, footer partials + all existing CSS/JS

### 2. Free Resources Page (`/free-resources`)
**Nav link already exists.** Content hub / lead magnet page.

Suggested sections:
- Hero: "Free AI Resources" headline
- Resource grid: cards for each resource (guides, templates, tools)
- Email capture: for gated downloads (ties into MailerLite later)

**To build:**
- Create `views/free-resources.ejs`
- Add route in `server.js`
- Decide what resources to feature (need content from Cosmo)

### 3. AI Audit Page (`/ai-audit`)
**Footer link exists.** Could be a landing page for the free AI audit offer.

**To build:**
- Create `views/ai-audit.ejs`
- Add route in `server.js`
- Content: What the audit covers, what they get, CTA to book

### 4. Vision Map Page (`/vision-map`)
**Footer link exists.**

**To build:**
- Create `views/vision-map.ejs`
- Add route in `server.js`
- Content: What it is, sample output, CTA

### 5. AI Mastermind Page (`/ai-mastermind`)
**Footer link exists.** Note: an old `ai-mastermind.html` file exists in the root (from old static site).

**To build:**
- Create `views/ai-mastermind.ejs` (migrate/redesign from old HTML)
- Add route in `server.js`

## How to Build Each Page (Pattern)

Every new page follows the exact same pattern:

### Step 1: Create the EJS file
```
views/page-name.ejs
```
Use this template:
```ejs
<%- include('partials/head', { title: 'Page Title - Autom8Lab', description: 'Meta description' }) %>
<body class="bg-page text-text-primary font-body antialiased overflow-x-hidden">
  <canvas id="dot-grid" class="fixed inset-0 z-0 pointer-events-none" aria-hidden="true"></canvas>
  <div id="cursor-glow" class="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-0 opacity-0 transition-opacity duration-300" style="background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);"></div>

  <%- include('partials/nav') %>

  <main class="relative z-10 pt-20">
    <!-- PAGE CONTENT HERE -->
    <!-- Use glass-card class for card components -->
    <!-- Use max-w-7xl mx-auto px-6 lg:px-8 for content containers -->
    <!-- Use py-section (10rem) or py-section-sm (7.5rem) for section spacing -->
  </main>

  <%- include('partials/footer') %>

  <script src="/js/dot-grid.js"></script>
  <script src="/js/nav.js"></script>
  <script src="/js/magnetic.js"></script>
  <script src="/js/tilt.js"></script>
</body>
</html>
```

### Step 2: Add the route in server.js
```js
app.get('/page-name', (req, res) => {
  res.render('page-name', {
    title: 'Page Title - Autom8Lab',
    description: 'Meta description for SEO'
  });
});
```

### Step 3: Build with Tailwind CSS
No new CSS needed. Use existing classes:
- `glass-card` - glassmorphism card with border and backdrop blur
- `bg-page`, `bg-card` - background colors
- `text-text-primary`, `text-text-secondary`, `text-text-muted` - text hierarchy
- `text-accent`, `text-accent-warm` - accent colors
- `font-display`, `font-body` - typography
- `py-section`, `py-section-sm` - section vertical spacing
- `max-w-7xl mx-auto px-6 lg:px-8` - content container

If you add new Tailwind classes not in current output.css, rebuild CSS:
```bash
npm run css:build
```

## Dev Commands

```bash
npm run dev          # starts Express (nodemon) + Tailwind watch concurrently
npm run css:build    # one-time Tailwind compile
npm run build        # production Tailwind build (minified)
npm start            # production Express start
```

Note: If `npm`/`node` aren't on PATH in your shell, prefix with:
```bash
export PATH="/usr/local/bin:$PATH"
```

## Design Reference

- Full design spec: `docs/superpowers/specs/2026-04-05-homepage-redesign-design.md`
- Implementation plan (homepage): `docs/superpowers/plans/2026-04-05-homepage-redesign.md`

## Color Palette (quick reference)

| Token | Value | Use |
|-------|-------|-----|
| `page` | `#0a0f1a` | Page background |
| `card` | `#111827` | Card backgrounds |
| `accent` | `#3b82f6` | Primary blue accent |
| `accent-warm` | `#f59e0b` | Secondary amber accent |
| `text-primary` | `#f1f5f9` | Headings |
| `text-secondary` | `#94a3b8` | Body text |
| `text-muted` | `#64748b` | Captions, labels |
| `border-subtle` | `rgba(148,163,184,0.1)` | Card borders |

## Deployment

Configured for Vercel (`vercel.json` ready). NOT deployed yet.
When ready: `vercel` from project root, or connect GitHub repo in Vercel dashboard.
