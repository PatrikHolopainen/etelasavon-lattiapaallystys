const { test, expect } = require('@playwright/test');

test.describe('Original site - index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/original/index.html');
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle('mattotyöt, mattoasennus, puulattioiden hionta');
  });

  test('header image loads', async ({ page }) => {
    const img = page.locator('img[src*="uusi%20otsikko.jpg"]');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('style', /width: 840px/);
    await expect(img).toHaveAttribute('style', /height: 195px/);
  });

  test('navigation links present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Palvelut' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Referenssit' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Yhteystiedot ja rekisteriseloste' })).toBeVisible();
  });

  test('welcome heading present', async ({ page }) => {
    await expect(page.getByText('Tervetuloa tutustumaan Etelä-Savon lattiapäällystys Oy:n kotisivuihin!')).toBeVisible();
  });

  test('company description present', async ({ page }) => {
    await expect(page.getByText('vuonna 2011 perustettu kangasniemeläinen yritys')).toBeVisible();
    await expect(page.getByText('Timo Pylvänäinen yli 15 vuoden työkokemuksella')).toBeVisible();
  });

  test('services list present', async ({ page }) => {
    await expect(page.getByText('Osaamisalueitamme ovat:')).toBeVisible();
    await expect(page.getByText('Muovimattojen asennus')).toBeVisible();
    await expect(page.getByText('Linoleumlattioiden asennus')).toBeVisible();
    await expect(page.getByText('Muovilaattalattioiden asennus')).toBeVisible();
    await expect(page.getByText('Parkettilattioiden asennus- ja huoltotyöt')).toBeVisible();
    await expect(page.getByText('Laminaattilattioiden asennus')).toBeVisible();
    await expect(page.getByText('Lattiapinnoitteiden asennus (epoksi, polyuretaani, akryyli)')).toBeVisible();
    await expect(page.getByText('Timanttihionta')).toBeVisible();
    await expect(page.getByText('Puulattioiden hionta')).toBeVisible();
    await expect(page.getByText('Huoneistoremontit')).toBeVisible();
  });

  test('trust badge logos present', async ({ page }) => {
    await expect(page.locator('img[alt="AAA"]')).toBeVisible();
    await expect(page.locator('img[alt="jasenyritys"]')).toBeVisible();
  });

  test('contact info present', async ({ page }) => {
    await expect(page.getByText('Etelä-Savon lattiapäällystys Oy').first()).toBeVisible();
    await expect(page.getByText('Mannilantie 180')).toBeVisible();
    await expect(page.getByText('51200 Kangasniemi')).toBeVisible();
    await expect(page.getByText('timo.pylvanainen@etelasavonlattiapaallystys.fi')).toBeVisible();
    await expect(page.getByText('0400 722933')).toBeVisible();
    await expect(page.getByText('Y-tunnus 2450575-9')).toBeVisible();
  });

  test('table layout is 956px wide centered', async ({ page }) => {
    const table = page.locator('table').first();
    await expect(table).toHaveAttribute('style', /width: 956px/);
    await expect(table).toHaveAttribute('style', /margin-left: auto/);
    await expect(table).toHaveAttribute('style', /margin-right: auto/);
  });

  test('page background has carpet texture', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toHaveAttribute('style', /mattotausta\.jpg/);
    await expect(body).toHaveAttribute('style', /background-color: rgb\(255, 255, 255\)/);
  });
});

test.describe('Original site - palvelut', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/original/palvelut.html');
  });

  test('services page title', async ({ page }) => {
    await expect(page).toHaveTitle('Palvelut');
  });

  test('installer image loads', async ({ page }) => {
    const img = page.locator('img[src*="asentaja.JPG"]');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('style', /width: 314px/);
    await expect(img).toHaveAttribute('style', /height: 470px/);
  });

  test('services description text', async ({ page }) => {
    await expect(page.getByText('lattiapäällysteiden myynti ja asennus')).toBeVisible();
  });

  test('nav has link back to etusivu', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Etusivu' })).toBeVisible();
  });
});

test.describe('Original site - referenssit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/original/referenssit.html');
  });

  test('references page title', async ({ page }) => {
    await expect(page).toHaveTitle('referenssit');
  });

  test('references heading present', async ({ page }) => {
    await expect(page.getByText('Referenssit')).toBeVisible();
  });

  test('major reference projects listed', async ({ page }) => {
    await expect(page.getByText('Joutsan koulukeskus A-osa')).toBeVisible();
    await expect(page.getByText('Waltterin koulu, Varkaus')).toBeVisible();
    await expect(page.getByText('Arkistolaitoksen keskusarkisto, Mikkeli')).toBeVisible();
    await expect(page.getByText('SOTE-keskus, Sysmä')).toBeVisible();
  });

  test('reference images present', async ({ page }) => {
    await expect(page.locator('img[src*="linoleum.JPG"]')).toBeVisible();
    await expect(page.locator('img[src*="kuisti.JPG"]')).toBeVisible();
    await expect(page.locator('img[src*="wc.jpg"]')).toBeVisible();
  });

  test('reference image captions', async ({ page }) => {
    await expect(page.getByText('Joustovinyylilaattalattia')).toBeVisible();
    await expect(page.getByText('Kuisti jossa maalattu puulattia')).toBeVisible();
    await expect(page.getByText('Wc/kylpyhuone')).toBeVisible();
  });

  test('year markers in references', async ({ page }) => {
    await expect(page.getByText('2012:', { exact: true })).toBeVisible();
    await expect(page.getByText('2017:', { exact: false })).toBeVisible();
    await expect(page.getByText('2018:', { exact: false })).toBeVisible();
  });
});
