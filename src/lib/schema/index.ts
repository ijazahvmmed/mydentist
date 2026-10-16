import type { Branch, FAQ, Treatment, ServiceCategory, Service } from '../../types/content';
import { serviceCategories, services } from '../../content/services';
import { serviceDirectoryHref } from '../../content/services';
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
  category: serviceCategories.filter((c) => t.categoryIds?.includes(c.id)).map((c) => c.name),
  hasOfferCatalog: t.serviceIds?.length
    ? {
        '@type': 'OfferCatalog',
        name: `${t.name} care options`,
        itemListElement: services
          .filter((s) => t.serviceIds?.includes(s.id))
          .map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', '@id': absolute(serviceDirectoryHref(s), site), identifier: s.id, name: s.name, description: s.summary },
          })),
      }
    : undefined,
});
export const serviceCatalog = (categories: ServiceCategory[], items: Service[], site?: URL) => ({
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: `${brand} dental services`,
  url: absolute('/treatments/', site),
  itemListElement: categories.map((category) => ({
    '@type': 'OfferCatalog',
    name: category.name,
    description: category.summary,
    itemListElement: category.serviceIds
      .map((id) => items.find((item) => item.id === id)!)
      .map((item) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          '@id': absolute(serviceDirectoryHref(item), site),
          identifier: item.id,
          name: item.name,
          description: item.summary,
          url: absolute(serviceDirectoryHref(item, category.id), site),
          provider: { '@type': 'Organization', name: brand },
        },
      })),
  })),
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
