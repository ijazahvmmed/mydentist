import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const manifestPath = path.join(root, 'src/lib/editorial-media.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entries = [
  [
    'pediatric-lifestyle',
    'An Indian child laughing with a parent at home, an editorial lifestyle illustration.',
    'Lifestyle illustration · Not a treatment result',
    '50% 42%',
  ],
  [
    'endodontic-conversation',
    'Anonymous clinician and patient discussing an illustrative dental scan, an editorial scene.',
    'Editorial consultation · Not a MyDentist clinician or patient',
    '53% 44%',
  ],
  [
    'beauty-dental-macro',
    'Close editorial crop of a South Asian woman’s natural smile and lower face.',
    'Editorial illustration · Not a treatment result',
    '60% 44%',
  ],
  [
    'clinical-light-detail',
    'Examination light and dental chair in a generic clinical environment illustration.',
    'Clinical detail concept · Not a branch photograph',
    '65% 40%',
  ],
];
await mkdir(path.join(root, 'public/images/editorial'), { recursive: true });
for (const [id, alt, caption, position] of entries) {
  const source = path.join(root, 'assets/generated/cinematic', `${id}.png`);
  const { width, height } = await sharp(source).metadata();
  const widths = [480, 768, 1152, width].filter(
    (value, index, list) => value <= width && list.indexOf(value) === index
  );
  for (const size of widths) {
    const base = path.join(root, 'public/images/editorial', `${id}-${size}`);
    await sharp(source).resize(size).webp({ quality: 80 }).toFile(`${base}.webp`);
    await sharp(source).resize(size).avif({ quality: 50, effort: 4 }).toFile(`${base}.avif`);
  }
  manifest[id] = {
    base: `/images/editorial/${id}`,
    width,
    height,
    widths,
    alt,
    caption,
    position,
    original: `assets/generated/cinematic/${id}.png`,
    illustrative: true,
    published: true,
  };
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Registered four cinematic assets with responsive AVIF/WebP derivatives.');
