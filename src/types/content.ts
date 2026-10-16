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
  serviceIds?: string[];
  categoryIds?: string[];
}
export interface ServiceCategory {
  id: string;
  number: string;
  name: string;
  summary: string;
  serviceIds: string[];
  mediaAsset: 'smile-closeup' | 'dental-implant' | 'clear-aligner' | 'consultation';
}
export interface Service {
  id: string;
  name: string;
  summary: string;
  categoryIds: string[];
  treatmentId?: string;
}
export interface Technology {
  id: string;
  name: string;
  displayName?: string;
  number: string;
  label: string;
  summary: string;
  visual: 'scan' | 'cbct' | 'opg';
  faqId: string;
  media: MediaAsset;
}
export interface TrustPoint {
  id: string;
  number: string;
  name: string;
  summary: string;
  href: string;
  displayValue?: string;
  label?: string;
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
  getServiceCategories(): Promise<ServiceCategory[]>;
  getServices(): Promise<Service[]>;
  getTechnologies(): Promise<Technology[]>;
  getTrustPoints(): Promise<TrustPoint[]>;
}
