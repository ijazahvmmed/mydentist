import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('qa/screenshots/editorial',{recursive:true});
const browser = await chromium.launch({args:['--enable-unsafe-swiftshader']});
const report=[];
try {
 for (const [width,height] of [[390,844],[430,932],[768,1024],[1440,900],[1920,1080]]) {
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4326/');
  await page.evaluate(()=>document.fonts.ready);
  for (const target of ['.hero','.human-transition','.featured-treatment','.technology-intro','.tech-grid','.human-cta']) {
   await page.locator(target).evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
   await page.waitForTimeout(1600);
   await page.screenshot({path:`qa/screenshots/editorial/${width}-home-${target.slice(1)}.png`});
  }
  const assets=await page.locator('main .media-frame').evaluateAll(elements=>elements.map(el=>({asset:el.getAttribute('data-asset'),image:el.querySelector('img').currentSrc,loaded:el.querySelector('img').naturalWidth>0,caption:el.querySelector('figcaption')?.textContent})));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  report.push({width,height,route:'/',overflow,assets,errors});
  if(overflow||errors.length||assets.some(a=>!a.loaded)) throw new Error(JSON.stringify(report.at(-1)));
  for(const [route,targets] of [
   ['/about/',['.about-editorial-lead','.environment-study','.brand-atmosphere']],
   ['/treatments/',['.treatment-index-hero']],
   ['/treatments/clear-aligners/',['.product-guide']],
   ['/treatments/dental-implants/',['.product-guide']],
  ]) {
   await page.goto(`http://127.0.0.1:4326${route}`);
   for(const target of targets) {
    await page.locator(target).evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
    await page.waitForTimeout(1500);
    await page.screenshot({path:`qa/screenshots/editorial/${width}-${route.split('/').filter(Boolean).join('-')}-${target.slice(1)}.png`});
   }
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   const assets=await page.locator('main .media-frame').evaluateAll(elements=>elements.map(el=>({asset:el.getAttribute('data-asset'),loaded:el.querySelector('img').naturalWidth>0})));
   report.push({width,height,route,overflow,assets,errors:[...errors]});
   if(overflow||errors.length||assets.some(a=>!a.loaded)) throw new Error(JSON.stringify(report.at(-1)));
  }
  console.log(`PASS ${width}x${height}: homepage and all four media pages`);
  await page.close();
 }
 await writeFile('qa/editorial-inspection.json',JSON.stringify(report,null,2)+'\n');
} finally {await browser.close();}
