# Job Offers & Benefits Workshop

Bilingual (Simplified Chinese primary, English subtitle) workshop slide deck and resource page for Chinatown Service Center. Workshop 9 in the 24-part CSC employment curriculum. For use by Employment Outreach Specialist — projected on screen, 30–40 minute session.

## Tech Stack
Vanilla HTML/CSS/JS — no build step, no framework. External `app.js` + `resources.js` (no inline scripts; CSP-tight).

## Structure
```
index.html       — 13-slide projection deck (click + keyboard navigation)
resources.html   — bilingual resource reference page (printable)
404.html         — bilingual 404 fallback
styles.css       — shared design system (CSS variables, typography, components)
print.css        — print-friendly styles for resources page
app.js           — slide nav, reveal logic, lang toggle (event-delegated, no inline handlers)
resources.js     — resources-page init (lang toggle, QR, SW reg)
404.js           — 404-page lang init
qrcode.min.js    — client-side QR code generator (local copy)
sw.js            — service worker (cache-first, offline; CACHE: job-offers-workshop-v4)
_headers         — Cloudflare Pages security headers (CSP, no script unsafe-inline)
robots.txt       — crawl rules
sitemap.xml      — sitemap with home + /resources
tests/           — Playwright smoke tests (run: `npx playwright test`)
verify-report.md — last /verify run output
```

## Entry Point
`index.html`

## Slides (13 total, linear flow)
1. Title: 看懂 Offer 与福利 / Job Offers & Benefits
2. Agenda (3 topics: Offer信 · 工资 · 福利)
3. Reading an Offer Letter (5-item checklist)
4. Types of Pay (hourly vs salary, pay frequency)
5. Health Insurance (premium / deductible / copay terms)
6. **Activity:** Calculate Take-Home Pay (two-phase: gross → net)
7. 401k: Free Money (employer match stacked bar viz)
8. PTO, Sick Days, Holidays (CA sick leave as featured legal-right card)
9. Filling Out the W-4 (5-step guide)
10. **Quiz:** True/False (multi-phase: Q1 → answer → Q2 → answer)
11. When to Negotiate vs Accept (2-column + script)
12. CSC Services (3×2 balanced grid: 6 services)
13. Resources + QR code → resources.html

## Navigation
- Click anywhere → advance (regular slides)
- Arrow keys ← → also navigate
- Interactive slides (6, 10): must click reveal button before advancing
- All handlers are event-delegated from `app.js` via `data-action=""` attrs

## Interactive Elements (gates)
- Slide 6: `data-action="reveal-paycheck"` reveals net pay breakdown; `data-phase` goes `question → answer`
- Slide 10: `data-action="reveal-q1"` then `data-action="reveal-q2"`; `data-phase` goes `question → q2 → done`
- `isRevealed(n)` blocks `nextSlide()` while a gated slide is unfinished

## Visual Design
Deep purple + warm gold palette — distinct from suite siblings.
- Background: #faf5ff (very light purple)
- Primary: #7c3aed (deep purple)
- Primary-dark: #5b21b6
- Accent: #d97706 (warm gold/amber)
- Cards: 8px border-radius; activity slides: 12px
- All grids are balanced (no orphan rows): agenda 3-col, services 3-col × 2-row, PTO featured+2

## Icons
All icons are inline Lucide SVGs — no emoji in icon positions.
- Agenda cards (slide 2): 40px, `color: var(--accent)`
- Topic badges: 16px, inherits `--primary-dark`
- PTO featured (slide 8): 44px white-on-purple
- Service cards (slide 12): 32px, `color: var(--primary)`
- Use `aria-hidden="true"` on every SVG; `stroke-width="1.5"` for ≥32px, `2` for smaller

## Responsive
`@media (max-width: 768px)` block at end of styles.css:
- All multi-column grids collapse appropriately (agenda 3→1, services 3→2, PTO featured stack, compare 2→1)
- `main-title` 64px → 40px; `zh-headline` 48px → 32px
- Slide padding reduced to 20px 16px

## Animations
- Slide fade-in: `@keyframes slideFadeIn` (220ms ease-out) on `.slide.active`
- `@media (prefers-reduced-motion: reduce)` block disables all transitions/animations

## Bilingual
- Language toggle stored in `localStorage` key `jow_lang` (workshop-isolated)
- `body.zh` class switches `.en`/`.zh` spans via CSS (`display: none`)
- Simplified Chinese (zh-Hans); font: PingFang SC, Noto Sans SC, Microsoft YaHei
- Chinese text: 32px body, 48px headings; English: 20px body, 28px headings
- Toggle button shows CURRENT state ("中文" in CN mode, "EN" in EN mode)
- `html[lang]` updated on toggle AND on init

## Security Headers (CSP)
Strict CSP — no `'unsafe-inline'` in `script-src`. All scripts are external files; all click handlers use event delegation via `data-action`.
- script-src: 'self' only
- style-src: 'self' 'unsafe-inline' + fonts.googleapis.com (inline `style=""` attrs and `<style>` blocks still permitted; lower-risk than script inline)
- font-src: 'self' + fonts.gstatic.com
- frame-ancestors, base-uri, form-action all 'self'

## Deployment
Cloudflare Pages → `job-offers-workshop.pages.dev`
Deploy: `wrangler pages deploy . --project-name job-offers-workshop --branch main`

**Before deploying:** bump `CACHE` version in `sw.js` (e.g. `v4` → `v5`) to invalidate cached assets on visitor devices.

## Tests
Playwright smoke tests cover: all-13-slide navigation, language toggle persistence, reveal-gate logic, paycheck reveal sequencing, quiz Q1→Q2 sequencing.
- Install once: `npm install -D @playwright/test serve` then `npx playwright install chromium`
- Run: `npx playwright test`
