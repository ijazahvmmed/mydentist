# Final QA — 1 October 2026

## Delivered

22 content pages plus a custom 404: homepage, treatment index, nine treatment guides, clinic index, six branch pages, about, contact, privacy and terms. Static HTML, typed content repository, contextual WhatsApp links, direct branch telephone links, searchable clinic finder, original responsive design, self-hosted fonts, optimized original CGI and structured data.

## Automated checks

- `npm install`: successful; lockfile included in the deliverable.
- `npm run dev`: successfully started on port 4322.
- `npm run lint`: passed.
- `npm run build`: passed; 23 HTML pages generated. Astro check: 0 errors, 0 warnings, 0 hints.
- `npm audit`: 0 vulnerabilities after updating to Astro 7.3.5 and current compatible dependencies.
- `npm test`: **21 passed** against an isolated static production server, with no reused development server.
- Coverage: all 22 content routes, unique titles and semantic H1s, all six phone numbers, contextual WhatsApp routing, landmark search and empty state, mobile menu and Escape focus return, no-JavaScript navigation, reduced motion, all internal links and image URLs, all branch/treatment sitemap entries, desktop story separation and sticky release.
- No browser page errors or console errors in the tested homepage, treatment and branch templates at any required viewport.
- Axe: zero WCAG A/AA violations on homepage, root canal, Thuravoor and contact templates.

## Responsive / visual QA

Automated overflow and browser-error checks: 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080.

Rendered screenshots inspected for desktop hero and story, full homepage, mobile hero, aligner artwork, treatment page and branch page. Fixed the tooth image edge, desktop story framing and sticky release. The mobile story uses normal-flow text and centered stills. Full-page screenshots naturally show a sticky visual only at its capture position; chapter-level screenshots verify the actual scroll composition.

## Mobile Lighthouse lab measurements

Production build with QA-only `SITE_URL=https://mydentist.test`; no enabled WebGL. Reports in `qa/lighthouse-home.json`, `qa/lighthouse-treatment.json` and `qa/lighthouse-summary.json`.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| Homepage | 99 | 100 | 100 | 100 | 1.9 s | 0.002 | 40 ms |
| Root canal guide | 100 | 100 | 100 | 100 | 1.2 s | 0 | 0 ms |

These are local mobile lab measurements, not field Core Web Vitals or measured INP. Production hosting, network and device affect results. The last subsequent CSS change only fixes sticky containment; the reported scores are not a guarantee for a later enabled 3D model.

Hero WebP: 23,940 bytes at 1000 px; 11,588 bytes at 640 px. Aligner WebP: 42,204 bytes at 1000 px; 20,960 bytes at 640 px. Below-fold artwork is lazy-loaded. No Three.js or React network request in the active fallback page; GSAP supports the desktop still-image story.

## Honest limitations / release configuration

- No clinical GLB, clinic photos, official logo or doctor/equipment photographs were supplied. The permitted static tooth fallback is active. Optional R3F code is a future integration scaffold, **not a completed or clinically validated internal-anatomy animation**. Mobile WebGL and model-specific cutaway/restoration need completion and QA after a reviewed model is supplied.
- The optional, inactive Three.js bundle produces a >500 KB build warning; it is not downloaded by the active website. Model-enabled performance has not been measured.
- Only the primary/Thuravoor number is verified for WhatsApp. Other branches use their direct numbers for phone and the verified central WhatsApp number with branch context.
- Directions links are address searches, not asserted verified business pins. Branch-specific treatment/equipment availability is not fabricated.
- The actual public domain is unknown. The final unconfigured build intentionally emits noindex and disallow-all robots, with an empty sitemap. Setting the verified `SITE_URL` and rebuilding enables canonicals, indexing and all 22 sitemap URLs. The test domain is not a launch configuration.
- Client clinical/legal review, hosting privacy details and missing brand/photography/social assets remain in `CONTENT_TODO.md`.
- Chromium/Edge desktop and emulated viewports tested; physical iOS/Android and Safari testing remain unverified.

## Content audit

Clinic facts checked against the supplied PRD. General medical explanations checked against linked sources in `CONTENT_SOURCES.md`; no claimed clinical review. No invented qualifications, awards, prices, review counts, treatment outcomes or establishment year. The requested banned-copy scan found only the legitimate HTML search-input `placeholder` attribute; no filler content or reference-site branding.
