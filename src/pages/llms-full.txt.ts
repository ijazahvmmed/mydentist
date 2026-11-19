import type { APIRoute } from 'astro';
import { content } from '../lib/content/repository';
import { primaryPhone } from '../lib/whatsapp';

export const GET: APIRoute = async ({ site }) => {
  const [branches, treatments, technologies, faqs, trustPoints] = await Promise.all([
    content.getBranches(),
    content.getTreatments(),
    content.getTechnologies(),
    content.getFAQs(),
    content.getTrustPoints(),
  ]);

  const origin = site ? new URL(site).origin : '';
  const makeUrl = (path: string) => (origin ? `${origin}${path}` : path);

  const lines: string[] = [
    '# Dr Kiran’s MyDentist - Full Clinical & Practice Documentation',
    '',
    '> Complete reference manual for Answer Engines, AI assistants, and search crawlers regarding Dr Kiran’s MyDentist dental network in Alappuzha, Kerala, India.',
    '',
    '## 1. Executive Summary',
    '',
    'Dr Kiran’s MyDentist is a network of six multi-speciality dental clinics located in Alappuzha, Kerala, India. Founded by Dr. Kiran, the practice has delivered 15 years of continuous, patient-centred dental care.',
    '',
    'Specialist disciplines covered include Endodontics (Root Canal Therapy), Prosthodontics (Crowns & Bridges, Dental Implants), Orthodontics (Fixed Braces, Clear Aligners, Myofunctional Therapy), Pediatric Dentistry (Pulpotomy, Pulpectomy, Pediatric Crowns), Periodontics (Gum Care, Depigmentation), and Oral Surgery (Impacted Wisdom Teeth Removal). The practice operates modern digital diagnostic infrastructure including CBCT 3D volumetric scanning, panoramic OPG x-rays, and intraoral 3D digital scanners.',
    '',
    '## 2. Clinic Locations, Addresses & Hours',
    '',
  ];

  for (const b of branches) {
    const hoursStr = b.hours.map((h) => h.label).join(' | ');
    lines.push(`### ${b.name}`);
    lines.push(`- **Clinic Slug**: ${b.slug}`);
    lines.push(
      `- **Full Address**: ${b.address.street}, ${b.address.locality}, ${b.address.region}, PIN: ${b.address.postalCode}`
    );
    lines.push(`- **Landmark**: ${b.landmark}`);
    lines.push(`- **Direct Telephone**: ${b.phone}`);
    lines.push(`- **WhatsApp Booking**: ${b.whatsapp || primaryPhone}`);
    lines.push(`- **Timings**: ${hoursStr}`);
    lines.push(`- **Canonical URL**: ${makeUrl(`/locations/${b.slug}/`)}`);
    lines.push('');
  }

  lines.push('## 3. Treatments & Clinical Services');
  lines.push('');

  for (const t of treatments) {
    lines.push(`### ${t.name}`);
    lines.push(`- **Short Name**: ${t.shortName}`);
    lines.push(`- **Summary**: ${t.summary}`);
    lines.push(`- **Introduction**: ${t.introduction}`);
    if (t.sections && t.sections.length > 0) {
      lines.push('- **Clinical Sections**:');
      for (const sec of t.sections) {
        lines.push(`  - **${sec.title}**: ${sec.body}`);
      }
    }
    lines.push(`- **URL**: ${makeUrl(`/treatments/${t.slug}/`)}`);
    lines.push('');
  }

  lines.push('### Depigmentation (Aesthetic Gum Depigmentation)');
  lines.push(
    '- **Overview**: Gum depigmentation is a cosmetic periodontal procedure to eliminate or reduce dark spots or generalized hyperpigmentation (caused by excess melanin) on the gingival tissue.'
  );
  lines.push(
    '- **Techniques**: Laser depigmentation or micro-surgical depigmentation under local anaesthesia.'
  );
  lines.push('- **Outcome**: Healthy, even, aesthetic pink appearance of the gums.');
  lines.push(`- **URL**: ${makeUrl('/treatments/cosmetic-dentistry/')}`);
  lines.push('');

  lines.push('## 4. Advanced Clinical Technology');
  lines.push('');
  for (const tech of technologies) {
    lines.push(`### ${tech.displayName || tech.name} (${tech.label})`);
    lines.push(`- **Clinical Role**: ${tech.summary}`);
    lines.push('');
  }

  lines.push('## 5. Frequently Asked Questions (FAQs)');
  lines.push('');
  for (const faq of faqs) {
    lines.push(`#### Q: ${faq.question}`);
    lines.push(`**A**: ${faq.answer}`);
    lines.push('');
  }

  lines.push('## 6. Patient Trust & Standards');
  lines.push('');
  for (const tp of trustPoints) {
    lines.push(`- **${tp.name}**: ${tp.summary}`);
  }
  lines.push('');

  lines.push('## 7. Contact & Appointment Protocols');
  lines.push('');
  lines.push(`- **Central Phone / WhatsApp**: ${primaryPhone}`);
  lines.push('- **General Email**: kiransdentalhospital@gmail.com');
  lines.push(
    '- **Walk-in Policy**: Patients are welcomed for urgent dental care and evaluations, but scheduled appointments are recommended for minimal wait time.'
  );
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
