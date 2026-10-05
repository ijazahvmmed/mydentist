import { chromium } from '@playwright/test';
const browser = await chromium.launch();
for (const width of [390, 768, 900, 1000, 1201, 1440, 1920, 2560]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('http://localhost:4323/');
  await page.waitForTimeout(1200);
  const geometry = await page.evaluate(() => {
    const header = document.querySelector('.site-header').getBoundingClientRect();
    const inner = document.querySelector('.header-inner').getBoundingClientRect();
    const hero = document.querySelector('.hero').getBoundingClientRect();
    const nodes = [...document.querySelectorAll('.header-inner > a, .header-inner > nav, .menu-toggle')]
      .filter(el => getComputedStyle(el).display !== 'none').map(el => el.getBoundingClientRect());
    return { headerLeft: header.left, headerRight: header.right, pageWidth: document.documentElement.clientWidth,
      innerLeft: inner.left, heroLeft: hero.left, overflow: document.documentElement.scrollWidth > innerWidth,
      overlap: nodes.some((a,i) => nodes.some((b,j) => i<j && Math.min(a.right,b.right)-Math.max(a.left,b.left)>1)) };
  });
  if (geometry.headerLeft !== 0 || geometry.headerRight !== geometry.pageWidth || geometry.innerLeft !== geometry.heroLeft || geometry.overflow || geometry.overlap) throw Error(JSON.stringify({width,...geometry}));
  if (width >= 900) {
    await page.locator('.story-chapter').first().evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
    await page.waitForTimeout(1400);
  }
  await page.locator('.site-header').screenshot({path:`qa/screenshots/header-${width}.png`});
  if(width === 390) {
    await page.getByRole('button',{name:'Menu'}).click();
    await page.waitForTimeout(500);
    await page.screenshot({path:'qa/screenshots/header-mobile-menu.png'});
  }
  console.log('header verified',width);
  await page.close();
}
await browser.close();
