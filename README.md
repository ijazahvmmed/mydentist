# Dr Kiran’s MyDentist

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

- Edit branches in `src/content/branches.ts`; preserve verified facts and Thuravoor’s first position.
- Add a branch to the typed data, with a stable slug, complete address, verified phone/hours and unique location details. Its route, directory entry and sitemap entry generate automatically. Add exact map URLs and branch photos when supplied.
- Edit or add treatments in `src/content/treatments.ts`, and add corresponding FAQs in `src/content/faqs.ts`. Pages and sitemap entries generate automatically. Add unique, clinically reviewed explanations. Do not imply availability at every branch unless verified.
- Doctor records live in the local repository. Add verified qualifications, biography and photo before setting `publish: true`; no doctor routes are generated yet. Create a doctor page only when sufficient content exists.
- Media assets support photo/illustration distinction, alt text and dimensions. Put verified assets under `public/images/{brand,locations,doctors,equipment,treatments,social,misc}`. Use responsive WebP/AVIF and explicit dimensions. Never hotlink private Drive assets.
- WhatsApp URLs are generated centrally by `src/lib/whatsapp/index.ts`, through the enquiry-service adapter when used in treatment pages. Branches without confirmed WhatsApp use the central confirmed number with branch context.

## Real-time tooth and motion

The homepage uses a shared React Three Fiber tooth canvas for the hero and a four-chapter external-tooth story. A licensed 27,704-triangle refined molar rotates in perspective, moves between copy columns, shifts into contour/wireframe scanning and root focus, then returns to ivory enamel. It does not depict internal anatomy. Source, licence and adaptations are in `public/models/README.md`.

The scene hydrates after critical HTML, uses demand rendering, caps DPR at 1.5 desktop / 1.25 mobile, and stops frame requests while idle, hidden or outside its sections. Mobile uses a centred tooth with a sticky horizontal text track, driven by vertical scrolling and chapter snapping; numbered controls jump directly to a chapter. Static posters remain on model/context failure, without JavaScript and with reduced motion. All routes, treatment/branch records, contact links and SEO remain static-first.

`src/animations/index.ts` provides measured line-mask headings, observed section entrances, image masks and restrained scroll parallax. GSAP owns scroll timelines; CSS owns hover/pressed feedback. Native scrolling is preserved. Technology cards lazy-load real external dental-arch geometry with continuously repeating surface scans, pausing offscreen or when the document is hidden. SVGs remain as non-WebGL/reduced-motion fallbacks. Treatment illustrations are separate from verified records in `src/lib/treatment-visuals.ts`; exact generation prompts are in `assets/generated/ENHANCEMENT-PROMPTS.md`.

## CMS / CRM / booking upgrades

Implement `ContentRepository` with a CMS-backed adapter and replace the exported `content` instance. Preserve normalized types so presentation components do not change. V1 fetches at build time; use a deployment webhook for content updates.

Implement `EnquiryService` for later booking or CRM needs. Before collecting patient details, design server-side validation, access controls, retention, consent and appropriate clinic policies. V1 only opens external phone/WhatsApp/email links and does not collect enquiry data.

## SEO and analytics

Central utilities generate Organization, WebSite, Dentist, PostalAddress, OpeningHoursSpecification, Service, BreadcrumbList and visible FAQPage JSON-LD. No review counts, coordinates, unsupported qualifications or ratings are generated. Meta titles/descriptions are unique; critical content is server rendered.

`src/lib/analytics/client.ts` dispatches local `mydentist:analytics` events for the five approved event names. Only the event name is included: no phone numbers, message text, treatment interest, page URLs or medical data. `.env.example` reserves integration identifiers. There are deliberately no network trackers yet. Wire providers only behind an appropriate consent manager and update privacy copy; environment IDs alone do not activate tracking. Search Console verification is supported directly.

## Verification

Playwright covers all routes, metadata uniqueness, branch contact routing, mobile navigation, landmark search, empty results, keyboard Escape behavior, eight viewport sizes, reduced motion, no-JavaScript navigation, internal links, image URLs and sitemap behavior. Axe checks critical page templates. `qa/UI-CLARITY-REPORT.md` records the latest hierarchy, icons, chapter snapping and 33-test verification; `qa/BRAND-REFINEMENT-REPORT.md` records the preceding geometry, palette and interaction checks; `qa/ENHANCEMENT-REPORT.md` records the preceding motion pass; `qa/REPORT.md` preserves the original static baseline. Lighthouse measurements are local lab checks, not field Core Web Vitals guarantees.

## Sources and assets

Clinic facts: supplied execution PRD. General educational copy checked against sources in `qa/CONTENT_SOURCES.md`, with no claimed clinical review. Generated imagery and exact prompt are recorded in `public/images/treatments/ASSET_NOTES.md`. Fonts are self-hosted through Fontsource with their package licenses. No stock clinic photos, patient testimonials or implied endorsements.

