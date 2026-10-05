import type { FAQ } from '../types/content';
import { treatments } from './treatments';
export const homeFAQs: FAQ[] = [
  {
    id: 'locations',
    question: 'Where can I find a MyDentist clinic?',
    answer:
      'MyDentist has six locations: Thuravoor, Poochakkal, Eramalloor, Thirunalloor, Aroor and Vaduthala. Use the clinic finder for addresses, landmarks and phone numbers.',
  },
  {
    id: 'contact',
    question: 'How do I enquire about an appointment?',
    answer:
      'Call your preferred branch or message the central WhatsApp number, +91 82818 85542. The clinic will help you with availability. Sending an enquiry does not confirm an appointment.',
  },
  {
    id: 'sunday',
    question: 'Are the clinics open on Sunday?',
    answer:
      'Thuravoor is open on Sundays from 9:00 AM to 8:00 PM. The other five clinics are open from 9:00 AM to 1:00 PM. Please contact the branch to confirm holiday hours before travelling.',
  },
  {
    id: 'treatment',
    question: 'How do I know which treatment I need?',
    answer:
      'A dental assessment is needed to understand your concerns and discuss appropriate options. You can read the treatment guides before your visit and contact the clinic with questions.',
  },
];
export const faqs: FAQ[] = [
  ...homeFAQs,
  ...treatments.flatMap((t) => [
    {
      id: `${t.id}-suitability`,
      question: `Is ${t.shortName.toLowerCase()} suitable for me?`,
      answer:
        'Suitability depends on a dental assessment, your oral health and your individual needs. Your dentist will discuss options, limitations and alternatives with you.',
    },
    {
      id: `${t.id}-visit`,
      question: 'How can I discuss this treatment with MyDentist?',
      answer: `Contact your preferred branch or use WhatsApp to enquire about ${t.name.toLowerCase()}. Confirm treatment availability at that branch and the appointment arrangements before travelling.`,
    },
  ]),
];
