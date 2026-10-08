import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
await mkdir('qa/screenshots/crown-refinement',{recursive:true});
try {
 for(const [width,height] of [[986,800],[390,844]]) {
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4323/');
  await page.locator('.tech-grid').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelectorAll('.technology-canvas.ready').length===2);
  for(const kind of ['arch','opg']) {
    const card=page.locator(`.${kind}-visual`).locator('..');
    await card.scrollIntoViewIfNeeded();await page.waitForTimeout(1800);
    await card.screenshot({path:`qa/screenshots/crown-refinement/${width}-${kind}.png`});
  }
  if(errors.length)throw new Error(JSON.stringify(errors));
  await page.close();
 }
}finally{await browser.close();}
