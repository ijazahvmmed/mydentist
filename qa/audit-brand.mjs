import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const browser = await chromium.launch();
for (const route of [
  '/',
  '/treatments/root-canal-treatment/',
  '/locations/thuravoor/',
  '/contact/',
]) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`http://localhost:4322${route}`);
  await page.waitForTimeout(2200);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  console.log(
    route,
    JSON.stringify(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, reason: n.failureSummary })),
      })),
      null,
      2
    )
  );
  await context.close();
}
await browser.close();
