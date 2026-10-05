export interface SEOFields {
  title: string;
  description: string;
}
export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: 'photo' | 'illustration';
}
export interface OpeningHours {
  days: string[];
  opens: string;
  closes: string;
  label: string;
}
export interface Branch {
  id: string;
  slug: string;
  name: string;
  locality: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  whatsapp?: string;
  landmark: string;
  personInCharge?: string;
  hours: OpeningHours[];
  mapUrl?: string;
  photos: MediaAsset[];
  treatmentIds: string[];
  doctorIds: string[];
  priority: number;
  seo: SEOFields;
}
export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
export interface Treatment {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  introduction: string;
  sections: { title: string; body: string }[];
  faqIds: string[];
  branchIds: string[];
  priority: number;
  media: MediaAsset[];
  seo: SEOFields;
  medicallyReviewedBy?: string;
  reviewedAt?: string;
}
export interface Doctor {
  id: string;
  name: string;
  qualification?: string;
  specialisation?: string;
  bio?: string;
  yearsOfExperience?: number;
  locationIds: string[];
  treatmentIds: string[];
  photo?: MediaAsset;
  publish: boolean;
}
export interface ContentRepository {
  getBranches(): Promise<Branch[]>;
  getTreatments(): Promise<Treatment[]>;
  getDoctors(): Promise<Doctor[]>;
  getFAQs(): Promise<FAQ[]>;
}
