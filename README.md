# Dr KiranÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢s MyDentist

Static Astro website with six clinic pages, nine treatment pages, a searchable clinic finder, educational story, accessible enquiry links and typed content adapters. Original art direction inspired by the supplied screenshots; no reference branding or copied content.

## Run locally

Use a current supported Node release (Node 22.12+; built with Node 25.6) and npm.

```sh
npm install
npm run dev
```

Open http://localhost:4321. Scripts: `npm run check`, `npm run lint`, `npm run build`, `npm run preview`, `npm test`. Install browser test binaries with `npx playwright install chromium` if required. Playwright starts an isolated static test server on port 4325; build first.

## Build and deployment

Set `SITE_URL` to the verified HTTPS production origin in the hosting build environment, then run `npm ci && npm run build`. Publish `dist/` on a static host (Cloudflare Pages, Netlify, Vercel static hosting, or an HTTPS web server). No server adapter or database is needed. Configure the host to serve `404.html` for missing paths. Do not use an SPA catch-all rewrite.

`SITE_URL` is intentionally unset until the real domain is supplied. Without it, the site is usable in preview but emits noindex, disallow-all robots and an empty sitemap. With it, all 22 content pages receive absolute canonicals and are listed in `/sitemap.xml`. The 404 is excluded. For a local production-mode QA build in PowerShell:

```powershell
$env:SITE_URL='https://mydentist.test'
npm run build
npm test
Remove-Item Env:SITE_URL
```

The test domain is a local QA fixture, never the production domain. `.env` can also be used; Astro config loads it at build time. Review `CONTENT_TODO.md` before launch.

## Content and architecture

`src/types/content.ts` defines Branch, Treatment, Doctor, FAQ, MediaAsset, SEOFields, OpeningHours and ContentRepository. `src/lib/content/repository.ts` is the local adapter. Pages use the adapter rather than importing branch/treatment arrays directly. Data remains in server-generated HTML.

- Edit branches in `src/content/branches.ts`; preserve verified facts and ThuravoorÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢s first position.
- Add a branch to the typed data, with a stable slug, complete address, verified phone/hours and unique location details. Its route, directory entry and sitemap entry generate automatically. Add exact map URLs and branch photos when supplied.
- Edit or add treatments in `src/content/treatments.ts`, and add corresponding FAQs in `src/content/faqs.ts`. Pages and sitemap entries generate automatically. Add unique, clinically reviewed explanations. Do not imply availability at every branch unless verified.
- Doctor records live in the local repository. Add verified qualifications, biography and photo before setting `publish: true`; no doctor routes are generated yet. Create a doctor page only when sufficient content exists.
- Media assets support photo/illustration distinction, alt text and dimensions. Put verified assets under `public/images/{brand,locations,doctors,equipment,treatments,social,misc}`. Use responsive WebP/AVIF and explicit dimensions. Never hotlink private Drive assets.
- WhatsApp URLs are generated centrally by `src/lib/whatsapp/index.ts`, through the enquiry-service adapter when used in treatment pages. Branches without confirmed WhatsApp use the central confirmed number with branch context.

## Real-time tooth and motion

The homepage uses a shared React Three Fiber tooth canvas for the hero and a four-chapter external-tooth story. A licensed 30,200-triangle refined molar rotates in perspective, moves between copy columns, shifts into contour/wireframe scanning and root focus, then returns to ivory enamel. It does not depict internal anatomy. Source, licence and adaptations are in `public/models/README.md`.

The scene hydrates after critical HTML, uses demand rendering, caps DPR at 1.5 desktop / 1.25 mobile, and stops frame requests while idle, hidden or outside its sections. Mobile uses a centred tooth with a sticky horizontal text track, driven by vertical scrolling and chapter snapping; numbered controls jump directly to a chapter. Static posters remain on model/context failure, without JavaScript and with reduced motion. All routes, treatment/branch records, contact links and SEO remain static-first.

`src/animations/index.ts` provides measured line-mask headings, observed section entrances, image masks and restrained scroll parallax. GSAP owns scroll timelines; CSS owns hover/pressed feedback. Native scrolling is preserved. Technology panels retain the live Three.js dental studies: a surface scanner and individually aligned crown surfaces for the wider-view illustration. Studio lighting, a restrained shader scan band and slow camera sway repeat while visible and pause offscreen or when hidden. Static SVG studies remain for reduced motion, WebGL failure and no JavaScript. Treatment illustrations are separate from verified records in `src/lib/treatment-visuals.ts`; exact generation prompts are in `assets/generated/ENHANCEMENT-PROMPTS.md`.

## Editorial media library

The supplied `MyDentist_13_Named_Images.zip` is preserved in `assets/editorial/originals/` as thirteen original JPEGs. `qa/build-editorial-media.mjs` creates AVIF/WebP variants at 480px, 768px and each source's original 893px or 900px width; nothing is upscaled. `src/lib/editorial-media.json` records source names, dimensions, descriptions and publication status. `EditorialMedia.astro` supplies responsive sources, lazy loading, explicit dimensions and illustrative captions.

Five supplied assets appear on the homepage: lifestyle, clear aligner, implant, digital teeth and the final portrait. The scanner and OPG panels retain live 3D studies; their supplied equipment illustrations remain optimized and catalogued for later supporting use. The smile close-up introduces the treatment directory. Consultation, treatment room, instruments and reception form the About page sequence. Clear aligner and implant assets have a second, larger appearance in their treatment guides. The exterior concept is optimized and catalogued but intentionally unpublished; no illustrative environments appear as branch photography. Clinic records, SEO, routes and contact routing are unchanged.

The shared GSAP reveal uses a clipped entrance, scale settle and controlled vertical/horizontal drift. Product images avoid scroll drift. Technology scan sweeps run only when visible, pause when the tab is hidden and disappear with reduced motion. No-JavaScript and reduced-motion visitors see the same media and captions without animation. `qa/EDITORIAL-MEDIA-REPORT.md` records placements and verification.

## CMS / CRM / booking upgrades

Implement `ContentRepository` with a CMS-backed adapter and replace the exported `content` instance. Preserve normalized types so presentation components do not change. V1 fetches at build time; use a deployment webhook for content updates.

Implement `EnquiryService` for later booking or CRM needs. Before collecting patient details, design server-side validation, access controls, retention, consent and appropriate clinic policies. V1 only opens external phone/WhatsApp/email links and does not collect enquiry data.

## SEO and analytics

Central utilities generate Organization, WebSite, Dentist, PostalAddress, OpeningHoursSpecification, Service, BreadcrumbList and visible FAQPage JSON-LD. No review counts, coordinates, unsupported qualifications or ratings are generated. Meta titles/descriptions are unique; critical content is server rendered.

Vercel Web Analytics is installed through `@vercel/analytics/astro` in the shared `src/layouts/Base.astro` layout, covering all pages. Development uses the SDK's development mode; production builds send page views when deployed to Vercel with Web Analytics enabled. No API key or Next.js integration is needed. In the existing Vercel project, enable **Analytics**, deploy this change, then visit the deployed site and check the dashboard. The analytics endpoint is provided by Vercel and is not available on a local static preview server. The privacy page describes this collection. See the [official setup guide](https://vercel.com/docs/analytics/quickstart).

`src/lib/analytics/client.ts` dispatches local `mydentist:analytics` events for the five approved event names. These stay local and are not forwarded as Vercel custom events. Only the event name is included: no phone numbers, message text, treatment interest, page URLs or medical data. `.env.example` reserves identifiers for other providers; environment IDs alone do not activate them. Review consent requirements and update the privacy copy before enabling additional providers. Search Console verification is supported directly.

## Verification

Playwright covers all routes, metadata uniqueness, branch contact routing, mobile navigation, landmark search, empty results, keyboard Escape behavior, eight viewport sizes, reduced motion, no-JavaScript navigation, internal links, image URLs and sitemap behavior. Axe checks critical page templates. `qa/EDITORIAL-MEDIA-REPORT.md` records the editorial media pass and 35-test verification; `qa/UI-CLARITY-REPORT.md` records the preceding hierarchy, icons and chapter snapping; `qa/BRAND-REFINEMENT-REPORT.md` records the preceding geometry, palette and interaction checks; `qa/ENHANCEMENT-REPORT.md` records the preceding motion pass; `qa/REPORT.md` preserves the original static baseline. Lighthouse measurements are local lab checks, not field Core Web Vitals guarantees.

## Sources and assets

Clinic facts: supplied execution PRD. General educational copy checked against sources in `qa/CONTENT_SOURCES.md`, with no claimed clinical review. Generated imagery and exact prompt are recorded in `public/images/treatments/ASSET_NOTES.md`. Fonts are self-hosted through Fontsource with their package licenses. No stock clinic photos, patient testimonials or implied endorsements.

