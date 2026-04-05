# Autom8Lab Homepage Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Autom8Lab homepage as a Node.js (Express + EJS) app with GSAP animations, glassmorphic dark theme, interactive dot grid background, and consultant-first positioning.

**Architecture:** Express serves EJS templates with shared partials (nav, footer, head). Static assets (CSS, JS, fonts) served from `public/`. Tailwind CSS built via PostCSS. GSAP + ScrollTrigger handles all animations. Canvas API powers interactive dot grid. Vercel serverless function handles contact form. All existing static files remain untouched.

**Tech Stack:** Node 18+, Express 4.x, EJS, Tailwind CSS 3.x (PostCSS), GSAP 3.x + ScrollTrigger, Canvas API, Lucide Icons, Satoshi + Cabinet Grotesk fonts, Vercel deployment.

**Spec:** `docs/superpowers/specs/2026-04-05-homepage-redesign-design.md`

---

## Chunk 1: Project Scaffold & Dev Server

### Task 1: Initialize Node.js project and install dependencies

**Files:**
- Create: `package.json`
- Create: `server.js`
- Create: `vercel.json`
- Create: `.gitignore` (update existing if present)

- [ ] **Step 1: Initialize package.json**

```bash
cd /Users/cosmo/autom8-website
npm init -y
```

- [ ] **Step 2: Install production dependencies**

```bash
npm install express ejs
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D tailwindcss@3 postcss autoprefixer concurrently nodemon
```

- [ ] **Step 4: Create server.js**

Create `server.js` with Express setup:

```js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing for form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// Local dev server (Vercel uses its own routing)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Autom8Lab dev server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
```

- [ ] **Step 5: Create vercel.json**

Create `vercel.json`:

```json
{
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/server.js" }
  ]
}
```

- [ ] **Step 6: Add npm scripts to package.json**

Update the `"scripts"` section in `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"nodemon server.js\" \"npm run css:watch\"",
    "css:build": "tailwindcss -i ./src/input.css -o ./public/css/styles.css --minify",
    "css:watch": "tailwindcss -i ./src/input.css -o ./public/css/styles.css --watch",
    "build": "npm run css:build",
    "start": "node server.js"
  }
}
```

- [ ] **Step 7: Update .gitignore**

Add to `.gitignore` (create if not present):

```
node_modules/
public/css/styles.css
.env
```

- [ ] **Step 8: Commit scaffold**

```bash
git add package.json package-lock.json server.js vercel.json .gitignore
git commit -m "feat: initialize Node.js project scaffold with Express + EJS"
```

---

### Task 2: Configure Tailwind CSS build pipeline

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/input.css`

- [ ] **Step 1: Create Tailwind config**

Create `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Satoshi', 'system-ui', 'sans-serif'],
        body: ['Cabinet Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        page: '#0b0f1a',
        card: 'rgba(255, 255, 255, 0.03)',
        'card-border': 'rgba(255, 255, 255, 0.06)',
        'border-subtle': '#1e293b',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
        accent: '#3b82f6',
        'accent-hover': '#60a5fa',
        'accent-warm': '#f59e0b',
      },
      spacing: {
        'section': '10rem',   /* 160px — section padding */
        'section-sm': '7.5rem', /* 120px — tighter section padding */
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Create PostCSS config**

Create `postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 3: Create Tailwind input file**

Create `src/input.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================
   Autom8Lab — Custom Properties & Overrides
   ============================================ */

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

/* Base styles */
body {
  background-color: var(--bg-page);
  font-family: 'Cabinet Grotesk', system-ui, sans-serif;
  color: var(--text-primary);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Glassmorphic card utility */
@layer components {
  .glass-card {
    background: var(--bg-card);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--bg-card-border);
    border-radius: 1rem;
  }
}

/* Font face declarations — filled in Task 3 */

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Run initial Tailwind build**

```bash
npx tailwindcss -i ./src/input.css -o ./public/css/styles.css
```

Expected: `public/css/styles.css` is created (mostly Tailwind base styles since no templates exist yet).

- [ ] **Step 5: Commit Tailwind config**

```bash
git add tailwind.config.js postcss.config.js src/input.css
git commit -m "feat: configure Tailwind CSS 3.x build pipeline with custom design tokens"
```

---

### Task 3: Download and configure fonts

**Files:**
- Create: `public/fonts/Satoshi-Variable.woff2`
- Create: `public/fonts/Satoshi-VariableItalic.woff2`
- Create: `public/fonts/CabinetGrotesk-Variable.woff2`
- Modify: `src/input.css` (add @font-face declarations)

- [ ] **Step 1: Create fonts directory**

```bash
mkdir -p /Users/cosmo/autom8-website/public/fonts
```

- [ ] **Step 2: Download Satoshi font**

Download from Fontshare. The variable font files are available at:

```bash
cd /Users/cosmo/autom8-website/public/fonts
curl -L "https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap" -o satoshi-check.txt
```

If direct download isn't available via curl, manually download from https://www.fontshare.com/fonts/satoshi — download the "Variable" woff2 files and place them in `public/fonts/`. Files needed:
- `Satoshi-Variable.woff2`
- `Satoshi-VariableItalic.woff2` (optional, only if italic is used)

- [ ] **Step 3: Download Cabinet Grotesk font**

Download from https://www.fontshare.com/fonts/cabinet-grotesk — download the "Variable" woff2 file:
- `CabinetGrotesk-Variable.woff2`

- [ ] **Step 4: Add @font-face declarations to input.css**

Add at the top of `src/input.css`, before the `@tailwind` directives:

```css
/* Satoshi — Display/Headline font */
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Variable.woff2') format('woff2');
  font-weight: 300 900;
  font-display: swap;
  font-style: normal;
}

/* Cabinet Grotesk — Body font */
@font-face {
  font-family: 'Cabinet Grotesk';
  src: url('/fonts/CabinetGrotesk-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}
```

- [ ] **Step 5: Rebuild CSS and test**

```bash
npm run css:build
```

- [ ] **Step 6: Commit fonts setup**

```bash
git add public/fonts/ src/input.css
git commit -m "feat: add self-hosted Satoshi and Cabinet Grotesk variable fonts"
```

---

### Task 4: Create EJS partials (head, nav, footer)

**Files:**
- Create: `views/partials/head.ejs`
- Create: `views/partials/nav.ejs`
- Create: `views/partials/footer.ejs`
- Create: `views/index.ejs` (minimal placeholder)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p /Users/cosmo/autom8-website/views/partials
```

- [ ] **Step 2: Create head.ejs partial**

Create `views/partials/head.ejs`:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><%= typeof title !== 'undefined' ? title + ' | Autom8Lab' : 'Autom8Lab — AI Systems That Work' %></title>
<meta name="description" content="<%= typeof description !== 'undefined' ? description : 'AI consulting and implementation by Cosmo. Custom AI agents, workflow automations, staff training, and strategy.' %>">
<link rel="icon" href="/assets/logos/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/css/styles.css">
```

- [ ] **Step 3: Create nav.ejs partial**

Create `views/partials/nav.ejs` — sticky glassmorphic nav with the existing inline SVG logo. Nav starts transparent, gains blur on scroll (controlled by `nav.js` added later). Mobile hamburger menu included.

```html
<nav id="main-nav" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20" id="nav-inner">
    <!-- Logo -->
    <a href="/" aria-label="Autom8Lab Home">
      <svg width="340" height="64" viewBox="0 0 340 64" xmlns="http://www.w3.org/2000/svg" class="h-8 w-auto" role="img" aria-label="Autom8Lab">
        <defs><linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#60a5fa"/><stop offset="50%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs>
        <circle cx="28" cy="18" r="14" fill="none" stroke="url(#logo-grad)" stroke-width="2.5"/>
        <circle cx="28" cy="46" r="14" fill="none" stroke="url(#logo-grad)" stroke-width="2.5"/>
        <circle cx="28" cy="32" r="4" fill="#3b82f6"/>
        <text x="62" y="30" fill="#ffffff" font-size="28" font-weight="700" font-family="Satoshi, system-ui, sans-serif" letter-spacing="-0.5">AUTOM<tspan fill="#3b82f6">8</tspan>LAB</text>
        <text x="62" y="50" fill="#64748b" font-size="13" font-weight="500" font-family="Cabinet Grotesk, system-ui, sans-serif" letter-spacing="3">YOUR AI PARTNER</text>
      </svg>
    </a>

    <!-- Desktop Links -->
    <div class="hidden lg:flex items-center gap-8">
      <a href="#services" class="text-sm font-body text-text-secondary hover:text-text-primary transition-colors">Services</a>
      <a href="#process" class="text-sm font-body text-text-secondary hover:text-text-primary transition-colors">Approach</a>
      <a href="/about" class="text-sm font-body text-text-secondary hover:text-text-primary transition-colors">About</a>
      <a href="/free-resources" class="text-sm font-body text-text-secondary hover:text-text-primary transition-colors">Free Resources</a>
      <a href="https://calendly.com/cosminlungu/30min" target="_blank" rel="noopener noreferrer"
         class="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
         data-magnetic>
        Book a Call
      </a>
    </div>

    <!-- Mobile Hamburger -->
    <button id="mobile-menu-btn" class="lg:hidden text-text-secondary hover:text-text-primary" aria-label="Open menu">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>

  <!-- Mobile Slide-in Panel -->
  <div id="mobile-menu" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-black/60" id="mobile-menu-overlay"></div>
    <div class="absolute right-0 top-0 h-full w-72 bg-page border-l border-border-subtle p-8 transform translate-x-full transition-transform duration-300" id="mobile-menu-panel">
      <button id="mobile-menu-close" class="absolute top-6 right-6 text-text-secondary hover:text-text-primary" aria-label="Close menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <div class="flex flex-col gap-6 mt-12">
        <a href="#services" class="text-lg font-body text-text-secondary hover:text-text-primary transition-colors">Services</a>
        <a href="#process" class="text-lg font-body text-text-secondary hover:text-text-primary transition-colors">Approach</a>
        <a href="/about" class="text-lg font-body text-text-secondary hover:text-text-primary transition-colors">About</a>
        <a href="/free-resources" class="text-lg font-body text-text-secondary hover:text-text-primary transition-colors">Free Resources</a>
        <a href="https://calendly.com/cosminlungu/30min" target="_blank" rel="noopener noreferrer"
           class="px-5 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors text-center mt-4">
          Book a Call
        </a>
      </div>
    </div>
  </div>
</nav>
```

- [ ] **Step 4: Create footer.ejs partial**

Create `views/partials/footer.ejs` — 4-column footer with Lucide-style SVG social icons inline:

```html
<footer class="border-t border-border-subtle py-section-sm">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

      <!-- Brand -->
      <div>
        <a href="/" aria-label="Autom8Lab Home">
          <svg width="340" height="64" viewBox="0 0 340 64" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto" role="img" aria-label="Autom8Lab">
            <defs><linearGradient id="logo-footer" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#60a5fa"/><stop offset="50%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs>
            <circle cx="28" cy="18" r="14" fill="none" stroke="url(#logo-footer)" stroke-width="2.5"/>
            <circle cx="28" cy="46" r="14" fill="none" stroke="url(#logo-footer)" stroke-width="2.5"/>
            <circle cx="28" cy="32" r="4" fill="#3b82f6"/>
            <text x="62" y="30" fill="#ffffff" font-size="28" font-weight="700" font-family="Satoshi, system-ui, sans-serif" letter-spacing="-0.5">AUTOM<tspan fill="#3b82f6">8</tspan>LAB</text>
            <text x="62" y="50" fill="#64748b" font-size="13" font-weight="500" font-family="Cabinet Grotesk, system-ui, sans-serif" letter-spacing="3">YOUR AI PARTNER</text>
          </svg>
        </a>
        <p class="text-text-muted text-sm mt-4 font-body">AI systems for businesses that want results, not theory.</p>
        <a href="mailto:cosmo@autom8lab.com" class="text-text-secondary text-sm hover:text-text-primary transition-colors mt-2 inline-block font-body">cosmo@autom8lab.com</a>
        <div class="flex gap-4 mt-4">
          <!-- LinkedIn -->
          <a href="#" aria-label="LinkedIn" class="text-text-muted hover:text-text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <!-- YouTube -->
          <a href="#" aria-label="YouTube" class="text-text-muted hover:text-text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
          </a>
          <!-- X/Twitter -->
          <a href="#" aria-label="Twitter" class="text-text-muted hover:text-text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </a>
        </div>
      </div>

      <!-- Services -->
      <div>
        <h4 class="text-text-primary font-display font-semibold text-sm uppercase tracking-wider mb-4">Services</h4>
        <ul class="space-y-3">
          <li><a href="#services" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">AI Agents</a></li>
          <li><a href="#services" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">Workflow Automations</a></li>
          <li><a href="#services" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">AI Trainings</a></li>
          <li><a href="#services" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">AI Strategy</a></li>
        </ul>
      </div>

      <!-- Company -->
      <div>
        <h4 class="text-text-primary font-display font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
        <ul class="space-y-3">
          <li><a href="#process" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">Our Approach</a></li>
          <li><a href="#results" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">Case Studies</a></li>
          <li><a href="/about" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">About</a></li>
          <li><a href="#contact" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">Contact</a></li>
        </ul>
      </div>

      <!-- Resources -->
      <div>
        <h4 class="text-text-primary font-display font-semibold text-sm uppercase tracking-wider mb-4">Resources</h4>
        <ul class="space-y-3">
          <li><a href="/free-resources" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">Free Resources</a></li>
          <li><a href="/ai-audit" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">AI Audit</a></li>
          <li><a href="/vision-map" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">Vision Map</a></li>
          <li><a href="/ai-mastermind" class="text-text-secondary text-sm hover:text-text-primary transition-colors font-body">AI Mastermind</a></li>
        </ul>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="border-t border-border-subtle mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p class="text-text-muted text-xs font-body">&copy; 2026 Autom8Lab. All rights reserved.</p>
      <a href="https://calendly.com/cosminlungu/30min" target="_blank" rel="noopener noreferrer"
         class="text-accent hover:text-accent-hover text-xs font-body transition-colors">
        Book Your AI Audit &rarr;
      </a>
    </div>
  </div>
</footer>
```

- [ ] **Step 5: Create minimal index.ejs placeholder**

Create `views/index.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <%- include('partials/head') %>
</head>
<body class="bg-page text-text-primary font-body antialiased">

  <%- include('partials/nav') %>

  <main>
    <!-- Hero placeholder -->
    <section class="pt-32 pb-section min-h-screen flex items-center">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 class="text-5xl lg:text-7xl font-display font-black tracking-tight">
          AI Systems That Actually Work<br>For Your Business
        </h1>
        <p class="text-text-secondary text-lg mt-6 max-w-2xl font-body">Placeholder — sections will be built in subsequent tasks.</p>
      </div>
    </section>
  </main>

  <%- include('partials/footer') %>

  <script src="/js/nav.js"></script>
</body>
</html>
```

- [ ] **Step 6: Copy favicon to public assets**

```bash
mkdir -p /Users/cosmo/autom8-website/public/assets/logos
cp /Users/cosmo/autom8-website/assets/logos/favicon.svg /Users/cosmo/autom8-website/public/assets/logos/favicon.svg
```

- [ ] **Step 7: Build CSS and test dev server**

```bash
cd /Users/cosmo/autom8-website
npm run css:build
npm start
```

Visit http://localhost:3000 — should see the placeholder hero text, nav, and footer on a dark background. Verify fonts load (check Network tab). Kill server after confirming.

- [ ] **Step 8: Commit partials and placeholder page**

```bash
git add views/ public/assets/logos/favicon.svg
git commit -m "feat: add EJS partials (head, nav, footer) and placeholder homepage"
```

---

### Task 5: Create nav.js (sticky nav scroll behavior)

**Files:**
- Create: `public/js/nav.js`

- [ ] **Step 1: Create nav.js**

Create `public/js/nav.js`:

```js
/**
 * Sticky Nav — shrink + glassmorphic blur on scroll
 * Toggles classes on #main-nav based on scroll position.
 */
(function () {
  const nav = document.getElementById('main-nav');
  const navInner = document.getElementById('nav-inner');
  if (!nav || !navInner) return;

  const SCROLL_THRESHOLD = 50;

  function updateNav() {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;

    nav.classList.toggle('bg-page/80', scrolled);
    nav.classList.toggle('backdrop-blur-xl', scrolled);
    nav.classList.toggle('border-b', scrolled);
    nav.classList.toggle('border-border-subtle', scrolled);
    nav.classList.toggle('shadow-lg', scrolled);

    // Shrink height
    navInner.classList.toggle('h-20', !scrolled);
    navInner.classList.toggle('h-16', scrolled);
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuClose = document.getElementById('mobile-menu-close');
  const menu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('mobile-menu-overlay');
  const menuPanel = document.getElementById('mobile-menu-panel');

  function openMenu() {
    menu.classList.remove('hidden');
    requestAnimationFrame(() => {
      menuPanel.classList.remove('translate-x-full');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuPanel.classList.add('translate-x-full');
    setTimeout(() => {
      menu.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  // Close mobile menu when clicking a nav link
  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // Initial state
})();
```

- [ ] **Step 2: Test nav behavior**

Run dev server (`npm start`), scroll the page, verify:
- Nav starts transparent
- After 50px scroll, nav gets blur background and shrinks
- Mobile hamburger opens/closes the slide panel

- [ ] **Step 3: Commit**

```bash
git add public/js/nav.js
git commit -m "feat: add sticky nav with scroll-triggered blur and mobile menu"
```

---

## Chunk 2: Global Interactive Effects

### Task 6: Create dot grid background (Canvas)

**Files:**
- Create: `public/js/dot-grid.js`
- Modify: `views/index.ejs` (add canvas element + script)

- [ ] **Step 1: Create dot-grid.js**

Create `public/js/dot-grid.js`:

```js
/**
 * Interactive Dot Grid Background
 * Full-page canvas with dots that glow near the cursor.
 * On mobile (no pointer) or prefers-reduced-motion, renders static dots.
 */
(function () {
  const canvas = document.getElementById('dot-grid');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const GRID_SPACING = 40;
  const DOT_RADIUS = 1;
  const GLOW_RADIUS = 150;
  const BASE_ALPHA = 0.15;
  const GLOW_ALPHA = 0.6;
  const DOT_COLOR = { r: 59, g: 130, b: 246 }; // accent blue

  let mouse = { x: -9999, y: -9999 };
  let animFrame = null;
  let dots = [];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasPointer = window.matchMedia('(pointer: fine)').matches;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
    buildDots();
    draw();
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(canvas.width / GRID_SPACING);
    const rows = Math.ceil(canvas.height / GRID_SPACING);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: col * GRID_SPACING + GRID_SPACING / 2,
          y: row * GRID_SPACING + GRID_SPACING / 2,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const dot of dots) {
      let alpha = BASE_ALPHA;

      if (hasPointer && !prefersReducedMotion) {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < GLOW_RADIUS) {
          const factor = 1 - dist / GLOW_RADIUS;
          alpha = BASE_ALPHA + (GLOW_ALPHA - BASE_ALPHA) * factor * factor;
        }
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${alpha})`;
      ctx.fill();
    }
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;

    if (!animFrame) {
      animFrame = requestAnimationFrame(() => {
        draw();
        animFrame = null;
      });
    }
  }

  // Resize observer for dynamic content height changes
  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(document.documentElement);

  window.addEventListener('resize', resize, { passive: true });

  if (hasPointer && !prefersReducedMotion) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  resize();
})();
```

- [ ] **Step 2: Add canvas element to index.ejs**

In `views/index.ejs`, add the canvas just inside `<body>` (before nav):

```html
<!-- Dot Grid Background -->
<canvas id="dot-grid" class="fixed inset-0 z-0 pointer-events-none" aria-hidden="true"></canvas>
```

And add the script before `</body>`:

```html
<script src="/js/dot-grid.js"></script>
```

Also ensure all content has `relative z-10` or higher so it sits above the canvas.

- [ ] **Step 3: Test dot grid**

Run dev server, verify:
- Dots visible across entire page in a grid pattern
- Moving cursor makes nearby dots glow brighter
- Canvas resizes with window

- [ ] **Step 4: Commit**

```bash
git add public/js/dot-grid.js views/index.ejs
git commit -m "feat: add interactive dot grid canvas background with cursor glow"
```

---

### Task 7: Create cursor glow effect

**Files:**
- Modify: `views/index.ejs` (add cursor glow div)
- Modify: `src/input.css` (add cursor glow styles)

- [ ] **Step 1: Add cursor glow div to index.ejs**

Add right after the `<canvas>` element:

```html
<!-- Cursor Glow -->
<div id="cursor-glow" class="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-0 transition-opacity duration-300"
     style="background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%); transform: translate(-50%, -50%);"
     aria-hidden="true"></div>
```

- [ ] **Step 2: Add cursor glow JS**

Add to `public/js/dot-grid.js` (at the end, inside the IIFE), or create a small inline script. Simplest is to add to dot-grid.js since it already tracks the mouse:

Append to `public/js/dot-grid.js`, inside the IIFE, after the `resize()` call:

```js
  // Cursor glow follower
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && hasPointer && !prefersReducedMotion) {
    cursorGlow.style.opacity = '1';
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }, { passive: true });
  }
```

- [ ] **Step 3: Test cursor glow**

Run dev server. Move cursor — soft blue glow follows the mouse. Subtle, not distracting.

- [ ] **Step 4: Commit**

```bash
git add public/js/dot-grid.js views/index.ejs
git commit -m "feat: add cursor glow effect that follows mouse position"
```

---

### Task 8: Create magnetic button effect

**Files:**
- Create: `public/js/magnetic.js`

- [ ] **Step 1: Create magnetic.js**

Create `public/js/magnetic.js`:

```js
/**
 * Magnetic Buttons
 * CTA buttons with [data-magnetic] pull slightly toward cursor on proximity.
 * Respects prefers-reduced-motion.
 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const PROXIMITY = 50; // px range to activate
  const STRENGTH = 0.3; // multiplier (0-1)

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.style.transition = 'transform 0.3s ease-out';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(rect.width, rect.height) / 2 + PROXIMITY;

      if (dist < maxDist) {
        el.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();
```

- [ ] **Step 2: Add script to index.ejs**

Add before `</body>`:

```html
<script src="/js/magnetic.js"></script>
```

- [ ] **Step 3: Test magnetic buttons**

The "Book a Call" nav button already has `data-magnetic`. Hover near it — it should pull slightly toward cursor.

- [ ] **Step 4: Commit**

```bash
git add public/js/magnetic.js views/index.ejs
git commit -m "feat: add magnetic button hover effect for CTA buttons"
```

---

### Task 9: Create 3D card tilt effect

**Files:**
- Create: `public/js/tilt.js`

- [ ] **Step 1: Create tilt.js**

Create `public/js/tilt.js`:

```js
/**
 * 3D Card Tilt
 * Elements with [data-tilt] get a subtle 3D tilt following mouse position.
 * Max tilt: 6 degrees. Respects prefers-reduced-motion.
 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const MAX_TILT = 6; // degrees

  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.15s ease-out';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0-1
      const y = (e.clientY - rect.top) / rect.height;   // 0-1
      const rotateX = (0.5 - y) * MAX_TILT * 2;
      const rotateY = (x - 0.5) * MAX_TILT * 2;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    });
  });
})();
```

- [ ] **Step 2: Add script to index.ejs**

Add before `</body>`:

```html
<script src="/js/tilt.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add public/js/tilt.js views/index.ejs
git commit -m "feat: add 3D card tilt effect for service cards"
```

---

## Chunk 3: Homepage Sections (Hero, Services, Process)

### Task 10: Build Hero section

**Files:**
- Modify: `views/index.ejs` (replace placeholder hero with full implementation)
- Create: `public/js/hero-nodes.js` (abstract node animation for hero right column)

- [ ] **Step 1: Create hero node graph animation**

Create `public/js/hero-nodes.js`:

```js
/**
 * Hero Node Graph — abstract animated visualization
 * Canvas-based connected nodes with gentle ambient motion.
 */
(function () {
  const canvas = document.getElementById('hero-nodes');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let nodes = [];
  const NODE_COUNT = 30;
  const CONNECTION_DIST = 120;

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    if (nodes.length === 0) initNodes();
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.2;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.fill();

      // Subtle glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.fill();
    }
  }

  function update() {
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off edges
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
    }
  }

  function animate() {
    update();
    draw();
    if (!prefersReducedMotion) {
      requestAnimationFrame(animate);
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  if (prefersReducedMotion) {
    draw(); // Single static frame
  } else {
    animate();
  }
})();
```

- [ ] **Step 2: Build the Hero section in index.ejs**

Replace the placeholder hero in `views/index.ejs` with the full hero section:

```html
<!-- ========== HERO ========== -->
<section id="hero" class="relative pt-32 pb-section-sm lg:pb-section min-h-screen flex items-center">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

      <!-- Left: Text -->
      <div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black tracking-tight leading-[1.1]"
            data-hero-anim="headline">
          AI Systems That Actually Work
          <span class="text-accent">For Your Business</span>
        </h1>

        <p class="text-text-secondary text-lg lg:text-xl mt-6 max-w-xl font-body leading-relaxed"
           data-hero-anim="sub">
          I help businesses implement AI that saves time, recovers revenue, and scales operations — without replacing the tools you already use.
        </p>

        <!-- Certified badge -->
        <div class="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full border border-accent-warm/30 bg-accent-warm/5"
             data-hero-anim="sub">
          <span class="w-2 h-2 rounded-full bg-accent-warm"></span>
          <span class="text-accent-warm text-xs font-body font-medium tracking-wide uppercase">Certified Claude Architect</span>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 mt-10" data-hero-anim="cta">
          <a href="https://calendly.com/cosminlungu/30min" target="_blank" rel="noopener noreferrer"
             class="px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all text-center"
             data-magnetic>
            Book a Free Consultation
          </a>
          <a href="#services"
             class="px-8 py-4 border border-border-subtle hover:border-text-muted text-text-secondary hover:text-text-primary font-semibold rounded-xl transition-all text-center">
            See Services
          </a>
        </div>
      </div>

      <!-- Right: Node Graph -->
      <div class="relative h-[400px] lg:h-[500px] hidden lg:block">
        <canvas id="hero-nodes" class="absolute inset-0 w-full h-full" aria-hidden="true"></canvas>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 3: Add hero-nodes.js script to index.ejs**

Add before `</body>`:

```html
<script src="/js/hero-nodes.js"></script>
```

- [ ] **Step 4: Test hero**

Run dev server. Verify:
- Headline, sub-copy, badge, and CTAs render correctly
- Node graph animates on the right (desktop only)
- "Book a Free Consultation" opens Calendly in new tab
- "See Services" smooth scrolls (won't work yet since #services doesn't exist, but the link is correct)

- [ ] **Step 5: Commit**

```bash
git add views/index.ejs public/js/hero-nodes.js
git commit -m "feat: build hero section with animated node graph and consultant copy"
```

---

### Task 11: Build Services section

**Files:**
- Modify: `views/index.ejs` (add services section after hero)

- [ ] **Step 1: Add Services section to index.ejs**

Add after the hero `</section>`, still inside `<main>`:

```html
<!-- ========== SERVICES ========== -->
<section id="services" class="relative py-section-sm lg:py-section z-10">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">

    <div class="text-center mb-16">
      <span class="inline-block text-xs font-body font-medium text-accent uppercase tracking-[0.2em] mb-4">What I Build</span>
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">Services</h2>
    </div>

    <!-- Hero Card: AI Agents -->
    <div class="glass-card p-8 lg:p-12 mb-6" data-tilt data-service-card>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <div class="inline-flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="m2 14 6-6 6 6 6-6"/></svg>
            <span class="text-xs font-body font-medium text-accent uppercase tracking-[0.2em]">Primary Service</span>
          </div>
          <h3 class="text-2xl lg:text-3xl font-display font-bold mb-4">AI Agents</h3>
          <p class="text-text-secondary font-body leading-relaxed text-lg">
            Custom AI agents that handle leads, support, scheduling, and operations autonomously. They work 24/7, respond in seconds, and plug into your existing tools.
          </p>
          <a href="https://calendly.com/cosminlungu/30min" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium mt-6 transition-colors">
            Learn more <span>&rarr;</span>
          </a>
        </div>
        <div class="h-48 lg:h-64 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/10 flex items-center justify-center">
          <span class="text-text-muted text-sm font-body">Agent Workflow Visual</span>
        </div>
      </div>
    </div>

    <!-- 3 Standard Service Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Workflow Automations -->
      <div class="glass-card p-8" data-tilt data-service-card>
        <svg class="w-8 h-8 text-accent mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44H2.17A2.18 2.18 0 0 1 0 17.76V6.24A2.18 2.18 0 0 1 2.17 4.06h4.87A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44h4.87A2.18 2.18 0 0 0 24 17.76V6.24a2.18 2.18 0 0 0-2.17-2.18h-4.87A2.5 2.5 0 0 0 14.5 2z"/></svg>
        <h3 class="text-xl font-display font-bold mb-3">Workflow Automations</h3>
        <p class="text-text-secondary font-body text-sm leading-relaxed">
          Connect your existing tools, eliminate manual data entry, and automate task routing between people and systems.
        </p>
      </div>

      <!-- AI Trainings -->
      <div class="glass-card p-8" data-tilt data-service-card>
        <svg class="w-8 h-8 text-accent mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5"/></svg>
        <h3 class="text-xl font-display font-bold mb-3">AI Trainings</h3>
        <p class="text-text-secondary font-body text-sm leading-relaxed">
          Staff training on AI tools and workflows. Led by a Certified Claude Architect. Get your team fluent in the AI tools that matter.
        </p>
        <div class="inline-flex items-center gap-1.5 mt-3 px-2 py-1 rounded-md border border-accent-warm/30 bg-accent-warm/5">
          <span class="w-1.5 h-1.5 rounded-full bg-accent-warm"></span>
          <span class="text-accent-warm text-[10px] font-body font-medium tracking-wide uppercase">Certified Claude Architect</span>
        </div>
      </div>

      <!-- AI Strategy -->
      <div class="glass-card p-8" data-tilt data-service-card>
        <svg class="w-8 h-8 text-accent mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        <h3 class="text-xl font-display font-bold mb-3">AI Strategy</h3>
        <p class="text-text-secondary font-body text-sm leading-relaxed">
          Consulting and roadmapping to identify where AI fits in your operations. Get clarity before you spend a dollar on implementation.
        </p>
      </div>

    </div>

    <p class="text-text-muted text-sm text-center mt-8 font-body">Everything builds on top of your existing tools. No heavy migrations.</p>

  </div>
</section>
```

- [ ] **Step 2: Rebuild CSS and test**

```bash
npm run css:build && npm start
```

Verify: 4 service cards render — AI Agents full-width on top, 3 cards in a row below. Cards have glassmorphic style. Tilt effect works on hover (desktop).

- [ ] **Step 3: Commit**

```bash
git add views/index.ejs
git commit -m "feat: build services section with featured AI Agents card and 3 service cards"
```

---

### Task 12: Build Process Timeline section

**Files:**
- Modify: `views/index.ejs` (add process section)
- Modify: `src/input.css` (add timeline CSS)

- [ ] **Step 1: Add timeline CSS to input.css**

Add to `src/input.css` inside the `@layer components` block:

```css
  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border-subtle);
    transform: translateX(-50%);
  }

  .timeline-line-fill {
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 0;
    background: var(--accent);
    transform: translateX(-50%);
    transition: height 0.1s linear;
  }

  @media (max-width: 767px) {
    .timeline-line,
    .timeline-line-fill {
      left: 1rem;
    }
  }
```

- [ ] **Step 2: Add Process section to index.ejs**

Add after the services `</section>`:

```html
<!-- ========== PROCESS ========== -->
<section id="process" class="relative py-section-sm lg:py-section z-10">
  <div class="max-w-5xl mx-auto px-6 lg:px-8">

    <div class="text-center mb-20">
      <span class="inline-block text-xs font-body font-medium text-accent uppercase tracking-[0.2em] mb-4">How It Works</span>
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">The Process</h2>
    </div>

    <!-- Timeline -->
    <div class="relative" id="timeline">
      <div class="timeline-line"></div>
      <div class="timeline-line-fill" id="timeline-fill"></div>

      <div class="space-y-24">

        <!-- Step 01 -->
        <div class="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16" data-timeline-step>
          <div class="md:text-right md:pr-12">
            <div class="glass-card p-8">
              <span class="text-xs font-body font-medium text-accent uppercase tracking-[0.15em] inline-block px-3 py-1 rounded-full bg-accent/10 mb-4">Free 30-Min Call</span>
              <h3 class="text-xl font-display font-bold mb-3">AI Audit</h3>
              <p class="text-text-secondary font-body text-sm leading-relaxed">
                We map your operations, identify where time and revenue are leaking, and project the ROI of automation.
              </p>
            </div>
          </div>
          <div class="hidden md:block"></div>
          <!-- Center dot -->
          <div class="absolute left-4 md:left-1/2 top-8 w-8 h-8 -ml-4 rounded-full bg-page border-2 border-accent flex items-center justify-center z-10" data-timeline-dot>
            <span class="text-accent text-xs font-display font-bold">01</span>
          </div>
        </div>

        <!-- Step 02 -->
        <div class="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16" data-timeline-step>
          <div class="hidden md:block"></div>
          <div class="md:pl-12">
            <div class="glass-card p-8">
              <span class="text-xs font-body font-medium text-accent uppercase tracking-[0.15em] inline-block px-3 py-1 rounded-full bg-accent/10 mb-4">Deliverable: Technical Spec</span>
              <h3 class="text-xl font-display font-bold mb-3">System Design</h3>
              <p class="text-text-secondary font-body text-sm leading-relaxed">
                I build the roadmap, define scope, and set a clear timeline. You get a technical spec — not a vague proposal.
              </p>
            </div>
          </div>
          <div class="absolute left-4 md:left-1/2 top-8 w-8 h-8 -ml-4 rounded-full bg-page border-2 border-accent flex items-center justify-center z-10" data-timeline-dot>
            <span class="text-accent text-xs font-display font-bold">02</span>
          </div>
        </div>

        <!-- Step 03 -->
        <div class="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16" data-timeline-step>
          <div class="md:text-right md:pr-12">
            <div class="glass-card p-8">
              <span class="text-xs font-body font-medium text-accent uppercase tracking-[0.15em] inline-block px-3 py-1 rounded-full bg-accent/10 mb-4">Live in ~14 Days</span>
              <h3 class="text-xl font-display font-bold mb-3">Implementation</h3>
              <p class="text-text-secondary font-body text-sm leading-relaxed">
                I build and integrate the systems on your current stack. No heavy migrations, no disruption to your team.
              </p>
            </div>
          </div>
          <div class="hidden md:block"></div>
          <div class="absolute left-4 md:left-1/2 top-8 w-8 h-8 -ml-4 rounded-full bg-page border-2 border-accent flex items-center justify-center z-10" data-timeline-dot>
            <span class="text-accent text-xs font-display font-bold">03</span>
          </div>
        </div>

        <!-- Step 04 -->
        <div class="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16" data-timeline-step>
          <div class="hidden md:block"></div>
          <div class="md:pl-12">
            <div class="glass-card p-8">
              <span class="text-xs font-body font-medium text-accent uppercase tracking-[0.15em] inline-block px-3 py-1 rounded-full bg-accent/10 mb-4">Monthly Reviews</span>
              <h3 class="text-xl font-display font-bold mb-3">Optimization</h3>
              <p class="text-text-secondary font-body text-sm leading-relaxed">
                AI evolves fast. I stay involved to improve performance, expand what's working, and keep systems aligned with how your business grows.
              </p>
            </div>
          </div>
          <div class="absolute left-4 md:left-1/2 top-8 w-8 h-8 -ml-4 rounded-full bg-page border-2 border-accent flex items-center justify-center z-10" data-timeline-dot>
            <span class="text-accent text-xs font-display font-bold">04</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>
```

- [ ] **Step 3: Rebuild CSS and test**

```bash
npm run css:build && npm start
```

Verify: 4 process steps alternate left/right on desktop, stack vertically on mobile. Center line visible. Step numbers in blue circles.

- [ ] **Step 4: Commit**

```bash
git add views/index.ejs src/input.css
git commit -m "feat: build process timeline section with alternating steps and centerline"
```

---

## Chunk 4: Homepage Sections (Results, Contact, FAQ) + GSAP Animations

### Task 13: Build Results section

**Files:**
- Modify: `views/index.ejs` (add results section)

- [ ] **Step 1: Add Results section to index.ejs**

Add after the process `</section>`:

```html
<!-- ========== RESULTS ========== -->
<section id="results" class="relative py-section-sm lg:py-section z-10">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">

    <div class="text-center mb-16">
      <span class="inline-block text-xs font-body font-medium text-accent uppercase tracking-[0.2em] mb-4">Results</span>
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">Real Businesses. Real Outcomes.</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Healthcare -->
      <a href="/case-studies/specialty-clinic" class="glass-card p-8 hover:border-accent/30 transition-all duration-300 block group" data-result-card>
        <span class="text-xs font-body font-medium text-accent uppercase tracking-[0.2em]">Healthcare</span>
        <h3 class="text-lg font-display font-semibold mt-3 mb-6">Specialty Clinic, Florida</h3>
        <div class="space-y-4 mb-6">
          <div>
            <div class="text-3xl font-display font-bold">
              <span data-count-from="55" data-count-to="70" data-count-suffix="%" data-count-prefix="">55</span><span class="text-text-muted mx-2">&rarr;</span><span class="text-accent">70%</span>
            </div>
            <div class="text-xs text-text-muted font-body mt-1">Treatment completion</div>
          </div>
          <div class="flex gap-6 text-sm">
            <div>
              <div class="text-text-primary font-semibold">&lt;2 hrs</div>
              <div class="text-xs text-text-muted font-body">Lead response</div>
            </div>
            <div>
              <div class="text-text-primary font-semibold">&darr;12%</div>
              <div class="text-xs text-text-muted font-body">Missed appts</div>
            </div>
          </div>
        </div>
        <span class="text-sm text-accent group-hover:text-accent-hover transition-colors font-body">Read case study &rarr;</span>
      </a>

      <!-- Construction -->
      <a href="/case-studies/general-contractor" class="glass-card p-8 hover:border-accent/30 transition-all duration-300 block group" data-result-card>
        <span class="text-xs font-body font-medium text-accent uppercase tracking-[0.2em]">Construction</span>
        <h3 class="text-lg font-display font-semibold mt-3 mb-6">GC Contractor, Phoenix</h3>
        <div class="space-y-4 mb-6">
          <div>
            <div class="text-3xl font-display font-bold">
              $<span data-count-to="47" data-count-suffix="K">0</span>
            </div>
            <div class="text-xs text-text-muted font-body mt-1">Recovered in unbilled work</div>
          </div>
          <div class="flex gap-6 text-sm">
            <div>
              <div class="text-text-primary font-semibold">2.1 days</div>
              <div class="text-xs text-text-muted font-body">RFI response</div>
            </div>
            <div>
              <div class="text-text-primary font-semibold">&darr;6 hrs/wk</div>
              <div class="text-xs text-text-muted font-body">Field downtime</div>
            </div>
          </div>
        </div>
        <span class="text-sm text-accent group-hover:text-accent-hover transition-colors font-body">Read case study &rarr;</span>
      </a>

      <!-- Property Management -->
      <a href="/case-studies/property-management" class="glass-card p-8 hover:border-accent/30 transition-all duration-300 block group" data-result-card>
        <span class="text-xs font-body font-medium text-accent uppercase tracking-[0.2em]">Property Management</span>
        <h3 class="text-lg font-display font-semibold mt-3 mb-6">PM Company, Tampa</h3>
        <div class="space-y-4 mb-6">
          <div>
            <div class="text-3xl font-display font-bold">
              <span data-count-to="11" data-count-suffix="+">0</span> <span class="text-lg font-normal text-text-secondary">hrs/wk</span>
            </div>
            <div class="text-xs text-text-muted font-body mt-1">Owner time saved</div>
          </div>
          <div class="flex gap-6 text-sm">
            <div>
              <div class="text-text-primary font-semibold">1.1 days</div>
              <div class="text-xs text-text-muted font-body">Maintenance resp.</div>
            </div>
            <div>
              <div class="text-text-primary font-semibold">71% &rarr; 84%</div>
              <div class="text-xs text-text-muted font-body">Tenant renewals</div>
            </div>
          </div>
        </div>
        <span class="text-sm text-accent group-hover:text-accent-hover transition-colors font-body">Read case study &rarr;</span>
      </a>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Test results section**

Rebuild CSS and check: 3 cards in a row, glassmorphic, with metrics displayed.

- [ ] **Step 3: Commit**

```bash
git add views/index.ejs
git commit -m "feat: build results section with 3 case study cards and metric data"
```

---

### Task 14: Build Contact Form section

**Files:**
- Modify: `views/index.ejs` (add contact section)
- Create: `public/js/form.js` (client-side validation + submission)

- [ ] **Step 1: Add Contact section to index.ejs**

Add after the results `</section>`:

```html
<!-- ========== CONTACT ========== -->
<section id="contact" class="relative py-section-sm lg:py-section z-10">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">

    <div class="text-center mb-16">
      <span class="inline-block text-xs font-body font-medium text-accent uppercase tracking-[0.2em] mb-4">Get Started</span>
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">Let's Talk About Your Business</h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

      <!-- Left Sidebar (2 cols) -->
      <div class="lg:col-span-2" data-contact-sidebar>
        <h3 class="text-xl font-display font-semibold mb-6">What to expect</h3>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span class="text-text-secondary font-body text-sm">Free consultation — no strings attached</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span class="text-text-secondary font-body text-sm">Response within 24 hours</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span class="text-text-secondary font-body text-sm">No obligation to proceed</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span class="text-text-secondary font-body text-sm">Clear ROI projection for your business</span>
          </li>
        </ul>

        <div class="mt-8 pt-8 border-t border-border-subtle">
          <p class="text-text-muted text-sm font-body">Prefer email?</p>
          <a href="mailto:cosmo@autom8lab.com" class="text-accent hover:text-accent-hover text-sm font-body transition-colors">cosmo@autom8lab.com</a>
        </div>

        <div class="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-warm/30 bg-accent-warm/5">
          <span class="w-2 h-2 rounded-full bg-accent-warm"></span>
          <span class="text-accent-warm text-xs font-body font-medium tracking-wide uppercase">Certified Claude Architect</span>
        </div>
      </div>

      <!-- Right Form (3 cols) -->
      <div class="lg:col-span-3" data-contact-form>
        <form id="contact-form" class="glass-card p-8 lg:p-10 space-y-6" novalidate>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-body font-medium text-text-secondary mb-2">Name <span class="text-red-400">*</span></label>
              <input type="text" id="name" name="name" required
                     class="w-full bg-page border border-border-subtle rounded-lg px-4 py-3 text-text-primary font-body text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                     placeholder="Your name">
              <p class="text-red-400 text-xs mt-1 hidden" data-error="name"></p>
            </div>
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-body font-medium text-text-secondary mb-2">Email <span class="text-red-400">*</span></label>
              <input type="email" id="email" name="email" required
                     class="w-full bg-page border border-border-subtle rounded-lg px-4 py-3 text-text-primary font-body text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                     placeholder="you@company.com">
              <p class="text-red-400 text-xs mt-1 hidden" data-error="email"></p>
            </div>
          </div>

          <!-- Website -->
          <div>
            <label for="website" class="block text-sm font-body font-medium text-text-secondary mb-2">Website <span class="text-text-muted">(optional)</span></label>
            <input type="url" id="website" name="website"
                   class="w-full bg-page border border-border-subtle rounded-lg px-4 py-3 text-text-primary font-body text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                   placeholder="https://yourcompany.com">
          </div>

          <!-- Industry chips -->
          <div>
            <label class="block text-sm font-body font-medium text-text-secondary mb-3">Industry <span class="text-red-400">*</span></label>
            <div class="flex flex-wrap gap-2" data-chip-group="industry">
              <button type="button" class="chip px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-body hover:border-accent hover:text-accent transition-colors" data-value="Healthcare">Healthcare</button>
              <button type="button" class="chip px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-body hover:border-accent hover:text-accent transition-colors" data-value="Construction">Construction</button>
              <button type="button" class="chip px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-body hover:border-accent hover:text-accent transition-colors" data-value="Property Management">Property Mgmt</button>
              <button type="button" class="chip px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-body hover:border-accent hover:text-accent transition-colors" data-value="Professional Services">Professional Services</button>
              <button type="button" class="chip px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-body hover:border-accent hover:text-accent transition-colors" data-value="Other">Other</button>
            </div>
            <input type="hidden" name="industry" id="industry-input">
            <p class="text-red-400 text-xs mt-1 hidden" data-error="industry"></p>
          </div>

          <!-- Budget chips -->
          <div>
            <label class="block text-sm font-body font-medium text-text-secondary mb-3">Budget Range <span class="text-text-muted">(optional)</span></label>
            <div class="flex flex-wrap gap-2" data-chip-group="budget">
              <button type="button" class="chip px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-body hover:border-accent hover:text-accent transition-colors" data-value="Under $5K">Under $5K</button>
              <button type="button" class="chip px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-body hover:border-accent hover:text-accent transition-colors" data-value="$5K-$10K">$5K–$10K</button>
              <button type="button" class="chip px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-body hover:border-accent hover:text-accent transition-colors" data-value="$10K-$25K">$10K–$25K</button>
              <button type="button" class="chip px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-body hover:border-accent hover:text-accent transition-colors" data-value="$25K+">$25K+</button>
            </div>
            <input type="hidden" name="budget" id="budget-input">
          </div>

          <!-- Challenge -->
          <div>
            <label for="challenge" class="block text-sm font-body font-medium text-text-secondary mb-2">Biggest Challenge <span class="text-red-400">*</span></label>
            <textarea id="challenge" name="challenge" rows="4" required
                      class="w-full bg-page border border-border-subtle rounded-lg px-4 py-3 text-text-primary font-body text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                      placeholder="What's the biggest operational bottleneck you'd like AI to solve?"></textarea>
            <p class="text-red-400 text-xs mt-1 hidden" data-error="challenge"></p>
          </div>

          <!-- Submit -->
          <button type="submit"
                  class="w-full px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all text-center"
                  data-magnetic>
            Book Your Free AI Audit
          </button>

          <!-- Success message (hidden by default) -->
          <div id="form-success" class="hidden text-center py-8">
            <svg class="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h3 class="text-xl font-display font-bold mb-2">Message sent!</h3>
            <p class="text-text-secondary font-body text-sm">I'll get back to you within 24 hours.</p>
          </div>

        </form>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Create form.js with validation and chip selection**

Create `public/js/form.js`:

```js
/**
 * Contact Form — chip selection, validation, and submission
 */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Chip group selection
  document.querySelectorAll('[data-chip-group]').forEach((group) => {
    const groupName = group.dataset.chipGroup;
    const hiddenInput = document.getElementById(groupName + '-input');

    group.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        // Toggle active state
        const wasActive = chip.classList.contains('bg-accent/20');

        // Deselect all in group
        group.querySelectorAll('.chip').forEach((c) => {
          c.classList.remove('bg-accent/20', 'border-accent', 'text-accent');
          c.classList.add('border-border-subtle', 'text-text-secondary');
        });

        if (!wasActive) {
          chip.classList.add('bg-accent/20', 'border-accent', 'text-accent');
          chip.classList.remove('border-border-subtle', 'text-text-secondary');
          if (hiddenInput) hiddenInput.value = chip.dataset.value;
        } else {
          if (hiddenInput) hiddenInput.value = '';
        }
      });
    });
  });

  // Validation
  function showError(fieldName, message) {
    const errorEl = form.querySelector(`[data-error="${fieldName}"]`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (input) input.classList.add('border-red-400');
  }

  function clearErrors() {
    form.querySelectorAll('[data-error]').forEach((el) => {
      el.classList.add('hidden');
      el.textContent = '';
    });
    form.querySelectorAll('.border-red-400').forEach((el) => {
      el.classList.remove('border-red-400');
    });
  }

  function validate() {
    clearErrors();
    let valid = true;

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const industry = form.querySelector('[name="industry"]').value;
    const challenge = form.querySelector('[name="challenge"]').value.trim();

    if (!name) { showError('name', 'Name is required'); valid = false; }
    if (!email) { showError('email', 'Email is required'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Please enter a valid email'); valid = false; }
    if (!industry) { showError('industry', 'Please select an industry'); valid = false; }
    if (!challenge) { showError('challenge', 'Please describe your challenge'); valid = false; }

    return valid;
  }

  // Inline validation on blur
  ['name', 'email', 'challenge'].forEach((fieldName) => {
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (input) {
      input.addEventListener('blur', () => {
        const errorEl = form.querySelector(`[data-error="${fieldName}"]`);
        if (errorEl && !errorEl.classList.contains('hidden')) {
          // Re-validate just this field
          validate();
        }
      });
    }
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = {
      name: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      website: form.querySelector('[name="website"]').value.trim(),
      industry: form.querySelector('[name="industry"]').value,
      budget: form.querySelector('[name="budget"]').value,
      challenge: form.querySelector('[name="challenge"]').value.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        form.querySelector('#form-success').classList.remove('hidden');
        form.querySelectorAll('.space-y-6 > *:not(#form-success)').forEach((el) => {
          el.style.display = 'none';
        });
      } else {
        const data = await res.json();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Your Free AI Audit';
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, msg]) => showError(field, msg));
        }
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book Your Free AI Audit';
      alert('Something went wrong. Please try again or email cosmo@autom8lab.com');
    }
  });
})();
```

- [ ] **Step 3: Add form.js to index.ejs**

Add before `</body>`:

```html
<script src="/js/form.js"></script>
```

- [ ] **Step 4: Commit**

```bash
git add views/index.ejs public/js/form.js
git commit -m "feat: build contact form section with chip selectors and client-side validation"
```

---

### Task 15: Build FAQ section

**Files:**
- Modify: `views/index.ejs` (add FAQ section)
- Modify: `src/input.css` (add FAQ accordion styles)

- [ ] **Step 1: Add FAQ styles to input.css**

Add inside `@layer components`:

```css
  /* FAQ accordion */
  details.faq-item summary {
    list-style: none;
  }
  details.faq-item summary::-webkit-details-marker {
    display: none;
  }
  details.faq-item summary .faq-icon {
    transition: transform 0.3s ease;
  }
  details.faq-item[open] summary .faq-icon {
    transform: rotate(45deg);
  }
```

- [ ] **Step 2: Add FAQ section to index.ejs**

Add after the contact `</section>`:

```html
<!-- ========== FAQ ========== -->
<section id="faq" class="relative py-section-sm lg:py-section z-10">
  <div class="max-w-3xl mx-auto px-6 lg:px-8">

    <div class="text-center mb-16">
      <span class="inline-block text-xs font-body font-medium text-accent uppercase tracking-[0.2em] mb-4">FAQ</span>
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">Common Questions</h2>
    </div>

    <div class="space-y-4" data-faq-list>

      <details class="faq-item glass-card overflow-hidden">
        <summary class="px-8 py-6 cursor-pointer text-text-primary font-display font-semibold flex justify-between items-center">
          Do we need to replace our software?
          <span class="faq-icon text-text-muted text-xl leading-none ml-4 shrink-0">+</span>
        </summary>
        <div class="px-8 pb-6 text-text-secondary font-body leading-relaxed">
          No. Everything I build sits on top of your existing tools. Your CRM, project management software, email — they all stay. I connect them and make them work together with AI.
        </div>
      </details>

      <details class="faq-item glass-card overflow-hidden">
        <summary class="px-8 py-6 cursor-pointer text-text-primary font-display font-semibold flex justify-between items-center">
          Is this consulting or implementation?
          <span class="faq-icon text-text-muted text-xl leading-none ml-4 shrink-0">+</span>
        </summary>
        <div class="px-8 pb-6 text-text-secondary font-body leading-relaxed">
          Both. I build and install working systems — not slide decks. You get real infrastructure that runs, not a PDF of recommendations. Strategy informs the build, but you walk away with something live.
        </div>
      </details>

      <details class="faq-item glass-card overflow-hidden">
        <summary class="px-8 py-6 cursor-pointer text-text-primary font-display font-semibold flex justify-between items-center">
          How quickly can this go live?
          <span class="faq-icon text-text-muted text-xl leading-none ml-4 shrink-0">+</span>
        </summary>
        <div class="px-8 pb-6 text-text-secondary font-body leading-relaxed">
          Most core systems are running within about 14 days. Simple automations can go live even faster. Complex multi-system builds might take a few weeks longer, but you'll see progress from day one.
        </div>
      </details>

      <details class="faq-item glass-card overflow-hidden">
        <summary class="px-8 py-6 cursor-pointer text-text-primary font-display font-semibold flex justify-between items-center">
          What does this cost?
          <span class="faq-icon text-text-muted text-xl leading-none ml-4 shrink-0">+</span>
        </summary>
        <div class="px-8 pb-6 text-text-secondary font-body leading-relaxed">
          Implementations typically range from $5K–$10K depending on scope. Ongoing optimization is a monthly retainer. You'll get exact numbers after the audit — no surprises.
        </div>
      </details>

    </div>

  </div>
</section>
```

- [ ] **Step 3: Rebuild CSS and test**

```bash
npm run css:build && npm start
```

Verify: FAQ accordions open/close, + icon rotates to x, glassmorphic styling.

- [ ] **Step 4: Commit**

```bash
git add views/index.ejs src/input.css
git commit -m "feat: build FAQ section with styled accordions"
```

---

### Task 16: Create serverless contact form handler

**Files:**
- Create: `api/contact.js`

- [ ] **Step 1: Create api directory and contact handler**

```bash
mkdir -p /Users/cosmo/autom8-website/api
```

Create `api/contact.js`:

```js
/**
 * Contact Form Handler — Vercel Serverless Function
 * POST /api/contact
 *
 * Validates required fields and returns success.
 * TODO: Integrate MailerLite (mailing list)
 * TODO: Integrate Notion (lead database)
 * TODO: Integrate calendar booking
 * TODO: Send confirmation email to submitter
 */
module.exports = async (req, res) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, industry, challenge, website, budget } = req.body || {};

  // Validate required fields
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Name is required';
  if (!email || !email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email';
  if (!industry) errors.industry = 'Please select an industry';
  if (!challenge || !challenge.trim()) errors.challenge = 'Please describe your challenge';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Log submission (placeholder)
  console.log('📬 New contact form submission:', {
    name: name.trim(),
    email: email.trim(),
    website: website?.trim() || '',
    industry,
    budget: budget || 'Not specified',
    challenge: challenge.trim(),
    timestamp: new Date().toISOString(),
  });

  // TODO: Add MailerLite integration here
  // TODO: Add Notion database entry here
  // TODO: Send confirmation email here

  return res.status(200).json({
    success: true,
    message: 'Thank you! I\'ll get back to you within 24 hours.',
  });
};
```

- [ ] **Step 2: Add local dev route for form testing**

Add to `server.js`, before the `module.exports` line:

```js
// Local dev: proxy /api/contact to the serverless function
const contactHandler = require('./api/contact');
app.post('/api/contact', (req, res) => contactHandler(req, res));
```

- [ ] **Step 3: Test form submission locally**

```bash
npm start
```

Submit the form on http://localhost:3000 — should show success message. Check server console for the log output.

- [ ] **Step 4: Commit**

```bash
git add api/contact.js server.js
git commit -m "feat: add contact form serverless handler with validation placeholder"
```

---

### Task 17: Install GSAP and create animations.js

**Files:**
- Modify: `package.json` (add GSAP)
- Create: `public/js/animations.js`
- Modify: `views/index.ejs` (add GSAP script tags)

- [ ] **Step 1: Install GSAP**

```bash
cd /Users/cosmo/autom8-website
npm install gsap
```

- [ ] **Step 2: Copy GSAP to public directory**

Since this is a non-bundled setup (no webpack/vite), we need GSAP accessible as client-side scripts. Copy from node_modules:

```bash
mkdir -p /Users/cosmo/autom8-website/public/vendor
cp node_modules/gsap/dist/gsap.min.js /Users/cosmo/autom8-website/public/vendor/
cp node_modules/gsap/dist/ScrollTrigger.min.js /Users/cosmo/autom8-website/public/vendor/
```

- [ ] **Step 3: Add GSAP scripts to index.ejs**

Add before the other `<script>` tags, near `</body>`:

```html
<!-- GSAP -->
<script src="/vendor/gsap.min.js"></script>
<script src="/vendor/ScrollTrigger.min.js"></script>
<script>gsap.registerPlugin(ScrollTrigger);</script>
```

- [ ] **Step 4: Create animations.js**

Create `public/js/animations.js`:

```js
/**
 * GSAP ScrollTrigger Animations
 * Each section has its own animation function for maintainability.
 * All animations fire once (no replay on scroll back).
 * Respects prefers-reduced-motion.
 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // ---- HERO ----
  function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('[data-hero-anim="headline"]', {
      y: 40, opacity: 0, duration: 0.8,
    })
    .from('[data-hero-anim="sub"]', {
      y: 30, opacity: 0, duration: 0.7,
    }, '-=0.5')
    .from('[data-hero-anim="cta"]', {
      y: 20, opacity: 0, duration: 0.6,
    }, '-=0.4');
  }

  // ---- SERVICES ----
  function animateServices() {
    // Large hero card
    gsap.from('[data-service-card]:first-child', {
      scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
        once: true,
      },
      y: 60, opacity: 0, duration: 0.8, ease: 'power3.out',
    });

    // 3 smaller cards with stagger
    gsap.from('#services .grid-cols-3 [data-service-card]', {
      scrollTrigger: {
        trigger: '#services .grid-cols-3',
        start: 'top 80%',
        once: true,
      },
      y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
    });
  }

  // ---- PROCESS TIMELINE ----
  function animateTimeline() {
    const fill = document.getElementById('timeline-fill');
    const timeline = document.getElementById('timeline');
    if (!fill || !timeline) return;

    // Line draw
    ScrollTrigger.create({
      trigger: timeline,
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 0.5,
      onUpdate: (self) => {
        fill.style.height = (self.progress * 100) + '%';
      },
    });

    // Step cards — alternate slide direction
    const steps = document.querySelectorAll('[data-timeline-step]');
    steps.forEach((step, i) => {
      const fromLeft = i % 2 === 0;
      gsap.from(step.querySelector('.glass-card'), {
        scrollTrigger: {
          trigger: step,
          start: 'top 80%',
          once: true,
        },
        x: fromLeft ? -60 : 60,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });

      // Dot pulse
      gsap.from(step.querySelector('[data-timeline-dot]'), {
        scrollTrigger: {
          trigger: step,
          start: 'top 80%',
          once: true,
        },
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
    });
  }

  // ---- RESULTS ----
  function animateResults() {
    // Card entrance with stagger
    gsap.from('[data-result-card]', {
      scrollTrigger: {
        trigger: '#results',
        start: 'top 80%',
        once: true,
      },
      y: 50, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
    });

    // Metric count-up
    document.querySelectorAll('[data-count-to]').forEach((el) => {
      const target = parseInt(el.dataset.countTo);
      const suffix = el.dataset.countSuffix || '';
      const from = parseInt(el.dataset.countFrom) || 0;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: from }, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val) + suffix;
            },
          });
        },
      });
    });
  }

  // ---- CONTACT ----
  function animateContact() {
    gsap.from('[data-contact-sidebar]', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        once: true,
      },
      x: -40, opacity: 0, duration: 0.7, ease: 'power3.out',
    });

    gsap.from('[data-contact-form]', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        once: true,
      },
      x: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.2,
    });
  }

  // ---- FAQ ----
  function animateFaq() {
    gsap.from('[data-faq-list] details', {
      scrollTrigger: {
        trigger: '#faq',
        start: 'top 80%',
        once: true,
      },
      y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
    });
  }

  // Initialize all animations
  animateHero();
  animateServices();
  animateTimeline();
  animateResults();
  animateContact();
  animateFaq();
})();
```

- [ ] **Step 5: Add animations.js to index.ejs**

Add after the GSAP vendor scripts:

```html
<script src="/js/animations.js"></script>
```

- [ ] **Step 6: Test all animations**

Run dev server, scroll through the full page. Verify:
- Hero elements animate on load (fade up with stagger)
- Service cards enter on scroll
- Timeline line draws as you scroll; step cards slide in alternating
- Result card metrics count up
- Contact sidebar/form slide in from opposite sides
- FAQ items stagger in

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json public/vendor/ public/js/animations.js views/index.ejs
git commit -m "feat: add GSAP ScrollTrigger animations for all homepage sections"
```

---

## Chunk 5: Final Assembly & Polish

### Task 18: Assemble complete index.ejs with correct script order

**Files:**
- Modify: `views/index.ejs` (ensure correct structure and script loading order)

- [ ] **Step 1: Verify final index.ejs structure**

The complete `views/index.ejs` should have this structure (verify and fix ordering):

```
<!DOCTYPE html>
<html lang="en">
<head>
  <%- include('partials/head') %>
</head>
<body class="bg-page text-text-primary font-body antialiased">

  <canvas id="dot-grid" ...></canvas>
  <div id="cursor-glow" ...></div>

  <%- include('partials/nav') %>

  <main class="relative z-10">
    Section 1: Hero (#hero)
    Section 2: Services (#services)
    Section 3: Process (#process)
    Section 4: Results (#results)
    Section 5: Contact (#contact)
    Section 6: FAQ (#faq)
  </main>

  <%- include('partials/footer') %>

  <!-- Scripts in order -->
  <script src="/js/dot-grid.js"></script>
  <script src="/js/nav.js"></script>
  <script src="/js/hero-nodes.js"></script>
  <script src="/js/magnetic.js"></script>
  <script src="/js/tilt.js"></script>
  <script src="/js/form.js"></script>
  <script src="/vendor/gsap.min.js"></script>
  <script src="/vendor/ScrollTrigger.min.js"></script>
  <script>gsap.registerPlugin(ScrollTrigger);</script>
  <script src="/js/animations.js"></script>

</body>
</html>
```

- [ ] **Step 2: Ensure main content is z-indexed above canvas**

Verify `<main>` has `class="relative z-10"`. Footer partial should also have `relative z-10`. This ensures all content sits above the dot grid canvas and cursor glow.

- [ ] **Step 3: Full page visual test**

```bash
npm run css:build && npm start
```

Walk through the entire page on http://localhost:3000:
- [ ] Nav starts transparent, blurs on scroll, mobile menu works
- [ ] Dot grid visible, dots glow near cursor
- [ ] Cursor glow follows mouse
- [ ] Hero animates on load, node graph animates on right
- [ ] Services: 4 cards render, tilt works, scroll animation works
- [ ] Process: timeline line draws, steps alternate and animate
- [ ] Results: 3 cards, metrics count up
- [ ] Contact: form renders, chips work, validation works, submission works
- [ ] FAQ: accordions open/close, animate in
- [ ] Footer: 4 columns render correctly
- [ ] Magnetic buttons pull toward cursor

- [ ] **Step 4: Commit**

```bash
git add views/index.ejs
git commit -m "feat: assemble complete homepage with all sections and correct script order"
```

---

### Task 19: Responsive testing and fixes

**Files:**
- Possibly modify: `views/index.ejs`, `views/partials/nav.ejs`, `views/partials/footer.ejs`, `src/input.css`

- [ ] **Step 1: Test mobile viewport (375px width)**

Using browser DevTools, resize to 375px width and verify:
- [ ] Nav shows hamburger, links hidden
- [ ] Hero stacks single column, node graph hidden
- [ ] Service cards stack vertically
- [ ] Timeline is single-column, line on left
- [ ] Results cards stack vertically
- [ ] Contact form stacks (sidebar on top, form below)
- [ ] Footer stacks single column
- [ ] No horizontal overflow

- [ ] **Step 2: Test tablet viewport (768px width)**

- [ ] Service cards: 3 smaller cards may need to be 1-column or 2+1
- [ ] Footer: 2x2 grid

- [ ] **Step 3: Fix any responsive issues found**

Apply CSS fixes as needed. Common fixes:
- Add `overflow-x-hidden` to body if horizontal scroll appears
- Adjust font sizes on small screens
- Fix padding/margin for tight viewports

- [ ] **Step 4: Commit fixes**

```bash
git add -A
git commit -m "fix: responsive layout adjustments for mobile and tablet"
```

---

### Task 20: Final build and deployment prep

**Files:**
- Verify: all files in correct locations
- Modify: `package.json` (verify build script)

- [ ] **Step 1: Run production CSS build**

```bash
npm run css:build
```

Verify `public/css/styles.css` exists and is minified.

- [ ] **Step 2: Verify Vercel deployment files**

Check these files exist and are correct:
- `vercel.json` — routing config
- `server.js` — exports Express app
- `api/contact.js` — serverless function
- `package.json` — has `build` script

- [ ] **Step 3: Test production-like start**

```bash
NODE_ENV=production npm start
```

Visit http://localhost:3000 — everything should work.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: production build and deployment prep"
```

- [ ] **Step 5: Deploy to Vercel (when ready)**

```bash
npx vercel
```

Follow prompts to link project and deploy. Or connect the repo via Vercel dashboard for auto-deploys.

---

## Summary

| Task | What it builds | Estimated effort |
|------|---------------|-----------------|
| 1 | Node.js scaffold (Express, EJS, Vercel config) | 5 min |
| 2 | Tailwind CSS build pipeline | 3 min |
| 3 | Font download and @font-face | 5 min |
| 4 | EJS partials (head, nav, footer) + placeholder page | 5 min |
| 5 | Nav scroll behavior + mobile menu JS | 3 min |
| 6 | Dot grid canvas background | 5 min |
| 7 | Cursor glow effect | 2 min |
| 8 | Magnetic button effect | 2 min |
| 9 | 3D card tilt effect | 2 min |
| 10 | Hero section + node graph canvas | 5 min |
| 11 | Services section (4 cards) | 5 min |
| 12 | Process timeline section | 5 min |
| 13 | Results section (3 case study cards) | 3 min |
| 14 | Contact form section + validation | 8 min |
| 15 | FAQ section | 3 min |
| 16 | Serverless form handler | 3 min |
| 17 | GSAP animations for all sections | 8 min |
| 18 | Final assembly and integration | 5 min |
| 19 | Responsive testing and fixes | 10 min |
| 20 | Production build and deploy prep | 3 min |
