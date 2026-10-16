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
  {
    id: 'opg',
    question: 'What is OPG imaging?',
    answer:
      'OPG is a panoramic dental X-ray that gives a broad view of the teeth, jaws and surrounding structures. Your dentist decides when this type of imaging is appropriate. Ask your clinic about availability.',
  },
  {
    id: 'cbct',
    question: 'What is CBCT in dentistry?',
    answer:
      'Cone beam computed tomography uses X-rays to create three-dimensional images of teeth, jaw bone and surrounding structures. It is used when your dentist needs information beyond a two-dimensional view; it is not required for every visit.',
  },
  {
    id: 'intraoral-scanner',
    question: 'What does an intraoral scanner do?',
    answer:
      'An intraoral scanner records the visible surfaces of teeth and gums to create a digital impression. It supports assessment and treatment planning. It is different from an X-ray and does not show the inside of teeth or jaw bone.',
  },
  {
    id: 'children-treatments',
    question: 'What treatments are available for children?',
    answer:
      'Pediatric care includes pulpectomy, pulpotomy, pediatric crowns, myofunctional therapy and habit-breaking appliances when appropriate. A dentist assesses your child’s teeth, development and needs before recommending care. Confirm availability with your chosen clinic.',
  },
  {
    id: 'pulpotomy-pulpectomy',
    question: 'What is the difference between pulpotomy and pulpectomy?',
    answer:
      'A pulpotomy removes affected pulp from the crown of a baby tooth while retaining suitable tissue in the roots. A pulpectomy removes pulp from both the crown and root canals. The condition of the tooth guides the choice.',
  },
  {
    id: 'root-canal-care',
    question: 'Does MyDentist provide Root Canal Therapy?',
    answer:
      'Yes. Root Canal Therapy is a priority service at MyDentist, with access to full-time endodontic care. Contact your clinic to discuss assessment, appointment arrangements and the restoration your tooth may need afterwards.',
  },
  {
    id: 'aligner-care',
    question: 'Does MyDentist provide clear aligners?',
    answer:
      'Yes. Clear aligners are part of MyDentist’s orthodontic services. A dental assessment is needed to decide whether they are suitable for your teeth and bite and to explain the wearing and review plan.',
  },
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
