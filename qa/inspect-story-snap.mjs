import { chromium } from '@playwright/test';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const [width, height] of [
  [390, 844],
  [320, 640],
  [1440, 900],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto('http://localhost:4323/');
  await page.waitForSelector('html.tooth-ready');
  await page.waitForTimeout(1000);
  const chapters = page.locator('.story-chapter');
  for (const index of [0, 1, 2, 3]) {
    await chapters.nth(index).evaluate((el) => {
      const stage = el.closest('.story-stage');
      if (stage.classList.contains('mobile-story')) {
        const i = [...stage.querySelectorAll('.story-chapter')].indexOf(el);
        const r = stage.getBoundingClientRect();
        const h = stage.querySelector('.story-text-viewport').getBoundingClientRect().height;
        scrollTo({ top: scrollY + r.top + (i * (r.height - h)) / 3 - 100, behavior: 'instant' });
        return;
      }
      const r = el.getBoundingClientRect();
      scrollTo({
        top: scrollY + r.top + r.height / 2 - innerHeight / 2 - 100,
        behavior: 'instant',
      });
    });
    await page.waitForTimeout(2400);
    console.log(
      JSON.stringify({
        width,
        index,
        phase: await page.locator('.tooth-canvas canvas').getAttribute('data-phase'),
        offset: await chapters.nth(index).evaluate((el) => {
          const stage = el.closest('.story-stage');
          if (stage.classList.contains('mobile-story')) {
            return el.getBoundingClientRect().left;
          }
          const r = el.getBoundingClientRect();
          return r.top + r.height / 2 - innerHeight / 2;
        }),
      })
    );
    await page.screenshot({ path: `qa/screenshots/snap-${width}-${index}.png` });
  }
  await page.close();
}
await browser.close();
