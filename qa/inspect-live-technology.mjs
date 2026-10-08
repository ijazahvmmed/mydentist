import { chromium } from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
await mkdir('qa/screenshots/live-technology',{recursive:true});
try {
 for(const [width,height] of [[390,844],[430,932],[768,1024],[1440,900],[1920,1080]]) {
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4326/');
  await page.locator('.tech-grid').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelectorAll('.technology-canvas.ready').length===2);
  for(const kind of ['arch','opg']) {
   const card=page.locator(`.${kind}-visual`).locator('..');
   await card.scrollIntoViewIfNeeded();
   await page.waitForTimeout(1500);
   await card.screenshot({path:`qa/screenshots/live-technology/${width}-${kind}.png`});
  }
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)||errors.length) throw new Error(JSON.stringify({width,errors}));
  console.log(`PASS ${width}: both 3D studies ready, no overflow or runtime errors`);
  await page.close();
 }
} finally {await browser.close();}
