import type { Branch, OpeningHours } from '../types/content';
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const regular: OpeningHours[] = [
  { days: weekdays, opens: '09:00', closes: '18:30', label: 'Mon–Sat · 9:00 AM–6:30 PM' },
  { days: ['Sunday'], opens: '09:00', closes: '13:00', label: 'Sunday · 9:00 AM–1:00 PM' },
];
const rows = [
  [
    'thuravoor',
    'Thuravoor',
    'KK Building, Opposite Thuravoor Mahadeva Temple',
    'Thuravoor, Alappuzha',
    '688532',
    '+91 82818 85542',
    'Opposite Thuravoor Mahadeva Temple',
  ],
  [
    'poochakkal',
    'Poochakkal',
    'Panavally, Aroorkutty Road, Near Lyceum Junction',
    'Alappuzha',
    '688526',
    '+91 89433 15611',
    'Near Lyceum Junction',
  ],
  [
    'eramalloor',
    'Eramalloor',
    'Eramalloor P.O.',
    'Alappuzha',
    '688537',
    '+91 62353 50388',
    'Opposite HDFC Bank',
  ],
  [
    'thirunalloor',
    'Thirunalloor',
    'Pallipuram, Thirunalloor P.O.',
    'Cherthala, Alappuzha',
    '688541',
    '+91 73066 02757',
    'Near Thirunalloor Service Cooperative Bank',
  ],
  [
    'aroor',
    'Aroor',
    'Kannikattu Building, Aroor P.O.',
    'Alappuzha',
    '688534',
    '+91 87140 54348',
    'Near Aroor Church',
  ],
  [
    'vaduthala',
    'Vaduthala',
    'Thrichattukulam, Ithiyapalam P.O.',
    'Cherthala',
    '688526',
    '+91 89210 65625',
    'Opposite Welcare Multi-Speciality Clinic',
  ],
];
export const branches: Branch[] = rows.map(
  ([slug, locality, street, city, postalCode, phone, landmark], i) => ({
    id: slug,
    slug,
    name: `MyDentist ${locality}`,
    locality,
    address: { street, locality: city, region: 'Kerala', postalCode, country: 'IN' },
    phone,
    whatsapp: i === 0 ? phone : undefined,
    landmark,
    personInCharge: 'Dr Kiran Kishore',
    hours:
      i === 0
        ? [
            {
              days: [...weekdays, 'Sunday'],
              opens: '09:00',
              closes: '20:00',
              label: 'Mon–Sun · 9:00 AM–8:00 PM',
            },
          ]
        : regular,
    photos: [],
    treatmentIds: [],
    doctorIds: ['kiran-kishore'],
    priority: i,
    seo: {
      title: `MyDentist ${locality} | Address, Hours & Contact`,
      description: `Find MyDentist ${locality}: ${landmark}. View the full address, opening hours and call ${phone} to enquire about a visit.`,
    },
  })
);
