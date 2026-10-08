import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
await mkdir('qa/screenshots/authored-teeth/final',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:986,height:820}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:4323/#technology');await page.locator('.tech-grid').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelectorAll('.technology-canvas.ready').length===2);
 for(const [name,delay] of [['front',400],['right',3000],['left',7000]]){
  await page.waitForTimeout(delay);await page.locator('.tech-grid').screenshot({path:`qa/screenshots/authored-teeth/final/${name}.png`});
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!document.querySelector('.technology-canvas.ready'));await page.locator('.tech-grid').screenshot({path:'qa/screenshots/authored-teeth/final/reduced-motion.png'});
 if(errors.length)throw new Error(JSON.stringify(errors));console.log('PASS animated views and matching reduced-motion fallback');
}finally{await browser.close();}
