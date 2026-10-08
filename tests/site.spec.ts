import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('photographic hero remains visible independently of the animated tooth story', async ({
  page,
}) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/tooth-ready/);
    const image = page.locator('.hero-artwork img');
    await expect(image).toHaveJSProperty('complete', true);
    expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.hero-artwork')).toHaveCSS('opacity', '1');
    await expect(page.locator('.tooth-canvas')).toHaveCSS('opacity', '0');
    await page.locator('.hero-study').click();
    await expect(page).toHaveURL(/#tooth-story$/);
    await page.locator('.story-chapter').first().scrollIntoViewIfNeeded();
    await expect(page.locator('.tooth-canvas')).toHaveCSS('opacity', '1');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.hero-artwork')).toHaveCSS('opacity', '1');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
});
const branches = ['thuravoor', 'poochakkal', 'eramalloor', 'thirunalloor', 'aroor', 'vaduthala'];
const treatments = [
  'root-canal-treatment',
  'clear-aligners',
  'braces-orthodontics',
  'wisdom-tooth-removal',
  'dental-implants',
  'crowns-bridges',
  'cosmetic-dentistry',
  'general-dentistry',
  'pediatric-dentistry',
];
const phones = [
  '918281885542',
  '918943315611',
  '916235350388',
  '917306602757',
  '918714054348',
  '918921065625',
];
const routes = [
  '/',
  '/treatments/',
  '/locations/',
  '/about/',
  '/contact/',
  '/privacy-policy/',
  '/terms/',
  ...branches.map((b) => `/locations/${b}/`),
  ...treatments.map((t) => `/treatments/${t}/`),
];
test('every content route contains semantic HTML and unique SEO', async ({ request }) => {
  const titles = new Set<string>();
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect((html.match(/<h1(?:\s|>)/g) || []).length, route).toBe(1);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    expect(title).toBeTruthy();
    expect(titles.has(title!), route).toBe(false);
    titles.add(title!);
    expect(html).toContain('name="description"');
    expect(html).not.toMatch(
      /Lorem|Dentiva|123 Main Street|Dr John|98%|170\+|1200\+|best dentist|No\.1/
    );
  }
});
test('branch phones and WhatsApp routing are correct', async ({ page }) => {
  for (const [i, branch] of branches.entries()) {
    await page.goto(`/locations/${branch}/`);
    const call = page.locator('main a[data-event="phone_click"]').first();
    await expect(call).toHaveAttribute('href', `tel:+${phones[i]}`);
    const wa = page.locator('main a[data-event="whatsapp_click"]').first();
    const href = await wa.getAttribute('href');
    expect(href).toContain('https://wa.me/918281885542?');
    expect(decodeURIComponent(href!)).toContain(
      `MyDentist ${branch[0].toUpperCase() + branch.slice(1)}`
    );
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const dentist = schemas.map((s) => JSON.parse(s)).find((s) => s['@type'] === 'Dentist');
    expect(dentist.telephone.replace(/\D/g, '')).toBe(phones[i]);
    expect(dentist.openingHoursSpecification.length).toBe(i === 0 ? 1 : 2);
  }
});
test('finder searches landmarks and supports zero results', async ({ page }) => {
  await page.goto('/locations/');
  await page.getByLabel('Search by branch, locality or landmark').fill('Lyceum');
  await expect(page.locator('.branch-row:visible')).toHaveCount(1);
  await expect(page.locator('.branch-row:visible h3')).toHaveText('Poochakkal');
  await page.getByLabel('Search by branch, locality or landmark').fill('zzzz');
  await expect(page.locator('.no-results')).toBeVisible();
  await page.getByLabel('Search by branch, locality or landmark').fill('');
  await expect(page.locator('.branch-row:visible')).toHaveCount(6);
});
test('mobile menu opens, follows links, closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await expect(page.locator('#main-nav')).toBeHidden();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await menu.click();
  await page.locator('#main-nav').getByRole('link', { name: 'Our clinics' }).click();
  await expect(page).toHaveURL(/\/locations\//);
});
for (const [width, height] of [
  [360, 800],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
]) {
  test(`responsive layout ${width}Ãƒâ€”${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    for (const route of [
      '/',
      '/treatments/',
      '/treatments/root-canal-treatment/',
      '/locations/thuravoor/',
      '/contact/',
      '/about/',
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        route
      ).toBe(true);
      await expect(page.locator('h1')).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}
test('reduced motion has no full scroll sequence', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.tooth-story')).not.toHaveClass(/motion-story/);
  await expect(page.locator('.story-visual')).toBeHidden();
  expect(
    await page
      .locator('.story-chapter')
      .first()
      .evaluate((e) => e.getBoundingClientRect().height)
  ).toBeLessThan(800);
});
test('desktop story keeps copy clear and releases after the final chapter', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
  });
  const chapters = page.locator('.story-chapter');
  for (let i = 0; i < 4; i++) {
    await chapters
      .nth(i)
      .evaluate((node) => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(1300);
    await expect(page.locator('html')).toHaveClass(/tooth-ready/);
    const canvas = page.locator('.tooth-canvas canvas');
    await expect(canvas).toHaveAttribute('data-triangles', '30200');
    const picture = JSON.parse((await canvas.getAttribute('data-bounds'))!);
    expect(Number(await canvas.getAttribute('data-phase'))).toBeCloseTo(i, 0);
    const scan = Number(await canvas.getAttribute('data-scan'));
    expect(i === 0 || i === 3 ? scan < 0.1 : scan > 0.7).toBe(true);
    const copy = await chapters.nth(i).locator('.chapter-copy').boundingBox();
    expect(picture).toBeTruthy();
    expect(copy).toBeTruthy();
    expect(i % 2 === 0 ? picture.right < copy!.x : copy!.x + copy!.width < picture.left).toBe(true);
  }
  await page
    .locator('.treatments-home')
    .evaluate((node) => node.scrollIntoView({ behavior: 'instant' }));
  const visual = await page.locator('.story-visual').boundingBox();
  const nextSection = await page.locator('.treatments-home').boundingBox();
  expect(visual!.y + visual!.height).toBeLessThanOrEqual(nextSection!.y + 1);
  await expect(page.locator('.tooth-canvas canvas')).toHaveCount(1);
  await expect(page.locator('.tooth-canvas')).toHaveCSS('opacity', '0');
});
test('critical content and navigation work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4325/');
  await expect(page.locator('#main-nav')).toBeVisible();
  await expect(page.locator('.branch-row')).toHaveCount(6);
  await expect(page.locator('.story-chapter')).toHaveCount(4);
  await page.locator('#main-nav a[href="/treatments/"]').click();
  await expect(page.locator('h1')).toContainText('Care for every');
  await context.close();
});
for (const route of [
  '/',
  '/treatments/root-canal-treatment/',
  '/locations/thuravoor/',
  '/contact/',
]) {
  test(`accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500); // Audit settled text, not an intermediate entrance frame.
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
test('sitemap and canonicals reflect configured domain only', async ({ request }) => {
  const home = await (await request.get('/')).text();
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const robots = await (await request.get('/robots.txt')).text();
  const canonical = home.match(/<link rel="canonical" href="([^"]+)"/);
  if (canonical) {
    for (const branch of branches) expect(sitemap).toContain(`/locations/${branch}/`);
    for (const treatment of treatments) expect(sitemap).toContain(`/treatments/${treatment}/`);
    expect(robots).toContain('Allow: /');
    expect(home).toContain('content="index, follow"');
  } else {
    expect(robots).toContain('Disallow: /');
    expect(home).toContain('content="noindex, follow"');
  }
});
test('all internal links and image references resolve', async ({ page, request }) => {
  const urls = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const refs = await page
      .locator('a[href^="/"],img[src^="/"]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('href') || node.getAttribute('src') || '')
      );
    refs.forEach((ref) => urls.add(ref.split('#')[0]));
  }
  for (const url of urls) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
  }
});

test('model network failure retains the static poster and usable story', async ({ page }) => {
  await page.route('**/refined-molar.glb', (route) => route.abort());
  await page.goto('/');
  await page.waitForTimeout(1800);
  await expect(page.locator('html')).not.toHaveClass(/tooth-ready/);
  await expect(page.locator('.hero-media picture')).toHaveCSS('opacity', '1');
  await expect(page.locator('.story-chapter')).toHaveCount(4);
});
test('mobile menu traps focus while open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.click();
  await page.locator('#main-nav a').last().focus();
  await page.keyboard.press('Tab');
  await expect(menu).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#main-nav a').last()).toBeFocused();
});

test('WebGL context loss restores the poster', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/tooth-ready/);
  await page
    .locator('.tooth-canvas canvas')
    .evaluate((canvas) => canvas.dispatchEvent(new Event('webglcontextlost')));
  await expect(page.locator('html')).not.toHaveClass(/tooth-ready/);
  await expect(page.locator('.hero-media picture')).toHaveCSS('opacity', '1');
});

for (const width of [390, 1440]) {
  test(`homepage controls receive real clicks after WebGL loads ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/tooth-ready/);
    for (const row of await page.locator('.faq-list details').all()) {
      await row.locator('summary').click();
      await expect(row).toHaveAttribute('open', '');
      await expect(row.locator('p')).toBeVisible();
      await row.locator('summary').click();
      await expect(row).not.toHaveAttribute('open', '');
    }
    const clinic = page.locator('.branch-main-link').first();
    await clinic.click();
    await expect(page).toHaveURL(/locations\/thuravoor/);
    await page.goto('/');
    await page.locator('.treatment-rows > a').first().click();
    await expect(page).toHaveURL(/treatments\/root-canal-treatment/);
  });
}
test('live technology studies animate, route enquiries and respect reduced motion', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.tech-grid').scrollIntoViewIfNeeded();
  await expect(page.locator('.technology-canvas.ready')).toHaveCount(2);
  for (const card of await page.locator('.tech-card').all()) {
    await expect(card).toHaveAttribute('href', /https:\/\/wa.me\/918281885542\?text=/);
    await card.scrollIntoViewIfNeeded();
    await card.click({ trial: true });
    const canvas = card.locator('.technology-canvas canvas');
    await expect(canvas).toHaveAttribute('data-animation-time', /[0-9]+\.[0-9]+/);
    const before = await canvas.screenshot();
    const elapsed = Number(await canvas.getAttribute('data-animation-time'));
    const rotation = Number(await canvas.getAttribute('data-rotation'));
    await page.waitForTimeout(1400);
    expect(Number(await canvas.getAttribute('data-animation-time')) - elapsed).toBeGreaterThan(0.7);
    expect(Number(await canvas.getAttribute('data-rotation'))).not.toEqual(rotation);
    expect(before.equals(await canvas.screenshot())).toBe(false);
    const sweep = card.locator('.scan-sweep');
    await expect(sweep).toBeVisible();
    await expect(sweep).toHaveCSS('animation-play-state', 'running');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.technology-canvas.ready')).toHaveCount(0);
  await expect(page.locator('.arch-visual .scan-base')).toBeVisible();
  await expect(page.locator('.opg-visual > .study-poster')).toBeVisible();
});
test('six-clinic micro-interaction responds to input', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/tooth-ready/);
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: /Celebrate six neighbourhood clinics/ }).click();
  await expect(page.locator('.smile-spark')).toHaveCount(6);
});

test('clinic contact links and homepage cards remain unobstructed', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/tooth-ready/);
  const links = page.locator(
    '.featured-treatment, .treatment-rows > a, .branch-main-link, .branch-links a, .site-footer a'
  );
  expect(await links.count()).toBeGreaterThan(20);
  for (const link of await links.all()) await link.click({ trial: true });
});

test('visible control labels match their accessible names', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);
  const results = await new AxeBuilder({ page })
    .withRules(['label-content-name-mismatch'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('treatment guide links reveal their section below the navigation', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/treatments/root-canal-treatment/');
    await expect(page.locator('#main-nav a[aria-current="page"]')).toHaveText('Treatments');
    await page
      .getByRole('navigation', { name: 'Treatment guide sections' })
      .getByRole('link', { name: 'Before your appointment' })
      .click();
    await expect(page).toHaveURL(/#prepare$/);
    await page.waitForTimeout(900);
    const top = await page.locator('#prepare').evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(width > 700 ? 102 : 0);
    expect(top).toBeLessThan(300);
  }
});

for (const width of [390, 1440]) {
  test(`tooth story settles on chapters and releases at both ends ${width}`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/tooth-ready/);
    const chapters = page.locator('.story-chapter');
    const positions = await chapters.evaluateAll((nodes) => {
      const stage = document.querySelector('.story-stage')!;
      if (stage.classList.contains('mobile-story')) {
        const rect = stage.getBoundingClientRect();
        const panelHeight = stage
          .querySelector('.story-text-viewport')!
          .getBoundingClientRect().height;
        const distance = (rect.height - panelHeight) / (nodes.length - 1);
        return nodes.map((_, i) => ({ stop: scrollY + rect.top + i * distance, height: distance }));
      }
      return nodes.map((node) => {
        const r = node.getBoundingClientRect();
        return { stop: scrollY + r.top + r.height / 2 - innerHeight / 2, height: r.height };
      });
    });
    const expectChapter = async (index: number) => {
      await expect
        .poll(async () => Math.abs((await page.evaluate(() => scrollY)) - positions[index].stop), {
          timeout: 6000,
        })
        .toBeLessThan(2);
      await expect
        .poll(async () =>
          Number(await page.locator('.tooth-canvas canvas').getAttribute('data-phase'))
        )
        .toBeCloseTo(index, 1);
      await expect(chapters.nth(index).locator('h2')).toBeInViewport();
    };
    // Reproduce the partial-entry position in the reported screenshot.
    await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), positions[0].stop - 140);
    await expectChapter(0);
    for (let i = 1; i < 4; i++) {
      await page.mouse.wheel(0, positions[i - 1].height * 0.68);
      await expectChapter(i);
    }
    // Small outward gestures must escape; no large fling is required.
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(1400);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(positions[3].stop + 80);
    // Reverse scrolling settles on the previous chapter as well.
    await page.mouse.wheel(0, -positions[2].height * 0.78);
    await expectChapter(2);
    await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), positions[0].stop);
    await expectChapter(0);
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(1400);
    expect(await page.evaluate(() => scrollY)).toBeLessThan(positions[0].stop - 80);
  });
}

test('mobile story uses separate horizontal panels and accessible step controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  const stage = page.locator('.story-stage');
  await expect(stage).toHaveClass(/mobile-story/);
  const start = await stage.evaluate((el) => scrollY + el.getBoundingClientRect().top);
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), start);
  const controls = page.getByRole('navigation', { name: 'Tooth story chapters' });
  const copies = page.locator('.chapter-copy');
  for (let index = 0; index < 4; index++) {
    await controls.getByRole('button').nth(index).click();
    await expect
      .poll(async () =>
        Math.abs(
          Number(await page.locator('.tooth-canvas canvas').getAttribute('data-phase')) - index
        )
      )
      .toBeLessThan(0.01);
    await expect(controls.getByRole('button').nth(index)).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('.story-chapter:not([inert])')).toHaveCount(1);
    const copy = await copies.nth(index).boundingBox();
    const model = JSON.parse(
      (await page.locator('.tooth-canvas canvas').getAttribute('data-bounds'))!
    );
    expect(copy!.x).toBeGreaterThanOrEqual(20);
    expect(copy!.x + copy!.width).toBeLessThanOrEqual(300);
    expect(copy!.y).toBeGreaterThanOrEqual(20);
    expect(copy!.y + copy!.height).toBeLessThan(model.top);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  }
  await page.getByRole('link', { name: 'Explore root canal treatment' }).click();
  await expect(page).toHaveURL(/treatments\/root-canal-treatment/);
});

test('horizontal story restores normal reading on desktop and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.story-stage')).toHaveClass(/mobile-story/);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.story-stage')).not.toHaveClass(/mobile-story/);
  await expect(page.locator('.story-chapter[inert]')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.story-stage')).toHaveClass(/mobile-story/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.story-stage')).not.toHaveClass(/mobile-story/);
  await expect(page.locator('.story-chapter[inert]')).toHaveCount(0);
  await expect(page.locator('.story-step-nav')).toBeHidden();
  await expect(page.locator('.story-chapters')).toHaveCSS('transform', 'none');
});
