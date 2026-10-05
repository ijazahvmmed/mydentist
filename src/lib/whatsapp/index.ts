export const primaryPhone = '+91 82818 85542';
export const phoneHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;
export function createWhatsAppUrl({
  phone = primaryPhone,
  branch,
  treatment,
}: { phone?: string; branch?: string; treatment?: string } = {}) {
  const subject = treatment ? `about ${treatment}` : 'about an appointment';
  const message = `Hi, I'd like to enquire ${subject} at ${branch || "Dr Kiran's MyDentist"}.`;
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
