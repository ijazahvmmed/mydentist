import {chromium} from '@playwright/test';
import {readFile,mkdir} from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
await mkdir('qa/screenshots/authored-teeth',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:986,height:800}});
 await page.route('**/models/dental-crowns.glb',r=>readFile('qa/model-candidates/authored-dentition.glb').then(body=>r.fulfill({body,contentType:'model/gltf-binary'})));
 await page.route('**/models/dental-scan-crowns.glb',r=>readFile('qa/model-candidates/authored-scan.glb').then(body=>r.fulfill({body,contentType:'model/gltf-binary'})));
 await page.goto('http://localhost:4323/');await page.locator('.tech-grid').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelectorAll('.technology-canvas.ready').length===2);await page.waitForTimeout(1000);
 await page.locator('.tech-grid').screenshot({path:'qa/screenshots/authored-teeth/candidate.png'});
}finally{await browser.close();}
