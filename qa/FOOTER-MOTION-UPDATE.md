# Footer and reveal update

## Scope

- The homepage tooth story is disabled by `showToothStory = false`; the components remain available to restore. No tooth island is mounted, and both homepage links have valid replacement destinations.
- Headings, images, service lists and clinic links now enter at their own viewport positions. Tall service sections previously triggered their lower text before it reached a phone viewport.
- Line rises take 1.1 seconds with a 140 ms line stagger. Image openings take 1.1–1.35 seconds, with a more pronounced initial scale that clears when complete.
- The footer uses the existing navy/blue palette, all six clinic links, contact links, an invitation and the supplied inverse wordmark at full width. Its wordmark rises from a mask.
- The credit remains plain “Website by Unknown”, without a link.

## Design guidance

Reference: [GoCanopy](https://gocanopy.tech/), reviewed in the browser. Adapted its full-width wordmark, compact navigation groups and contact rail; its copy, brand assets and colours were not reused.

Installed `Leonxlnx/taste-skill` using `npx --yes skills add Leonxlnx/taste-skill --agent codex --yes`. Guidance is in `.agents/skills/design-taste-frontend/SKILL.md`. This is a section update within an existing design, so no new direction was drawn. The user's previously requested glass controls and existing type/brand system take precedence over conflicting skill defaults.

## Validation

- `npm run build`: 23 pages built; Astro reports no errors, warnings or hints. Vite retains the existing large JavaScript chunk advisory.
- Taste Skill source lint on `Footer.astro` and `footer.css`: 0 FAIL, 0 WARN.
- Reviewed the production preview at 1440, 768 and 390 CSS pixels using the browser tools; no horizontal overflow at these widths. Footer title stays on two lines, wordmark proportions are preserved and contact/clinic links fit.
- The skill's separate browser inspector was not run; browser interaction and screenshots used the session's browser tools instead.
- Reduced-motion emulation: no hidden `h1`/`h2`, no split-line wrappers, and all footer content remains visible.
- Phone reveal check: an off-screen service heading starts at opacity 0. On entering the viewport, its first line is moving while its second line is still waiting for the stagger; both settle to the readable state.

## Visual critique

ROUND 1

Seen in one second: MyDentist's name closes the page; clinic and contact options are easy to find.

Idea: the smile in the supplied MyDentist wordmark becomes the final, full-width brand gesture.

Live thing: existing clinic finder, enquiry links and navigation remain functional; no new widget was needed.

Layout words by section: footer = statement and navigation / contact rail / oversized wordmark / utility row.

Scores (subjective, footer only): design 8 · usability 8 · creativity 7 · content 8 → overall 7.8.

Caps applied: no full-site Taste Skill pass or award-level claim; the user's glass styling is an explicit retained constraint.

Top three problems addressed:

1. The previous footer ended with a small wordmark and a second closing CTA. The new footer combines these into a single designed ending.
2. A desktop layout squeezed into a phone would cramp the contact invitation. The phone uses a stacked intro, two navigation columns and a full-width contact rail.
3. Section-wide reveal triggers ran text animations too early. Individual headings and images now trigger at their own positions, with reduced-motion cleanup verified.
