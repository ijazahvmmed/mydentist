import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch();
await mkdir('qa/screenshots/editorial/crops',{recursive:true});
try {
 for(const width of [390,1440]) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const route of ['/','/about/','/treatments/','/treatments/clear-aligners/','/treatments/dental-implants/']) {
   await page.goto(`http://127.0.0.1:4326${route}`);
   for(const media of await page.locator('main .media-frame').all()) {
    await media.scrollIntoViewIfNeeded();
    await media.locator('img').evaluate(img=>img.decode());
    await media.screenshot({path:`qa/screenshots/editorial/crops/${width}-${route.split('/').filter(Boolean).join('-')||'home'}-${await media.getAttribute('data-asset')}.png`});
   }
   if(width===390&&route!=='/') {
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    if(result.violations.length) throw new Error(`${route}: ${JSON.stringify(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))}`);
    console.log(`PASS accessibility ${route}`);
   }
  }
  await context.close();
 }
} finally {await browser.close();}
