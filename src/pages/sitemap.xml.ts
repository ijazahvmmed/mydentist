import type { APIRoute } from 'astro';
import { content } from '../lib/content/repository';
export const GET: APIRoute = async ({ site }) => {
  const [branches, treatments] = await Promise.all([
    content.getBranches(),
    content.getTreatments(),
  ]);
  const paths = [
    '/',
    '/treatments/',
    '/locations/',
    '/about/',
    '/contact/',
    '/privacy-policy/',
    '/terms/',
    ...branches.map((b) => `/locations/${b.slug}/`),
    ...treatments.map((t) => `/treatments/${t.slug}/`),
  ];
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? paths.map((path) => `<url><loc>${escape(new URL(path, site).href)}</loc></url>`).join('') : ''}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
};
