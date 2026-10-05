import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const chrome=await chromeLauncher.launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox']});
try {
 const summaries=[];
 for(const [name,path] of [['home','/'],['treatment','/treatments/root-canal-treatment/']]){
  const result=await lighthouse(`http://localhost:4323${path}`,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
  await writeFile(`qa/lighthouse-${name}.json`,result.report);
  summaries.push({page:name,scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),LCP:result.lhr.audits['largest-contentful-paint'].displayValue,CLS:result.lhr.audits['cumulative-layout-shift'].displayValue,TBT:result.lhr.audits['total-blocking-time'].displayValue,failed:Object.values(result.lhr.audits).filter(a=>a.score!==null&&a.score<.9&&a.details?.type!=='opportunity').map(a=>({id:a.id,title:a.title,score:a.score}))});
 }
 await writeFile('qa/lighthouse-summary.json',JSON.stringify(summaries,null,2));
 console.log(JSON.stringify(summaries,null,2));
}finally{await chrome.kill()}
