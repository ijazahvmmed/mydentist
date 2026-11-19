import type { APIRoute } from 'astro';
import { content } from '../lib/content/repository';
import { primaryPhone } from '../lib/whatsapp';

export const GET: APIRoute = async ({ site }) => {
  const [branches, treatments, technologies] = await Promise.all([
    content.getBranches(),
    content.getTreatments(),
    content.getTechnologies(),
  ]);

  const origin = site ? new URL(site).origin : '';
  const makeUrl = (path: string) => (origin ? `${origin}${path}` : path);

  const lines: string[] = [
    '# Dr Kiran’s MyDentist',
    '',
    '> Modern dental care network with 15+ years of trusted clinical excellence across six clinic locations in Alappuzha, Kerala, India. Specializing in Root Canal Therapy, Dental Implants, Clear Aligners, Fixed Orthodontics, Pediatric Dentistry, Depigmentation, and Advanced 3D Diagnostics (CBCT, OPG, and Intraoral 3D Scanning).',
    '',
    '## Quick Overview & Key Facts',
    '',
    '- **Practice Name**: Dr Kiran’s MyDentist (Kiran’s Dental Hospital)',
    '- **Founded by**: Dr. Kiran',
    '- **Experience**: 15+ years of clinical dentistry across Alappuzha',
    '- **Number of Clinics**: 6 clinic locations in Alappuzha district, Kerala',
    `- **Central Appointment Booking**: ${primaryPhone} (Phone & WhatsApp)`,
    '- **Email**: kiransdentalhospital@gmail.com',
    '- **Working Hours**: Monday – Saturday: 9:00 AM – 6:30 PM | Sunday: 9:00 AM – 1:00 PM',
    `- **Appointment URL**: ${makeUrl('/')}`,
    '',
    '## Primary Web Pages',
    '',
    `- [Home Page](${makeUrl('/')}): Practice overview, technology highlights, service chapters, and branch locator.`,
    `- [Treatments Guide](${makeUrl('/treatments/')}): Comprehensive overview of all dental procedures, indications, and restorative workflows.`,
    `- [Clinic Locations](${makeUrl('/locations/')}): Searchable branch directory with phone numbers, maps, landmarks, and operating hours.`,
    `- [About the Practice](${makeUrl('/about/')}): Clinical philosophy, ethical standards, and patient care principles.`,
    `- [Contact Us](${makeUrl('/contact/')}): Direct phone, WhatsApp, and branch inquiry channels.`,
    '',
    '## Dental Treatments & Clinical Services',
    '',
  ];

  for (const t of treatments) {
    const url = makeUrl(`/treatments/${t.slug}/`);
    lines.push(`### [${t.name}](${url})`);
    lines.push(`- **Summary**: ${t.summary}`);
    lines.push(`- **Introduction**: ${t.introduction}`);
    lines.push(`- **URL**: ${url}`);
    lines.push('');
  }

  lines.push('### Depigmentation');
  lines.push(
    '- **Summary**: Aesthetic treatment for hyperpigmented gums, restoring a natural, uniform, and healthy pink gum appearance using gentle laser or clinical techniques.'
  );
  lines.push(`- **URL**: ${makeUrl('/treatments/cosmetic-dentistry/')}`);
  lines.push('');

  lines.push('## Diagnostic Technology & Equipment');
  lines.push('');
  for (const tech of technologies) {
    lines.push(`### ${tech.displayName || tech.name}`);
    lines.push(`- **Type**: ${tech.label}`);
    lines.push(`- **Clinical Application**: ${tech.summary}`);
    lines.push('');
  }

  lines.push('## Clinic Locations & Contact Details in Alappuzha');
  lines.push('');
  for (const b of branches) {
    const branchUrl = makeUrl(`/locations/${b.slug}/`);
    const hoursStr = b.hours.map((h) => h.label).join(' | ');
    lines.push(`### ${b.name}`);
    lines.push(
      `- **Address**: ${b.address.street}, ${b.address.locality}, ${b.address.region} - ${b.address.postalCode}`
    );
    lines.push(`- **Landmark**: ${b.landmark}`);
    lines.push(`- **Direct Phone**: ${b.phone}`);
    lines.push(`- **WhatsApp Booking**: ${b.whatsapp || primaryPhone}`);
    lines.push(`- **Operating Hours**: ${hoursStr}`);
    lines.push(`- **Branch Page**: ${branchUrl}`);
    lines.push('');
  }

  lines.push('## How to Book an Appointment');
  lines.push('');
  lines.push(
    `1. **WhatsApp**: Message ${primaryPhone} to book an appointment with instant confirmation.`
  );
  lines.push(`2. **Phone**: Call any branch directly or central helpline ${primaryPhone}.`);
  lines.push(
    `3. **Online**: Visit ${makeUrl('/')} and click "Book an appointment" to initiate direct coordination.`
  );
  lines.push('');
  lines.push('## In-Depth Documentation');
  lines.push('');
  lines.push(
    `- [Full LLM Knowledge Base](${makeUrl('/llms-full.txt')}): Complete FAQs, clinical procedures, detailed aftercare guides, and regional patient information.`
  );
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
