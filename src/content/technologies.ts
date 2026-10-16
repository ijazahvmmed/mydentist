import type { Technology } from '../types/content';

export const technologyAvailability =
  'Advanced dental technology is available within the MyDentist clinic network. Ask your clinic about availability.';

export const technologies: Technology[] = [
  {
    id: 'intraoral-scanner',
    name: 'Intraoral Scanner',
    number: '01',
    label: 'DIGITAL IMPRESSIONS',
    visual: 'scan',
    faqId: 'intraoral-scanner',
    summary: 'A digital view of the teeth and mouth, to support assessment and treatment planning.',
    media: {
      src: '/images/technology/arch-study.webp',
      alt: 'Illustrative digital surface study of a dental arch.',
      width: 800,
      height: 500,
      kind: 'illustration',
    },
  },
  {
    id: 'cbct',
    name: 'CBCT',
    number: '02',
    label: '3D DENTAL IMAGING',
    visual: 'cbct',
    faqId: 'cbct',
    summary:
      'Cone beam computed tomography creates three-dimensional views of teeth, jaw bone and surrounding structures. Your dentist decides whether this imaging is needed.',
    media: {
      src: '/images/technology/cbct-volume.webp',
      alt: 'Illustrative three-dimensional jaw volume with sectional imaging planes; not a patient scan.',
      width: 1448,
      height: 1086,
      kind: 'illustration',
    },
  },
  {
    id: 'opg',
    name: 'OPG',
    displayName: 'OPG Full-Mouth Imaging',
    number: '03',
    label: 'FULL-MOUTH VIEW',
    visual: 'opg',
    faqId: 'opg',
    summary:
      'A panoramic dental X-ray that provides a broad view of the teeth, jaws and surrounding structures. Your dentist decides when this type of imaging is appropriate.',
    media: {
      src: '/images/technology/opg-panoramic.webp',
      alt: 'Illustrative panoramic dental image showing upper and lower teeth, roots and jaw structure; not a patient radiograph.',
      width: 1600,
      height: 800,
      kind: 'illustration',
    },
  },
];
