import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('qa/screenshots/clarity', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.on('pageerror', (error) => console.log('ERROR', error.message));
  for (const [name, path, targets] of [
    ['home', '/', ['.tech-grid', '.branch-list', '.faq-section']],
    ['treatments', '/treatments/', ['.treatment-directory']],
    ['guide', '/treatments/root-canal-treatment/', ['.guide-nav', '.editorial-body #overview']],
    ['clinic', '/locations/thuravoor/', ['.branch-detail']],
    ['contact', '/contact/', ['.contact-grid']],
    ['about', '/about/', ['.about-values']],
  ]) {
    await page.goto(`http://localhost:4323${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error(`Overflow ${name} ${width}`);
    await page.screenshot({ path: `qa/screenshots/clarity/${width}-${name}-top.png` });
    for (let i = 0; i < targets.length; i++) {
      await page
        .locator(targets[i])
        .evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForTimeout(1100);
      await page.screenshot({ path: `qa/screenshots/clarity/${width}-${name}-${i}.png` });
    }
    console.log('captured', width, name);
  }
  await page.close();
}
await browser.close();
