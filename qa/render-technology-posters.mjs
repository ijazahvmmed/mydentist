import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
await mkdir('public/images/technology',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto('http://localhost:4323/');
 for(const kind of ['arch','opg']) {
  await page.locator(`.${kind}-visual`).scrollIntoViewIfNeeded();
  await page.waitForFunction(kind=>document.querySelector(`.${kind}-visual .technology-canvas`)?.classList.contains('ready'),kind);
  await page.waitForFunction(kind=>Math.abs(Number(document.querySelector(`.${kind}-visual canvas`)?.dataset.rotation))<.03,kind,{timeout:22000});
  const data=await page.locator(`.${kind}-visual canvas`).evaluate(canvas=>new Promise(resolve=>requestAnimationFrame(()=>resolve(canvas.toDataURL('image/png')))));
  const png=Buffer.from(data.split(',')[1],'base64');const stats=await sharp(png).stats();if(stats.channels[3].max===0)throw new Error('Blank poster');
  await sharp(png).webp({quality:90}).toFile(`public/images/technology/${kind}-study.webp`);console.log(`saved ${kind} poster`);
 }
}finally{await browser.close();}
