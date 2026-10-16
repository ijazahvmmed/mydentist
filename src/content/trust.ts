import type { TrustPoint } from '../types/content';
import { technologyAvailability } from './technologies';

export const careExperience = {
  years: 15,
  label: 'YEARS OF CARE',
  description: '15 years of dental care',
};
export const trustPoints: TrustPoint[] = [
  {
    id: 'advanced-equipment',
    number: '01',
    name: 'Advanced equipment',
    summary: `Intraoral Scanner, CBCT and OPG panoramic imaging support different views of your care. ${technologyAvailability}`,
    href: '#technology',
  },
  {
    id: 'years-of-care',
    number: '02',
    name: careExperience.description,
    summary:
      'Care built around understanding your concerns, explaining your options and planning the next step with you.',
    displayValue: String(careExperience.years),
    label: careExperience.label,
    href: '/about/',
  },
  {
    id: 'endodontic-care',
    number: '03',
    name: 'Full-time endodontic care',
    summary:
      'Access to a full-time endodontist for assessment and root canal care. Contact your clinic to arrange a consultation.',
    href: '/treatments/root-canal-treatment/',
  },
];
