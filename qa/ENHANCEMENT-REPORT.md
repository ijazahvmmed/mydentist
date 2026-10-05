# Motion enhancement verification — 2026-10-01

This pass preserves the existing Astro architecture, all 22 content routes, SEO/schema utilities, enquiry routing and typed repository. SHA256 comparisons confirm `branches.ts`, `treatments.ts` and `faqs.ts` are unchanged (`content-before.json`).

## Implemented and observed

- One real React Three Fiber / Three.js canvas shared by the hero and scroll story. A licensed external molar has 3,777 vertices and 7,550 triangles; this is not an image plane.
- Four desktop chapters over 400svh, genuine rotation/perspective/camera movement, alternating composition, ivory enamel, surface wire/contour scan and root focus ring, and clean enamel restoration. The visual exits upward with the final section.
- Mobile/tablet below 900px use centred geometry, smaller scale, copy first and a shorter 360svh sequence. The final CTA remains above the object.
- Observed line-mask heading entrances, separate text timing, image masks, 4% parallax, aligner depth/highlight, treatment thumbnail feedback, nav/pressed states, mobile drawer/link stagger and focus trap, and 300ms branch result entrances.
- Digital-arch projection derived from the licensed external geometry, with sparse-to-resolved scan mask. Original panoramic upper/lower arch graphic and scan sweep replace the old radial graphic.
- Original braces, implant/crown and wisdom-position CGI, separate from clinic facts. Exact prompts and saved paths: `assets/generated/ENHANCEMENT-PROMPTS.md`.

## Browser verification

Actual production output was opened with Chromium/Playwright. Screenshots were captured and visually inspected at multiple positions, not just full-page captures: hero, chapters, release, treatments, technology, branch finder and footer. Matrix: 360×800, 390×844, 430×932, 768×1024, 1024×768, 1440×900 and 1920×1080. Artifacts: `qa/screenshots/motion/`. Additional intermediate transition frames and reduced-motion capture are retained there. These are desktop-browser viewport simulations, not claims of physical iOS device testing.

`qa/inspect-viewports.mjs` and `qa/inspect-transitions.mjs` reproduce captures against the production preview on port 4323.

## Checks

- `npm run check`: 0 errors, warnings or hints.
- `npm run lint`: passed.
- `npm run build`: passed, 22 content pages plus 404. Vite still reports a size advisory for the isolated Three.js bundle; it is loaded only on the homepage after HTML.
- `npm test`: 24 passed. Original route/content/contact/search/responsive/no-JS/reduced-motion/link/schema coverage retained. The former no-canvas assertion was replaced with actual mesh count, projected copy clearance and scroll-state checks. Added model failure, context loss and mobile focus-trap checks.
- Axe checks all four existing critical templates after their entrance animations settle; no violations. The test does not disable contrast checks.

## Performance and remaining boundaries

Latest lab measurements are in `lighthouse-summary.json`, with complete JSON audits alongside it. Initial eager animation setup measured 71 mobile performance; deferring heading work until visibility and caching scene layout measurements raised it to 91 in the follow-up measurement. Final remeasurement is recorded below.

No production domain has been provided. The final preview intentionally remains noindex with disallow-all robots and an empty sitemap; this accounts for the local SEO score. Domain behavior remains covered by the existing conditional sitemap/canonical test. Set the verified production origin before launch.

Internal pulp/canal cutaways remain disabled pending valid licensed geometry and clinical review. No real clinic/doctor/equipment photography was fabricated. External model attribution is visible beneath the story and detailed in `public/models/README.md`.

### Final mobile Lighthouse run

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | --- | ---: | --- |
| Homepage | 88 | 100 | 100 | 66 | 2.0 s | 0.006 | 430 ms |
| Root canal guide | 99 | 100 | 100 | 66 | 1.9 s | 0 | 10 ms |

SEO is intentionally reduced by the unconfigured-domain noindex policy. Results are local Lighthouse mobile simulations, not field measurements. The final full test run passed all 24 tests after the release fix; transition screenshots were re-captured and inspected. Preview: http://localhost:4323/.
