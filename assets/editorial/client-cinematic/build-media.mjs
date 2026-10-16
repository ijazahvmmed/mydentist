import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const manifestPath = path.join(root, 'src/lib/editorial-media.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entries = [
  {
    id: 'lifestyle-at-home-client',
    file: 'lifestyle-at-home.png',
    alt: 'Two people sharing a laugh on a sofa at home, editorial lifestyle imagery.',
    caption: 'Editorial lifestyle image · Not a treatment result',
    position: '50% 44%',
  },
  {
    id: 'endodontic-review-client',
    file: 'endodontic-review.png',
    alt: 'An editorial consultation scene with a clinician pointing to a dental image on a monitor.',
    caption: 'Editorial consultation · Not a MyDentist clinician or patient',
    position: '48% 48%',
  },
  {
    id: 'clinical-light-client',
    file: 'clinical-light.png',
    alt: 'A close editorial view of an examination light and dental chair.',
    caption: 'Clinical detail concept · Not a branch photograph',
    position: '40% 35%',
    crop: { left: 256, top: 0, width: 1664, height: 1024 },
  },
  {
    id: 'smile-macro-client',
    file: 'smile-macro.png',
    alt: 'An editorial close-up of a natural smile, lips and cheek.',
    caption: 'Editorial image · Not a treatment result',
    position: '40% 45%',
  },
];
await mkdir(path.join(root, 'public/images/editorial'), { recursive: true });
for (const item of entries) {
  const source = path.join(root, 'assets/editorial/client-cinematic', item.file);
  const original = await sharp(source).metadata();
  const width = item.crop?.width || original.width;
  const height = item.crop?.height || original.height;
  const widths = [480, 768, 1152, 1600, width].filter(
    (value, index, list) => value <= width && list.indexOf(value) === index
  );
  for (const size of widths) {
    const input = () => (item.crop ? sharp(source).extract(item.crop) : sharp(source));
    const base = path.join(root, 'public/images/editorial', `${item.id}-${size}`);
    await input().resize(size).webp({ quality: 84 }).toFile(`${base}.webp`);
    await input().resize(size).avif({ quality: 55, effort: 4 }).toFile(`${base}.avif`);
  }
  manifest[item.id] = {
    base: `/images/editorial/${item.id}`,
    width,
    height,
    widths,
    alt: item.alt,
    caption: item.caption,
    position: item.position,
    original: `assets/editorial/client-cinematic/${item.file}`,
    illustrative: true,
    published: true,
  };
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Prepared the four supplied images as responsive AVIF/WebP assets.');
