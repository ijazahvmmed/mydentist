import type { Service, ServiceCategory } from '../types/content';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'restorative-endodontics',
    number: '01',
    name: 'Restorative & Endodontics',
    summary: 'Care for the inside of a tooth, its strength and its appearance.',
    serviceIds: ['root-canal', 'crowns', 'tooth-coloured-fillings', 'veneers', 'tooth-jewellery'],
    mediaAsset: 'smile-closeup',
  },
  {
    id: 'surgical-periodontal',
    number: '02',
    name: 'Surgical & Periodontal Care',
    summary: 'Considered care for teeth, gums and the structures that support them.',
    serviceIds: [
      'dental-trauma',
      'wisdom-tooth-removal',
      'gum-depigmentation',
      'periodontal-therapy',
      'dental-implants',
    ],
    mediaAsset: 'dental-implant',
  },
  {
    id: 'orthodontics',
    number: '03',
    name: 'Orthodontics',
    summary: 'Explore alignment, bite and the way your teeth work together.',
    serviceIds: ['fixed-braces', 'clear-aligners', 'myofunctional-therapy'],
    mediaAsset: 'clear-aligner',
  },
  {
    id: 'pediatric-dentistry',
    number: '04',
    name: 'Pediatric Dentistry',
    summary: 'Thoughtful, age-appropriate care for developing teeth and growing smiles.',
    serviceIds: [
      'pulpectomy',
      'pulpotomy',
      'pediatric-crowns',
      'myofunctional-therapy',
      'habit-breaking-appliances',
    ],
    mediaAsset: 'consultation',
  },
];

export const services: Service[] = [
  {
    id: 'root-canal',
    name: 'Root Canal Therapy',
    summary: 'Treatment of the tissue inside a tooth, followed by a plan to restore it.',
    categoryIds: ['restorative-endodontics'],
    treatmentId: 'root-canal-treatment',
  },
  {
    id: 'crowns',
    name: 'Crowns',
    summary: 'A covering to restore the shape and function of a tooth when appropriate.',
    categoryIds: ['restorative-endodontics'],
    treatmentId: 'crowns-bridges',
  },
  {
    id: 'tooth-coloured-fillings',
    name: 'Tooth-Coloured Fillings',
    summary: 'Restorations selected to blend with the shade of the surrounding tooth.',
    categoryIds: ['restorative-endodontics'],
  },
  {
    id: 'veneers',
    name: 'Veneers',
    summary:
      'Thin coverings for selected changes to the visible surface of teeth. Suitability and preparation vary.',
    categoryIds: ['restorative-endodontics'],
  },
  {
    id: 'tooth-jewellery',
    name: 'Tooth Jewellery',
    summary:
      'Decorative tooth accessories, with an assessment and a discussion about care and removal.',
    categoryIds: ['restorative-endodontics'],
  },
  {
    id: 'dental-trauma',
    name: 'Dental Trauma Management',
    summary:
      'Assessment and care for injured teeth and supporting tissues. Contact a dentist promptly after an injury.',
    categoryIds: ['surgical-periodontal'],
  },
  {
    id: 'wisdom-tooth-removal',
    name: 'Wisdom Tooth Removal',
    summary:
      'Assessment, treatment planning and aftercare when a wisdom tooth needs to be removed.',
    categoryIds: ['surgical-periodontal'],
    treatmentId: 'wisdom-tooth-removal',
  },
  {
    id: 'gum-depigmentation',
    name: 'Gum Depigmentation',
    summary:
      'An assessment of gum pigmentation and a discussion of treatment options, limitations and aftercare.',
    categoryIds: ['surgical-periodontal'],
  },
  {
    id: 'periodontal-therapy',
    name: 'Periodontal Therapy / Gum Care',
    summary: 'Care for the gums and tooth-supporting tissues, guided by a periodontal assessment.',
    categoryIds: ['surgical-periodontal'],
  },
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    summary:
      'A tooth-replacement option that requires individual assessment, planning and ongoing care.',
    categoryIds: ['surgical-periodontal'],
    treatmentId: 'dental-implants',
  },
  {
    id: 'fixed-braces',
    name: 'Fixed Braces / Straight-Wire Orthodontics',
    summary:
      'Fixed appliances used to guide tooth movement as part of an individual orthodontic plan.',
    categoryIds: ['orthodontics'],
    treatmentId: 'braces-orthodontics',
  },
  {
    id: 'clear-aligners',
    name: 'Clear Aligners',
    summary: 'Removable trays that gradually move teeth, with a wearing and review plan.',
    categoryIds: ['orthodontics'],
    treatmentId: 'clear-aligners',
  },
  {
    id: 'myofunctional-therapy',
    name: 'Myofunctional Therapy',
    summary:
      'Assessment-led exercises and guidance for oral muscle function and habits. It may complement other care.',
    categoryIds: ['orthodontics', 'pediatric-dentistry'],
  },
  {
    id: 'pulpectomy',
    name: 'Pulpectomy',
    summary:
      'Removal of affected pulp from the crown and root canals of a baby tooth when indicated.',
    categoryIds: ['pediatric-dentistry'],
  },
  {
    id: 'pulpotomy',
    name: 'Pulpotomy',
    summary:
      'Removal of affected pulp in the crown of a baby tooth, with care to retain suitable tissue in the roots.',
    categoryIds: ['pediatric-dentistry'],
  },
  {
    id: 'pediatric-crowns',
    name: 'Pediatric Crowns',
    summary:
      'Protective coverings for children’s teeth when a filling alone may not provide enough support.',
    categoryIds: ['pediatric-dentistry'],
  },
  {
    id: 'habit-breaking-appliances',
    name: 'Habit-Breaking Appliances',
    summary: 'Appliances considered for oral habits that may affect developing teeth or the bite.',
    categoryIds: ['pediatric-dentistry'],
  },
];

/** A shared service has one record, even when it belongs to more than one family. */
export const serviceDirectoryHref = (item: Service, categoryId = item.categoryIds[0]) =>
  item.treatmentId ? `/treatments/${item.treatmentId}/` : `/treatments/#${categoryId}-${item.id}`;
