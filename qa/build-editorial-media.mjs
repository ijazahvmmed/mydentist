import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const entries = [
 ['lifestyle-smile','editorial','Woman smiling while holding a cup, editorial illustration.','Editorial illustration','50% 42%'],
 ['dental-instruments','environment','Dental instruments arranged beside a treatment chair, illustrative image.','Illustrative clinical detail','50% 52%'],
 ['treatment-room','environment','Dental treatment room with a chair and examination light, illustrative image.','Environment concept · Not a branch photograph','50% 52%'],
 ['reception','environment','Reception space with MyDentist-style branding, illustrative image.','Brand concept · Not a branch photograph','50% 44%'],
 ['exterior-concept','environment','Illustrative dental-clinic exterior concept.','Exterior concept · Not a branch photograph','50% 50%'],
 ['digital-teeth','technology','Digital illustration of dental arches and a scanning plane.','Digital illustration · Not a patient scan','50% 50%'],
 ['dental-implant','treatments','Illustration of an implant, connector and tooth crown.','Treatment illustration · Not a patient result','50% 50%'],
 ['clear-aligner','treatments','Clear orthodontic aligner held between fingers, illustrative image.','Treatment illustration · Not a patient result','50% 50%'],
 ['opg-equipment','technology','Dental imaging equipment, illustrative image.','Equipment illustration · Exact machine not verified','50% 46%'],
 ['smile-closeup','editorial','Close-up of a smile, editorial illustration.','Editorial illustration · Not a treatment result','50% 48%'],
 ['smiling-portrait','editorial','Portrait of a smiling woman, editorial illustration.','Editorial illustration','50% 42%'],
 ['consultation','editorial','Dentist discussing dental imaging with a patient, illustrative image.','Consultation illustration · People are not identified','50% 53%'],
 ['intraoral-scan','technology','Intraoral scanning procedure, illustrative image.','Procedure illustration · Not a clinic photograph','50% 56%'],
];
const originals = (await readdir('assets/editorial/originals')).sort();
const manifest = {};
for (const [i,entry] of entries.entries()) {
 const [id,folder,alt,caption,position] = entry;
 const original = originals.find(name => name.startsWith(String(i+1).padStart(2,'0')+'_'));
 if (!original) throw new Error(`Missing image ${i+1}`);
 const input = path.join('assets/editorial/originals',original);
 const {width,height} = await sharp(input).metadata();
 const widths = [...new Set([480,768,width].filter(w=>w<=width))];
 await mkdir(`public/images/${folder}`,{recursive:true});
 for (const w of widths) {
  await sharp(input).rotate().resize({width:w,withoutEnlargement:true}).webp({quality:78}).toFile(`public/images/${folder}/${id}-${w}.webp`);
  await sharp(input).rotate().resize({width:w,withoutEnlargement:true}).avif({quality:48,effort:4}).toFile(`public/images/${folder}/${id}-${w}.avif`);
 }
 manifest[id] = {base:`/images/${folder}/${id}`,width,height,widths,alt,caption,position,original,illustrative:true,published:id!=='exterior-concept'};
 console.log(`${id}: ${widths.join(', ')}px, AVIF + WebP`);
}
await writeFile('src/lib/editorial-media.json',JSON.stringify(manifest,null,2)+'\n');
