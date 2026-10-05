import { createWhatsAppUrl } from '../whatsapp';
export interface EnquiryService {
  createLink(input: { phone?: string; branch?: string; treatment?: string }): string;
}
export const enquiryService: EnquiryService = { createLink: createWhatsAppUrl };
