import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('qa/screenshots/hero-studio', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const report = [];
try {
  for (const [width, height] of [
    [390, 844],
    [768, 1024],
    [1440, 1000],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:4323/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    await page.screenshot({
      path: `qa/screenshots/hero-studio/${width}-hero.png`,
      fullPage: false,
    });
    const hero = await page
      .locator('.hero-artwork img')
      .evaluate((img) => ({
        src: img.currentSrc,
        loaded: img.naturalWidth > 0,
        radius: getComputedStyle(img.closest('.hero-media')).borderRadius,
      }));
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1
    );
    for (const selector of ['.human-transition', '.tech-grid', '.human-cta']) {
      await page
        .locator(selector)
        .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(1600);
      await page.screenshot({
        path: `qa/screenshots/hero-studio/${width}-${selector.slice(1)}.png`,
      });
    }
    report.push({ width, hero, overflow, errors });
    console.log(report.at(-1));
    await page.close();
  }
  await writeFile('qa/hero-studio-inspection.json', JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
