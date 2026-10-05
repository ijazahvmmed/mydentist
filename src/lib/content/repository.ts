import type { ContentRepository, Doctor } from '../../types/content';
import { branches } from '../../content/branches';
import { treatments } from '../../content/treatments';
import { faqs } from '../../content/faqs';
const doctors: Doctor[] = [
  {
    id: 'kiran-kishore',
    name: 'Dr Kiran Kishore',
    locationIds: branches.map((b) => b.id),
    treatmentIds: [],
    publish: false,
  },
];
export class LocalContentRepository implements ContentRepository {
  async getBranches() {
    return [...branches].sort((a, b) => a.priority - b.priority);
  }
  async getTreatments() {
    return [...treatments].sort((a, b) => a.priority - b.priority);
  }
  async getDoctors() {
    return doctors.filter((d) => d.publish);
  }
  async getFAQs() {
    return faqs;
  }
}
export const content: ContentRepository = new LocalContentRepository();
