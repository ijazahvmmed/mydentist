import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('qa/screenshots/photographic-hero', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const [width, height] of [
  [1440, 1000],
  [390, 900],
  [768, 1024],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto('http://localhost:4323/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `qa/screenshots/photographic-hero/${width}.png` });
  console.log(
    width,
    await page
      .locator('.hero')
      .evaluate((el) => ({
        height: el.getBoundingClientRect().height,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        loaded: el.querySelector('img').naturalWidth > 0,
      }))
  );
  await page.close();
}
await browser.close();
