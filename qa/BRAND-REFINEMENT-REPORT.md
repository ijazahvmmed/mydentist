# Brand, geometry and interaction refinement — 2026-10-01

## Delivered

- Used the supplied MyDentist logo and sampled its blue (`#244185`). Applied coordinated blue, pale blue and lime accents, a segmented desktop navigation bar, animated mobile menu and reading progress indicator.
- Replaced the previous first molar with a licensed second-molar exterior with more distinct tapered roots. One Loop subdivision softens facets; the refined mesh has 27,704 triangles. Reduced the hero and story scale by approximately 25%. Attribution and reproducible asset scripts are in `public/models/README.md`.
- Both technology cards now lazy-load external dental-arch geometry and animate continuously while visible. They pause offscreen, in hidden tabs and under reduced-motion preferences. Static SVGs remain for unsupported WebGL and no JavaScript. These are illustrative acquisition studies, not actual equipment, patient radiographs or clinically validated full-mouth reconstructions. The live geometry contains the lower arch.
- Technology cards open contextual availability enquiries through the existing verified central WhatsApp number. Clinic rows open their location pages, with independently clickable phone, WhatsApp and directions links.
- Fixed the actual FAQ/link failure: descendants of the fixed transparent WebGL canvas were intercepting pointer input. Decorative canvas descendants now explicitly reject pointer events. Native disclosure controls work with mouse, touch and keyboard.
- Added a click-to-spin tooth, six-dot smile celebration on the `06` counter, logo glint, responsive aligner lighting, nav index movement, arrow feedback and lime FAQ toggles.

## Verification

- `npm run build`: passes; Astro reports zero errors, warnings or hints. All 22 content pages plus 404 are retained. The isolated Three.js bundle still generates Vite's size advisory.
- `npm run lint`: passes.
- `npm test`: **30 passed**. Includes real FAQ open/close clicks at 390px and 1440px after WebGL loads, navigation from clinic and treatment rows, technology enquiry targets, visible live animation, both interactive easter eggs and unobstructed clinic/contact/footer links.
- Existing route, content, metadata, responsive, no-JavaScript, reduced-motion, model failure, context-loss, mobile focus-trap and link-resolution tests pass.
- Axe checks four critical page templates with contrast checks enabled; zero violations. Small label colours were adjusted to meet contrast after the palette change.
- Re-captured seven viewport sizes from 360px to 1920px, including hero, all story chapters, technology, treatments, clinics and footer. Inspected representative mobile, tablet and desktop captures plus opened FAQ states. These are Chromium viewport simulations, not physical-device claims.
- SHA256 checks confirm `branches.ts`, `treatments.ts` and `faqs.ts` are unchanged from the supplied-content baseline.

## Preview and boundaries

Production preview: http://localhost:4323/.

Screenshots: `qa/screenshots/brand-*.png` and `qa/screenshots/motion/`. Reproduce using `qa/inspect-brand.mjs` and `qa/inspect-viewports.mjs`.

No production domain or public deployment has been added. Intentional noindex remains until a verified production origin is configured. Internal tooth cutaways remain out of scope without suitable geometry and clinical review. The supplied raster logo is retained; a vector original would improve large-format reuse.

## Mobile Lighthouse lab measurement

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | --- | ---: | --- |
| Homepage | 85 | 100 | 100 | 66 | 2.2 s | 0.009 | 500 ms |
| Root canal guide | 99 | 100 | 100 | 66 | 2.0 s | 0.002 | 20 ms |

Measured against the production preview without concurrent test runners. Results are lab simulations, not field measurements. Homepage performance is three points below the preceding 88-point measurement; the more detailed 3D surface increases rendering work. SEO reflects the intentionally unconfigured-domain noindex state. Complete JSON reports are retained alongside this file.

The audit also identified visible-label/accessibility-name mismatches on the new controls. Those names were corrected after the measurement, and an explicit Axe regression check was added. The corrected production build was rebuilt and browser-tested; timing was not remeasured for this text-only correction.
