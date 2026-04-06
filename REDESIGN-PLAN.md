# Autom8Lab Website Redesign Plan

## The Big Picture

**Current positioning:** AI agency that installs systems for traditional businesses
**New positioning:** AI consultant (Cosmo personally) who helps businesses implement AI — with free resources and content building trust at scale

**Reference site:** [Chase AI](https://www.chaseai.io/) — solo AI consultant who does custom AI agents, automations, and strategy. Sells via expertise/content, not via agency scale.

**The shift:** Move from "we're an agency with a team" to "I'm an expert who can help you." The website should feel like hiring a trusted advisor, not contracting with a faceless company. Chase does this well — his site is clearly *him*, with community, mentorship, blog, and services all orbiting around his personal brand.

---

## What Chase AI Does Better (And What To Learn From It)

### 1. Clear Service Packaging
Chase has 4 clean service categories (AI Agents, n8n Workflows, RAG Systems, AI Strategy) — each with a visual mockup and one-liner. It's immediately scannable.

**Autom8Lab currently:** Services are described by outcomes ("Respond to leads before they go cold") in a table format. Good copy, but harder to scan and doesn't tell the visitor *what* you build.

**Action:** Repackage services as named offerings with clear scope, not just outcomes.

### 2. Personal Brand Front and Center
Chase's site is clearly *him*. His name is in the domain. The site says "we" but the feel is personal.

**Autom8Lab currently:** Positioned as a team/agency ("We install AI systems"). The About page has 5 team members. This dilutes the personal authority.

**Action:** Lead with Cosmo as the face. The team can exist, but the site should feel like *Cosmo's* practice.

### 3. Content/Community Funnel
Chase has Blog, Mentorship, Community (Chase AI+, Free Community), YouTube — all in the nav. This builds trust before someone ever books a call.

**Autom8Lab currently:** Has Free Resources page (good start) and AI Mastermind (great), but they're not positioned prominently enough.

**Action:** Make Free Resources a first-class section. Add YouTube/social content. Build the "give first" funnel.

### 4. Simple Process (4 Steps)
Chase: Discovery → Strategy → Build → Support. Clean, visual timeline.

**Autom8Lab currently:** 3 steps (Audit → Install → Optimize). Good, but can be refined.

**Action:** Keep 3-4 steps but present them with Chase's timeline visual style.

### 5. Contact Form (Not Just Calendly Link)
Chase has a full intake form on the page — name, email, services, budget, timeline. This qualifies leads before the call.

**Autom8Lab currently:** Just links to Calendly everywhere.

**Action:** Add a contact/intake form section to the homepage. Keep Calendly as the actual booking tool but capture context first.

---

## Proposed Site Structure

### Pages

| Page | Purpose | Status |
|------|---------|--------|
| `index.html` | Homepage — hero, services, process, results, contact form | **Redesign** |
| `about.html` | About Cosmo — personal story, philosophy, credentials | **Rewrite** (shift from team to personal) |
| `free-resources.html` | Hub for all free content — videos, guides, templates, tools | **Expand** (make this the "blog" equivalent) |
| `ai-audit.html` | Dedicated AI Audit landing page | **Keep + refresh** |
| `ai-mastermind.html` | Weekly mastermind group call | **Keep** |
| `case-studies/*.html` | Individual case studies | **Keep + refresh** |
| `services_menu.html` | Partner-facing systems menu | **Keep as-is** (internal) |
| `complexity_guide.html` | Partner-facing complexity guide | **Keep as-is** (internal) |
| `ai-ea-signup.html` | AI EA tutorial signup | **Keep** |
| `vision-map.html` | Vision map tool | **Keep** |

### New/Removed
- **Remove from nav:** "How It Works" anchor (fold into homepage flow)
- **Add to nav:** "Free Resources" prominently, "About" stays
- **Consider adding:** Community/Mentorship page (like Chase's)

---

## Homepage Redesign: Section-by-Section

### Current Homepage (12 sections — too many)
1. Hero
2. Social Proof Band
3. Two Outcomes (Make Money / Save Time)
4. The Real Problem
5. What We Install (table)
6. How It Works (3 steps)
7. Is This a Fit?
8. Real Outcomes (3 case studies)
9. Industries (4 case study links)
10. What We Don't Do
11. FAQ
12. Final CTA

**Problem:** This is a long-scroll with lots of "convincing" — text-heavy, repetitive, and the visitor has to read a lot before they understand what you do. Chase's site is much more scannable.

### New Homepage (7 sections — tighter, more visual)

#### Section 1: Hero
**Style:** Chase AI hero — big headline, sub-copy, two CTAs, code editor visual

**Current copy direction:**
> "Leads go cold. Follow-ups slip. The owner ends up holding everything together."

**New copy direction (consultant voice):**
> "Turn AI Into Your Operational Advantage"
> or
> "AI Systems That Actually Work For Your Business"

Keep it benefit-focused but less "pain point" heavy. Chase leads with aspiration ("Turn AI Into Your Unfair Advantage"), not pain.

**Sub-copy:** Short, clear value prop. Who you are + what you do + the result.

**CTAs:**
- Primary: "Book a Free Consultation" → Calendly
- Secondary: "See How It Works" → scroll to services

**Visual:** Code editor mockup showing an AI system config (like the v1 redesign prototype)

---

#### Section 2: Services (4 Cards with Visuals)
**Style:** Chase AI 2x2 grid — each card has a visual illustration + title + description

Repackage the current outcomes-based table into 4 named service offerings:

| Service | Description | Visual |
|---------|-------------|--------|
| **AI Lead Response** | Automated lead qualification, instant responses, meeting booking | Chat bubble flow mockup |
| **Workflow Automation** | Connect your existing tools, eliminate manual data entry, task routing | Integration icons (CRM, Slack, Email, etc.) |
| **AI Executive Briefings** | Daily operational summary — overdue tasks, revenue pipeline, team capacity | Dashboard/notification mockup |
| **Revenue Attribution** | Track which channels produce real clients, not just leads | Bar chart/analytics mockup |

**Bottom note:** "Everything sits on top of your existing tools. No heavy migrations."

---

#### Section 3: Process Timeline (3–4 Steps)
**Style:** Chase AI alternating timeline with cards

| Step | Title | Description | Tag |
|------|-------|-------------|-----|
| 01 | AI Audit | Map operations, find leaks, project ROI | FREE 30-MIN CALL |
| 02 | System Design | Build the roadmap, define scope, set timeline | DELIVERABLE: TECHNICAL SPEC |
| 03 | Implementation | Build and integrate on your current stack | LIVE IN ~14 DAYS |
| 04 | Optimization | Ongoing tuning, expansion, performance reviews | MONTHLY REVIEWS |

**Note:** Going from 3 to 4 steps matches Chase's pattern and lets you separate "design" from "build."

---

#### Section 4: Results (3 Case Study Cards)
**Style:** Chase AI card grid with key metrics

Keep the current 3 case study cards (Healthcare, Construction, Property Management) but style them like the redesign prototype — cleaner, more visual, bigger stat numbers.

---

#### Section 5: Contact Form
**Style:** Chase AI form with sidebar

**Left sidebar:**
- "What to expect" checklist (free consultation, 24hr response, no obligation, clear ROI)
- Email fallback link

**Form fields:**
- Name, Email, Website (optional)
- Industry (chip selector: Healthcare, Construction, Property Mgmt, Professional Services, Other)
- Budget range (chip selector)
- Biggest challenge (textarea)
- Submit: "Book Your Free AI Audit"

---

#### Section 6: FAQ (Keep, but shorter)
Keep 3-4 most important questions. Remove ones that feel like over-explaining.

Suggested keeps:
- "Do we need to replace our software?"
- "Is this consulting or implementation?"
- "How quickly can this go live?"
- "What does this cost?"

---

#### Section 7: Footer (Multi-column, Chase AI style)
4 columns:
- **Brand:** Logo, tagline, email, social icons
- **Services:** AI Lead Response, Workflow Automation, AI Briefings, Revenue Attribution
- **Company:** Our Approach, Case Studies, About, Contact
- **Resources:** Free Resources, AI Audit, Vision Map, AI Mastermind

---

### Sections Being CUT from Homepage
These sections from the current site would be removed or merged:

| Section | Decision | Reason |
|---------|----------|--------|
| Social Proof Band | **Cut** | Replace with better social proof (testimonials, logos, or stats in hero) |
| Two Outcomes | **Merged** into hero sub-copy | "Make money + save time" is good but doesn't need its own section |
| The Real Problem | **Cut** | Too much pain-point copy. The services section shows the value |
| Is This a Fit? | **Cut** | Good fit / Not a fit feels defensive. Let the services and case studies self-select |
| Industries | **Merged** into case studies cards | Redundant with the Results section |
| What We Don't Do | **Cut** | Defensive positioning. Handle in FAQ or About if needed |

---

## About Page Rewrite

### Current: Team-focused agency page
5 team members, generic "who we are" language.

### New: Personal consultant story
**The shift:** This page should tell Cosmo's story. Why he does this. What he's seen. What he believes about AI for businesses.

**Structure:**
1. **Hero:** Photo + name + one-liner ("I help businesses install AI systems that actually work")
2. **My Story:** 2-3 paragraphs. Background, what led to Autom8Lab, philosophy.
3. **What I Believe:** 3-4 conviction statements (like: "AI should multiply your team, not replace them")
4. **How I Work:** Brief process overview
5. **CTA:** Book a conversation

**Team:** Can be mentioned ("I work with a small network of specialists when projects need it") but the page is about Cosmo, not the team roster.

---

## Free Resources Page Expansion

### Current: 4 resource cards
AI EA Guide, AI Mastermind, AI Audit, Vision Map

### New: Content hub (like Chase's blog, but for resources)
This is where your YouTube content, guides, and tools live. It becomes the "give first" engine.

**Structure:**
1. **Hero:** "Free AI Resources" — short tagline
2. **Featured Resource:** Large card for the newest/best piece (currently the AI EA Guide)
3. **Resource Grid:** Cards with tags and types

**Resource types to build over time:**
- Video tutorials (from YouTube)
- Written guides
- Templates/tools
- Free tools (Vision Map, AI Audit)
- Mastermind/community

**Each card has:**
- Type tag (Video, Guide, Tool, Community)
- Format tag (Free, Tutorial, Template)
- Title
- 1-2 sentence description
- CTA link

**As you make more YouTube content, add cards here.** This page grows organically.

---

## Content Voice Shift

### Current voice: Agency
> "We install AI systems..." / "We go in, diagnose where time and revenue are leaking..." / "We build and implement the systems for you."

### New voice: Consultant/advisor
> "I help businesses..." / "Here's what I've seen work..." / "The businesses I work with..." / "Let me show you where AI fits in your operations."

**Key changes:**
- "We" → "I" (mostly — can still say "we" for implementation since you have a team)
- Remove defensive language ("What we don't do", "Is this a fit?")
- Add authority language ("In my experience...", "What I've seen across dozens of businesses...")
- Sound like someone sharing expertise, not someone selling a service

---

## Nav Redesign

### Current nav:
How It Works | Case Studies | About | Free Resources | [Book a Call]

### New nav (Chase AI style):
Services | Approach | About | Free Resources | [Book a Call]

Or with a community dropdown:
Services | Approach | About | Resources ▼ | [Book a Call]

Where Resources dropdown shows: Free Resources, AI Mastermind, YouTube

---

## Priority & Phases

### Phase 1: Homepage Redesign (Do First)
- [ ] Rewrite hero copy (aspiration, not pain)
- [ ] Build 4 service cards with visuals
- [ ] Build process timeline (4 steps)
- [ ] Keep 3 case study result cards (restyle)
- [ ] Add contact form section
- [ ] Shorten FAQ to 4 items
- [ ] Redesign footer (4 columns)
- [ ] Update nav links

### Phase 2: About Page Rewrite
- [ ] Rewrite as Cosmo's personal page
- [ ] Remove team roster (or minimize to one mention)
- [ ] Add personal photo prominently
- [ ] Write conviction statements

### Phase 3: Free Resources Expansion
- [ ] Redesign as content hub
- [ ] Add YouTube video embed cards
- [ ] Create proper tagging system
- [ ] Feature the AI EA guide prominently
- [ ] Add new resources as content is created

### Phase 4: Polish & Extras
- [ ] Update all pages to new nav/footer
- [ ] Refresh case study pages to match new design
- [ ] Add social proof (testimonials, logos, or stats)
- [ ] SEO optimization for new content structure
- [ ] Mobile responsive testing

---

## Technical Notes

- Keep the same tech stack (Tailwind CDN, Inter font, vanilla JS, static HTML)
- Keep cPanel deployment workflow
- Keep the same CSS custom properties (dark blue theme)
- The v1 redesign prototype (`index-redesign-v1.html`) has the Chase AI layout patterns already built — use as starting point
- Services menu and complexity guide pages remain untouched (partner-facing tools)

---

## Summary

The core idea: **Stop looking like an agency. Start looking like a trusted expert with a practice.**

Chase AI works because it's clearly one person who knows what they're doing, shares knowledge freely, and makes it easy to hire them. Autom8Lab should follow the same pattern — Cosmo as the face, free resources as the trust engine, clean service packaging as the conversion path.

The website goes from 12 homepage sections to 7, from team-speak to personal authority, and from "convince me" to "show me."
