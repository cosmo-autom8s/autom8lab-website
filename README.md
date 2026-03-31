# Autom8Lab Website

AI systems agency website for **Autom8Lab** — we install AI systems for traditional businesses. Healthcare, construction, property management. No fluff, no theory, just systems that work.

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

### Adding New Pages
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

## Dev Server

```bash
# Start local server (or use .claude/launch.json "autom8-dev" config)
cd /Users/cosmo/autom8-website
python3 -m http.server 8080
# Visit http://localhost:8080
```
