# Autom8Lab V2 Style Guide

This is the current visual source of truth for the Autom8Lab V2 website. It reflects the live Express/EJS + Tailwind implementation, not the archived V1 static site.

Core implementation files:
- `tailwind.config.js` for Tailwind tokens
- `src/input.css` for font faces, CSS variables, and component utilities
- `views/partials/head.ejs`, `views/partials/nav.ejs`, and `views/partials/footer.ejs` for shared page structure

Do not copy design rules from `archive/root-legacy/` into new V2 pages unless explicitly preserving a legacy page section.

## Brand Feel

Autom8Lab should feel like a focused AI consulting practice: sharp, practical, technical, and calm. The visual system is dark, premium, and operational rather than flashy.

Use:
- dark canvas with subtle depth
- glass-like cards
- clean blue accent actions
- generous spacing
- direct, low-fluff copy
- restrained motion

Avoid:
- loud gradients
- generic SaaS purple styling
- bright white surfaces
- cramped layouts
- decorative animations that do not help the user understand the page

## Colors

Current tokens are defined in `tailwind.config.js` and `src/input.css`.

```css
:root {
  --bg-page: #0b0f1a;
  --bg-card: rgba(255, 255, 255, 0.03);
  --bg-card-border: rgba(255, 255, 255, 0.06);
  --border-subtle: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent: #3b82f6;
  --accent-hover: #60a5fa;
  --accent-warm: #f59e0b;
}
```

Usage:
- `page` / `--bg-page`: page background
- `card` / `--bg-card`: glass card surface
- `card-border` / `--bg-card-border`: glass card border
- `border-subtle`: inputs, dividers, secondary buttons
- `text-primary`: headings and important labels
- `text-secondary`: body copy
- `text-muted`: helper text, captions, footer detail
- `accent`: primary CTAs, badges, selected states, active lines
- `accent-hover`: CTA hover states
- `accent-warm`: occasional status or certification accent

Rules:
- Keep the site dark-only.
- Do not introduce new accent colors without a clear reason.
- Use `accent` blue for the main action language.
- Use `accent-warm` sparingly, mainly for special badges or highlights.

## Typography

Fonts are self-hosted in `public/fonts/` and loaded in `src/input.css`.

```js
fontFamily: {
  display: ['Satoshi', 'system-ui', 'sans-serif'],
  body: ['Cabinet Grotesk', 'system-ui', 'sans-serif'],
}
```

Use:
- `font-display` for hero headings, section headings, and strong card titles
- `font-body` for body text, forms, navigation, and helper text

Typical hierarchy:
- Hero headline: `text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.05]`
- Section headline: `text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight`
- Card heading: `text-xl font-display font-bold`
- Eyebrow label: `text-xs font-medium uppercase tracking-[0.2em] text-accent`
- Body copy: `text-lg leading-relaxed text-text-secondary`
- Small copy: `text-sm leading-relaxed text-text-secondary`

Rules:
- Do not use Google Fonts for new V2 pages.
- Do not use Inter for new V2 pages.
- Keep body text secondary, not pure white.
- Reserve `font-black` for major hero headlines.

## Layout

Default page shell:
- `<body class="bg-page text-text-primary font-body antialiased overflow-x-hidden">`
- dot-grid canvas
- cursor glow
- shared nav
- `<main class="relative z-10 pt-20">`
- shared footer

Standard containers:
- Large marketing sections: `max-w-7xl mx-auto px-6 lg:px-8`
- Focused sections/forms: `max-w-4xl mx-auto px-6 lg:px-8`
- Inner copy blocks: `max-w-2xl` or `max-w-3xl`

Section spacing:
- Use `py-section-sm` for most sections
- Use `py-section` for major page blocks when more vertical breathing room is needed
- Use `pb-section-sm lg:pb-section` for final CTA/form areas

Rules:
- Keep section widths consistent inside a page.
- Do not create one-off spacing systems unless a page has a specific design need.
- Forms should generally sit inside `max-w-4xl` glass cards.

## Cards

Use the shared card utility:

```html
<div class="glass-card p-8 lg:p-10">
  ...
</div>
```

Definition:

```css
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--bg-card-border);
  border-radius: 1rem;
}
```

Rules:
- Prefer glass cards for main content sections.
- Use `rounded-xl` or `rounded-2xl` for nested surfaces.
- Use borders and translucent surfaces for depth, not heavy shadows.

## Buttons

Primary CTA:

```html
<a class="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-4 text-white font-semibold transition-colors hover:bg-accent-hover">
  Book a Call
</a>
```

Secondary CTA:

```html
<a class="inline-flex items-center justify-center rounded-xl border border-border-subtle px-8 py-4 text-text-secondary font-semibold transition-colors hover:border-text-muted hover:text-text-primary">
  Learn More
</a>
```

Rules:
- Primary actions use `bg-accent`.
- Secondary actions use border treatment.
- Keep corners rounded and padding generous.
- Use `data-magnetic` only for key CTAs, not every link.

## Forms

Inputs:

```html
<input class="w-full bg-page border border-border-subtle rounded-lg px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors">
```

Selectable cards/chips:
- Use hidden native inputs inside clickable labels.
- The visible card should carry the selected state.
- Match the homepage and mastermind form pattern:

```html
<label class="selectable-card flex cursor-pointer items-center rounded-xl border border-border-subtle bg-page px-4 py-3 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent">
  <input type="checkbox" class="hidden">
  <span>Option</span>
</label>
```

Selected state is handled in JS by toggling:
- `bg-accent/20`
- `border-accent`
- `text-accent`

Rules:
- Use native visible checkboxes only for legal/consent confirmation.
- Multi-choice service/goal selections should use clickable rounded cards.
- Required fields must be validated in both frontend JS and backend API.

## Navigation And Footer

All new V2 pages should use:
- `views/partials/nav.ejs`
- `views/partials/footer.ejs`
- `views/partials/head.ejs`

Rules:
- Header and footer are universal across the V2 site.
- Do not recreate custom nav/footer markup per page.
- Homepage section anchors from inner pages should use `/#section-name`.

## Background And Motion

Standard V2 pages include:

```html
<canvas id="dot-grid" class="fixed inset-0 z-0 pointer-events-none" aria-hidden="true"></canvas>
<div id="cursor-glow" class="fixed w-[320px] h-[320px] rounded-full pointer-events-none z-0 opacity-0 transition-opacity duration-300" style="background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%); transform: translate(-50%, -50%);" aria-hidden="true"></div>
```

Standard scripts:
- `/js/dot-grid.js`
- `/js/nav.js`
- `/js/magnetic.js`
- `/js/tilt.js`
- `/js/animations.js` when the page uses reveal/timeline/counter behavior

Rules:
- Motion should be subtle and functional.
- Respect reduced-motion via the global CSS rule.
- Use tilt/magnetic sparingly on cards and key CTAs.

## Logo And Assets

Current shared pages use logo assets from:
- `assets/logos/`
- `public/assets/logos/`

The about photo is served from:
- `/assets/cosmo.jpg`

Rules:
- Prefer shared assets and shared partials over per-page recreations.
- Keep new public assets under `public/` when they are directly referenced by the browser.
- Root `assets/` is served by Express through `/assets`.

## Copy Voice

Voice:
- direct
- practical
- specific
- confident without hype
- friendly when the page is personal, like `/ai-mastermind-15`

Avoid:
- vague “AI transformation” language
- long theoretical explanations
- corporate filler
- overpromising automation outcomes

Good patterns:
- “No fluff. No gatekeeping.”
- “What AI can actually do for your business.”
- “I build the system that fixes the actual problem.”

## Build Notes

This is not a Tailwind CDN site anymore.

Use:
- `npm run css:build` to compile CSS
- `npm start` for the Express app
- `npm run dev` for local dev if needed

Vercel deploys from GitHub `main`.

Rules:
- Keep `public/css/styles.css` tracked because the current Vercel deployment serves it directly.
- Do not commit `.env`.
- Update `.env.example` when adding new environment variables.
