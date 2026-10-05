import { chromium } from '@playwright/test';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', (e) => console.log('ERROR', e.message));
  p.on('console', (m) => {
    if (m.type() === 'error') console.log(m.text());
  });
  await p.goto('http://localhost:4323/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `qa/screenshots/brand-${w}-hero.png` });
  await p.locator('#technology').evaluate((e) => e.scrollIntoView({ behavior: 'instant' }));
  await p.waitForTimeout(3000);
  await p.screenshot({ path: `qa/screenshots/brand-${w}-tech.png` });
  await p.locator('.faq-list summary').first().click();
  console.log('FAQ', w, await p.locator('.faq-list details').first().getAttribute('open'));
  await p.waitForTimeout(1000);
  await p.screenshot({ path: `qa/screenshots/brand-${w}-faq.png` });
  await p.close();
}
await b.close();
