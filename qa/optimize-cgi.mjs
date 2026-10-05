import sharp from 'sharp';
for(const name of ['braces','implant','wisdom'])for(const size of [640,1000])await sharp(`assets/generated/${name}-source.png`).resize(size).webp({quality:82}).toFile(`public/images/treatments/${name}${size===640?'-640':''}.webp`);
