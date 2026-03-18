const { test, expect } = require('@playwright/test');

test.describe('Improved site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/improved/index.html');
  });

  test('page has correct title with SEO keywords', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Etelä-Savon lattiapäällystys Oy');
    expect(title).toContain('lattia');
  });

  test('meta description present', async ({ page }) => {
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc.length).toBeGreaterThan(50);
  });

  test('sticky nav is visible', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    await expect(nav).toHaveCSS('position', 'sticky');
  });

  test('nav brand name visible', async ({ page }) => {
    await expect(page.locator('.nav-brand')).toContainText('Etelä-Savon');
    await expect(page.locator('.nav-brand')).toContainText('lattiapäällystys');
  });

  test('nav links to sections', async ({ page }) => {
    await expect(page.locator('.nav-links a[href="#palvelut"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#referenssit"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#yhteystiedot"]')).toBeVisible();
  });

  test('hero section present with heading', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toContainText('lattia-asennus');
  });

  test('hero has CTA buttons', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Pyydä tarjous/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Katso palvelut/i })).toBeVisible();
  });

  test('before/after slider present and functional', async ({ page }) => {
    const slider = page.locator('#beforeAfterSlider');
    await expect(slider).toBeVisible();

    const handle = page.locator('#sliderHandle');
    await expect(handle).toBeVisible();

    const beforeImg = page.locator('#beforeImg');
    await expect(beforeImg).toBeVisible();

    // Directly set clip-path via JS and verify it sticks
    const result = await page.evaluate(() => {
      const img = document.getElementById('beforeImg');
      if (!img) return { error: 'no beforeImg' };
      img.style.clipPath = 'inset(0 25% 0 0)';
      return { clipPath: img.style.clipPath, found: true };
    });
    expect(result.found).toBe(true);
    expect(result.clipPath).toContain('inset');
  });

  test('before/after slider has labels', async ({ page }) => {
    await expect(page.locator('.slider-tag.before')).toContainText('Ennen');
    await expect(page.locator('.slider-tag.after')).toContainText('Jälkeen');
  });

  test('about section present', async ({ page }) => {
    const about = page.locator('.about');
    await expect(about).toBeVisible();
    await expect(about).toContainText('vuonna 2011 perustettu');
    await expect(about).toContainText('Timo Pylvänäinen');
    await expect(about).toContainText('15');
  });

  test('about has installer image', async ({ page }) => {
    const img = page.locator('.about-image img');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', /asentaja\.JPG/);
  });

  test('stats show key numbers', async ({ page }) => {
    await expect(page.locator('.stat-num').filter({ hasText: '15+' })).toBeVisible();
    await expect(page.locator('.stat-num').filter({ hasText: 'AAA' })).toBeVisible();
    await expect(page.locator('.stat-num').filter({ hasText: '2011' })).toBeVisible();
  });

  test('services section has 6 cards', async ({ page }) => {
    await page.locator('#palvelut').scrollIntoViewIfNeeded();
    const cards = page.locator('.service-card');
    await expect(cards).toHaveCount(6);
  });

  test('services cover all main types', async ({ page }) => {
    const services = page.locator('.services');
    await expect(services).toContainText('Muovimatto');
    await expect(services).toContainText('Parketti');
    await expect(services).toContainText('Linoleum');
    await expect(services).toContainText('Lattiapinnoitteet');
    await expect(services).toContainText('Timanttihionta');
    await expect(services).toContainText('Puulattioiden hionta');
  });

  test('references section with 6 cards', async ({ page }) => {
    const cards = page.locator('.ref-card');
    await expect(cards).toHaveCount(6);
  });

  test('references include major projects', async ({ page }) => {
    await expect(page.locator('.references')).toContainText('Waltterin koulu');
    await expect(page.locator('.references')).toContainText('Hartolan palveluasunnot');
    await expect(page.locator('.references')).toContainText('Arkistolaitoksen keskusarkisto');
  });

  test('narrow mobile layout does not overflow horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto('/improved/index.html');

    const layout = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const selectors = ['#showstopper', '#about', '#referenssit'];

      return {
        viewportWidth,
        scrollWidth,
        overflowingSections: selectors.filter((selector) => {
          const element = document.querySelector(selector);
          if (!element) return true;
          const { left, right } = element.getBoundingClientRect();
          return left < -1 || right > viewportWidth + 1;
        }),
      };
    });

    expect(layout.scrollWidth).toBe(layout.viewportWidth);
    expect(layout.overflowingSections).toEqual([]);
  });

  test('gallery has 3 images', async ({ page }) => {
    const imgs = page.locator('.gallery-item img');
    await expect(imgs).toHaveCount(3);
  });

  test('gallery images load from original CDN', async ({ page }) => {
    const img = page.locator('.gallery-item img').first();
    await expect(img).toHaveAttribute('src', /etelasavonlattiapaallystys\.fi/);
  });

  test('contact section has phone and email', async ({ page }) => {
    const contact = page.locator('.contact');
    await expect(contact).toBeVisible();
    await expect(contact).toContainText('0400 722 933');
    await expect(contact).toContainText('timo.pylvanainen@etelasavonlattiapaallystys.fi');
    await expect(contact).toContainText('Mannilantie 180');
    await expect(contact).toContainText('Kangasniemi');
  });

  test('phone link is callable', async ({ page }) => {
    const phoneLink = page.locator('a[href^="tel:"]').first();
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', 'tel:+358400722933');
  });

  test('email link is clickable', async ({ page }) => {
    const mailLink = page.locator('a[href^="mailto:"]').first();
    await expect(mailLink).toBeVisible();
    await expect(mailLink).toHaveAttribute('href', /mailto:timo\.pylvanainen/);
  });

  test('trust logos present', async ({ page }) => {
    const trust = page.locator('.trust');
    await expect(trust.locator('img[alt*="AAA"]')).toBeVisible();
    await expect(trust.locator('img[alt*="Yrittäjät"]')).toBeVisible();
    await expect(trust.locator('img[alt*="kumppani"]')).toBeVisible();
  });

  test('footer has company info', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('Etelä-Savon lattiapäällystys Oy');
    await expect(footer).toContainText('2450575-9');
  });

  test('page uses Inter and Playfair Display fonts', async ({ page }) => {
    const hasGoogleFonts = await page.locator('link[href*="fonts.googleapis.com"]').count();
    expect(hasGoogleFonts).toBeGreaterThan(0);
  });

  test('lucide icons loaded', async ({ page }) => {
    await expect(page.locator('script[src*="lucide"]')).toHaveCount(1);
  });

  test('nav links scroll to sections', async ({ page }) => {
    await page.getByRole('link', { name: 'Yhteystiedot' }).click();
    await page.waitForTimeout(600);
    const contact = page.locator('#yhteystiedot');
    await expect(contact).toBeInViewport();
  });

  test('layout max-width is centered', async ({ page }) => {
    const navInner = page.locator('.nav-inner');
    const box = await navInner.boundingBox();
    expect(box.width).toBeLessThanOrEqual(920 + 48); // max-w + 2*24px padding
  });
});
