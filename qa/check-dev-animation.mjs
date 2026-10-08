import {chromium} from '@playwright/test';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('http://localhost:4323/');
 await page.waitForFunction(()=>document.documentElement.classList.contains('tooth-ready'));
 for(const kind of ['arch','opg']) {
  await page.locator(`.${kind}-visual`).scrollIntoViewIfNeeded();
  await page.waitForFunction(kind=>Number(document.querySelector(`.${kind}-visual canvas`)?.dataset.animationTime)>0,kind);
  const canvas=page.locator(`.${kind}-visual canvas`);
  const before=Number(await canvas.getAttribute('data-animation-time'));
  await page.waitForTimeout(1500);
  const elapsed=Number(await canvas.getAttribute('data-animation-time'))-before;
  if(!Number.isFinite(elapsed)||elapsed<0.7)throw new Error(`${kind}: insufficient motion ${elapsed}`);
  console.log(`PASS ${kind}: ${elapsed.toFixed(2)} animation seconds in 1.5 real seconds`);
 }
 if(errors.length)throw new Error(JSON.stringify(errors));
 console.log('PASS after production build: hero and both technology animations load on localhost:4323 without errors');
}finally{await browser.close();}
