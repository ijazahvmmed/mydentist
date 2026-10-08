# Editorial media integration â€” 2026-10-08

## Scope and provenance

Inspected all 13 JPEGs in the supplied `MyDentist_13_Named_Images.zip`. Sources are portrait 893/900 Ã— 1600. Originals and initial contact sheet remain in `assets/editorial/`, outside the served bundle. All assets remain illustrative; no verified clinic, branch, doctor, patient, equipment or treatment-result provenance is implied.

## Placement

| Asset | Placement |
| --- | --- |
| 01 Lifestyle | Homepage human transition immediately after the tooth story |
| 02 Instruments | About, smaller clinical-detail study |
| 03 Treatment room | About environment study |
| 04 Reception | About brand concept, explicitly labelled |
| 05 Exterior | Optimized and catalogued; unpublished |
| 06 Digital teeth | Homepage technology introduction |
| 07 Implant | Homepage treatment thumbnail and implant guide hero |
| 08 Aligner | Homepage featured treatment and aligner guide hero |
| 09 OPG equipment | Homepage full-mouth imaging panel |
| 10 Smile close-up | Treatment directory introduction |
| 11 Portrait | Homepage final contact CTA |
| 12 Consultation | About introductory conversation section |
| 13 Scan | Homepage intraoral scanner panel |

Seven supplied assets appear on the homepage. Twelve unique assets are displayed overall. Only the aligner and implant have two appearances, using different scales/crops. No new media appears as branch documentation. Three.js hero, chapter snapping and mobile horizontal text remain intact.

## Media and motion

78 AVIF/WebP files total 2,175,846 bytes; a browser selects a single appropriate format/width for each image. Widths: 480, 768 and source width. No upscaling. Responsive picture sources, explicit dimensions, lazy loading, meaningful generic alt text and visible illustrative captions are shared through `EditorialMedia.astro`.

GSAP clips the media surface and settles its scale. Vertical/horizontal parallax uses separate transform layers, with sufficient overscan to prevent exposed edges. Product media avoids drift. Linked images respond with a restrained hover scale. Three technology scan planes loop while visible, pause offscreen/when hidden and disappear with reduced motion. Images and captions remain visible without JavaScript.

## Verification

- Astro build/check: 49 files, zero errors/warnings/hints; static build emits 23 pages. Existing Three.js bundle-size advisory remains.
- ESLint passed.
- Full Playwright regression: 35 passed.
- After crop and motion refinements, 16 focused responsive, accessibility, reduced-motion, no-JavaScript and technology tests passed.
- Additional Axe checks passed on About, treatment index, clear aligner and implant guides.
- Inspected homepage and all media-bearing pages at 390Ã—844, 430Ã—932, 768Ã—1024, 1440Ã—900 and 1920Ã—1080. All media loaded, no horizontal overflow, no browser runtime errors.
- Captured individual rendered image crops at 390px and 1440px and inspected both contact sheets. Full implant components, aligner and scanner tip remain visible. Adjusted excessive pillarboxing in product and digital-teeth media.
- Verified no changes to clinical records, content repository, schemas, branch routes or WhatsApp routing.

Reproduce with `node tests/server.mjs 4326`, then `node qa/inspect-editorial.mjs` and `node qa/inspect-editorial-crops.mjs`. Screenshots are in `qa/screenshots/editorial/` (ignored); machine-readable viewport findings are in `qa/editorial-inspection.json`.

## Follow-up: retain and polish live technology studies

At the user's request, the scanner and full-mouth imaging panels again use the original live Three.js visual system. Editorial media remains in the other sections. The technology studies have warmer enamel shading, balanced studio lights, a thinner scan band, less camera sway and quiet grid/reticle framing. The wider-view study pairs upper and lower external arches and remains an illustration, not a patient radiograph. Supplied images 09 and 13 remain catalogued/optimized rather than replacing these animations. Current homepage supplied-image count: five; ten unique supplied assets appear across the site.

Build/check and ESLint passed. Six focused checks passed for live animation, reduced-motion fallbacks, accessibility, pointer access and existing WebGL/model failure handling. Live technology visuals were checked at 390, 430, 768, 1440 and 1920px with no overflow or runtime errors. `qa/inspect-live-technology.mjs` reproduces the screenshots.

### Motion correction

The previous polish made the rotation and scan band too restrained, and a 50ms frame-delta cap could slow the animation on low-frame-rate devices. Technology animation now advances by actual elapsed frame time, uses a visible continuous scan sweep alongside the 3D shader band, and has stronger smooth rotation. A focused browser test verifies that animation time advances in real time, rotation changes, both sweeps are visible/running, and reduced-motion SVG fallbacks remain available. Build, lint and the focused test passed.

The actual localhost:4323 development preview also had stale Vite dependency URLs returning 504 errors, preventing the hero and technology React islands from hydrating. Restarted the server and separated production/development Vite caches in `astro.config.mjs`. Verified the same development URL again after a production build: the hero loads, both technology studies advance approximately 1.5 animation seconds per 1.5 elapsed seconds, and there are no dependency/runtime errors. Reproduce with `node qa/check-dev-animation.mjs` while the development server runs on port 4323.

### Tooth shape and arrangement refinement

Compared four licensed molar surfaces and selected FDI 36 for a more balanced hero crown/root silhouette. Updated the smoothed model, viewing angle and enamel lighting. A small studio reflection map is prepared after the geometry loads so it does not delay the mobile story setup.

The wider-view animation now uses crown portions cropped from the licensed dentition, individually aligned along a symmetric arch with adapted editorial proportions. Closely spaced complementary rows and subdued curved supports replace the exposed roots and uneven arrangement. Camera framing adapts to the panel width. The scanner geometry, continuous scanning, reduced-motion alternatives and story controls remain active. Fixed stray encoding characters in the visible panoramic labels.

Validation: Astro build/check passed (49 files, zero errors/warnings/hints; 23 pages), ESLint passed, and both live technology studies passed responsive inspection at 390, 430, 768, 1440 and 1920px without overflow/runtime errors. Inspected hero and wider-view screenshots on mobile and desktop. The full regression run passed 34 tests and exposed one mobile initial-load timeout; after deferring the studio reflections, all four focused mobile/desktop story and live technology checks passed, including that previously failing test. The actual development preview also passed `qa/check-dev-animation.mjs`: hero ready, both animations advancing in real time, no dependency/runtime errors.

### Matched cards and corrected crown construction

Both technology cards now share the same visual-panel proportions (1.35 on larger screens, 1.15 on mobile), with flexible content bodies and aligned headings, card bottoms and CTA rows. This removes the shorter imaging panel and empty footer strip.

The source teeth lean substantially relative to the original global clipping axis. Crown construction now aligns every tooth to its principal long axis before cropping, preserves natural lower-crown proportions, and spaces teeth along an elliptical arch using arc length. Upper silhouettes have distinct adapted proportions. Capped bases use actual boundary connectivity; all 42 displayed crown meshes are closed with no nonmanifold edges. Local edge smoothing and angle-weighted normals reduce ridged highlights. Removed the thick blue support rails, softened imaging lighting, and adjusted the scanner/camera framing. Continuous animation, contact links and reduced-motion behavior remain intact.

Live layout inspection passed at 390, 768, 986, 1440 and 1920px: matched panel heights, headings, card bottoms and CTAs; both canvases ready; no horizontal overflow or browser errors. Geometry screenshots are in `qa/screenshots/crown-refinement/`, reproduced with `node qa/inspect-crown-refinement.mjs`.

Final Astro build/check passed (49 files, zero errors/warnings/hints; 23 pages), ESLint passed, and six focused Playwright checks passed for continuous technology animation, enquiry links, reduced motion, WebGL failure handling, mobile/desktop pointer access and accessible control labels. The actual development preview passed the animation check after the production build, advancing about 1.5 animation seconds per 1.5 elapsed seconds without browser errors.

`python qa/audit-crown-geometry.py --samples 40 --output qa/diagnostics/crown-geometry-audit.json` confirms zero open/nonmanifold edges in both assets. Ray-section samples of all neighboring crown pairs found no overlap; this is an approximate sampling diagnostic, not an exhaustive intersection proof. Final production visual inspection also passed at 390, 430, 768, 1440 and 1920px.

### Replacement of the technology dentition

The previous cropped Diaz crown arrangement is no longer used in either technology card. Replaced it with MakeHuman Community's CC0 `teeth_base` asset, which contains separately authored upper and lower teeth and gingiva. Source files and download/license provenance are in `assets/models/makehuman/`. The derivative has 32 teeth in the wider-view model and 16 lower teeth in the scanner study; surface subdivision, restrained posterior occlusal relief and trimmed source gingiva improve the display. This remains an illustrative graphics asset, not clinically validated anatomy.

Orthographic cameras now preserve front-to-back tooth proportions. Model framing fits both canvas dimensions. Corrected the scan shader to use the same clip-space projection as the tooth material and offset its depth, preventing coplanar surface flicker; gingiva does not receive the enamel highlight overlay. Removed the orbit line that crossed the lower teeth. The two cards retain matching dimensions, continuous motion, enquiry links and accessible controls. Reduced-motion/no-JavaScript/loading-error posters are transparent renders of the same new models.

Verification: build/check passed (49 files, zero errors/warnings/hints, 23 pages), lint passed, and six focused Playwright checks passed. Inspected front/left/right animation views and the matching reduced-motion fallback at 986px. Both studies passed 390, 430, 768, 1440 and 1920px inspections with no overflow or runtime errors. The development preview passed the post-build animation check: both studies advance about 1.5 animation seconds per 1.5 seconds. Relevant reproduction scripts: `qa/prepare-authored-dentition.py`, `qa/render-technology-posters.mjs`, `qa/inspect-technology-angles.mjs`, and `qa/inspect-live-technology.mjs`.
