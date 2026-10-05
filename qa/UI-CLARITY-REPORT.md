# UI hierarchy and icon refinement — 2026-10-02

Applied across shared components and homepage, treatment directory/guides, location directory/details, contact and about templates. All 22 content routes remain intact.

## Changes

- One local SVG icon component with consistent stroke, sizing and colour. Icons identify treatments, locations, phone, chat, email, opening hours, directions, scanning and questions. They are decorative to assistive technology and always accompany visible action labels. No emoji icons or external icon runtime/downloads.
- Navigation replaces decorative indices with category icons and marks the current section. The mobile menu keeps labels, keyboard focus handling and SVG open/close feedback.
- Clinic cards separate their name, landmark, opening hours and actions. A visible search field and labelled phone, WhatsApp and directions buttons improve scanning and touch targets. Existing verified contact destinations are unchanged.
- Treatment rows have category symbols and explicit guide labels. Guides include an in-page contents navigation; sticky panels and anchor offsets now clear the desktop header.
- Technology cards read in the order category, name, explanation, enquiry. Continuous 3D animation and motion preferences remain unchanged.
- Increased body/helper text sizes, relaxed heading tracking, clearer FAQ affordances, stronger contact hierarchy, consistent related links, icon-assisted breadcrumbs and footer contact actions. Primary mobile hero CTA spans the available width.

## Verification

- Production build passes, with zero Astro errors/warnings/hints. Existing Vite advisory about the isolated Three.js chunk remains.
- Lint passes. **31 Playwright tests pass**, including four Axe template audits, visible/accessibility label matching, real clicks after WebGL loads, keyboard menu handling, no-JavaScript/reduced-motion fallback and new guide-anchor navigation checks.
- Responsive coverage now checks six page templates at eight widths from 360px to 1920px.
- Chromium screenshots captured for six templates at 390px and 1440px, with separate key-section views. Representative hero, clinic cards/details, technology, contact, treatment directory and guide screenshots were inspected. Captures are in `qa/screenshots/clarity/`; reproduce with `node qa/inspect-clarity.mjs`.
- SHA256 comparisons confirm branch, treatment and FAQ records remain unchanged.
- No new performance score is claimed for this CSS/SVG pass. The previous Lighthouse measurement is retained in `qa/BRAND-REFINEMENT-REPORT.md`.

Preview: http://localhost:4323/.


## Follow-up: tooth-story chapter snapping

Added a scoped GSAP ScrollTrigger snap controller to the enhanced 3D story. After scrolling settles, the nearest chapter centre becomes the reading position, aligned with the tooth timeline. The capture region includes entry into chapter one; outward scrolling beyond the first or last stop is explicitly released. Wheel/touch input can interrupt the snap, and a focused story link is not moved. The controller is reverted with the model's GSAP context for reduced motion or model teardown. No nested scroll container or page-wide CSS scroll snapping was introduced.

Mobile enhanced chapters now occupy 100svh, so settled screens do not expose cut-off text from neighbouring chapters. Static/no-JavaScript/reduced-motion layouts retain ordinary document flow. Captures at 320×640, 390×844 and 1440×900 are in `qa/screenshots/snap-*.png`; all four stop positions align within one CSS pixel in the captured runs, with model phases 0, 1, 2 and 3. Reproduce with `node qa/inspect-story-snap.mjs`.

Final validation: production build and lint pass; **33 Playwright tests pass**, including forward/reverse chapter settling and escape at both boundaries at mobile and desktop widths.

## Follow-up: full-width header

Separated the full-width header surface from its constrained `.header-inner.wrap` content. The background, border and reading-progress line span the viewport; desktop navigation is centred and the outer controls align with page content. Preserved mobile drawer positioning and no-JavaScript wrapping. Build/lint and all 33 browser tests pass. `qa/inspect-header.mjs` verified edge-to-edge coverage, aligned content margins, no overlap and no horizontal overflow at 390, 768, 900, 1000, 1201, 1440, 1920 and 2560 pixels; desktop and mobile-menu screenshots were inspected.

## Follow-up: horizontal mobile text

On mobile, the enhanced story now uses a sticky, clipped viewport with four horizontal text panels. Normal vertical scrolling drives the horizontal track and the existing 3D phase together; the original chapter snapping and outward boundary release are retained. Four labelled 44px chapter buttons allow direct selection. Only the current panel is exposed to focus/assistive technology; desktop, reduced-motion and failed-WebGL layouts restore the original document reading order.

The grid column is explicitly `minmax(0, 1fr)` so the horizontal strip cannot enlarge the mobile viewport. At 320×640, browser assertions verify all four panels fit horizontally and their copy/button bounds remain above the projected tooth bounds. Direct navigation to the treatment guide, step selection, breakpoint changes, reduced-motion restoration and forward/reverse snapping pass. The full 35-test run caught the initial intrinsic-width issue (34 passed); all four affected scroll/horizontal tests passed after the correction. Build and lint pass. The other route/accessibility/contact regressions passed in the full run. Updated mobile/desktop captures are retained under `qa/screenshots/snap-*.png`.
