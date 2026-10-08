import {chromium} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 for(const id of [36,37,46,47]) {
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.route('**/models/refined-molar.glb',async route=>route.fulfill({contentType:'model/gltf-binary',body:await readFile(`qa/model-candidates/molar-${id}.glb`)}));
  await page.goto('http://localhost:4323/');await page.waitForFunction(()=>document.documentElement.classList.contains('tooth-ready'));await page.waitForTimeout(1200);
  await page.screenshot({path:`qa/screenshots/geometry/molar-${id}.png`,clip:{x:840,y:190,width:460,height:460}});await page.close();
 }
}finally{await browser.close();}
