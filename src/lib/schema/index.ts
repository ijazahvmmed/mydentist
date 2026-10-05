import type { Branch, FAQ, Treatment } from '../../types/content';
import { brand, absolute } from '../seo';
export const organization = (site?: URL) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: brand,
  url: site?.href,
  telephone: '+91 82818 85542',
  email: 'kiransdentalhospital@gmail.com',
});
export const website = (site?: URL) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: brand,
  url: site?.href,
});
export const dentist = (b: Branch, site?: URL) => ({
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  name: b.name,
  url: absolute(`/locations/${b.slug}/`, site),
  telephone: b.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: b.address.street,
    addressLocality: b.address.locality,
    addressRegion: b.address.region,
    postalCode: b.address.postalCode,
    addressCountry: b.address.country,
  },
  openingHoursSpecification: b.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
    opens: h.opens,
    closes: h.closes,
  })),
  parentOrganization: { '@type': 'Organization', name: brand },
});
export const service = (t: Treatment, site?: URL) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: t.name,
  description: t.introduction,
  url: absolute(`/treatments/${t.slug}/`, site),
  provider: { '@type': 'Organization', name: brand },
});
export const faqSchema = (items: FAQ[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});
export const breadcrumbs = (items: { name: string; path: string }[], site?: URL) =>
  site
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: absolute(item.path, site),
        })),
      }
    : null;
