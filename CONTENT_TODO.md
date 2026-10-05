# Client content and launch checklist

The supplied PRD is the source of truth for brand, branch addresses, phone numbers, hours, treatment names and equipment names. Only the two visual references and PRD were supplied; there were no additional client photographs or onboarding documents in the workspace.

## Needed before public launch
- Set the verified production HTTPS origin in `SITE_URL`. Unconfigured builds intentionally block indexing, omit absolute canonicals and produce an empty sitemap. Build again after setting the domain.
- Supplied mydentist logo is now used, with its sampled #244185 blue. A higher-resolution/vector version would improve future large-format use.
- Have the clinic approve the educational copy, privacy notice and terms. Do not populate medical review metadata without real review.
- Confirm the hosting provider and its technical-log retention. Expand the privacy notice with clinic data-handling practices and appropriate legal review before collecting personal data.

## Assets deliberately omitted
- Real clinic, team and equipment photographs; official logo; verified Instagram and Facebook URLs.
- Reviews, patient names, counts, awards, prices, offers and outcome statistics.
- Doctor qualifications, specialties, years of experience and publishable biographies. Dr Kiran Kishore is identified only as the supplied person in charge. Doctor publishing remains off.
- Establishment information: “15” is ambiguous and has not been interpreted as a year.

## Internal anatomy gate
- A commercially licensed external molar is now enabled, with source and CC BY 4.0 attribution in `public/models/README.md` and the homepage.
- Internal pulp/root-canal cutaways remain disabled. Supply clinically reviewed, properly licensed internal geometry before adding them; do not infer internal anatomy from the exterior mesh.
- Treatment CGI and technology visuals are illustrative, not patient results or photographs of the clinic's equipment.

## Branch-specific confirmation
- Only +91 82818 85542 is confirmed as WhatsApp. Other branches use this central WhatsApp number with branch context, and their own verified numbers for phone calls. Populate `branch.whatsapp` only after confirmation.
- Obtain exact Google Maps place URLs. Current links perform clearly labelled address searches; no coordinates or verified map pins are invented.
- Confirm treatment/equipment availability per branch. `treatmentIds`/`branchIds` are deliberately empty; links are labelled as guides and ask patients to confirm availability.
- Confirm holiday hours and any accessibility/parking/entrance information before publishing it.

## Optional integrations
- GA4, Search Console, Google Ads and Meta identifiers; appropriate consent configuration and privacy updates before tracker activation.
- No CMS, CRM, ERP, appointment booking, patient data form or tracker is installed.
