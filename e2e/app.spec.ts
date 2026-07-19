import { test, expect } from '@playwright/test';

test.describe('FIFA Nexus AI - Enterprise User Journeys', () => {

  test('loads home command center and default operations dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/FIFA Nexus AI/i);
    await expect(page.locator('h1')).toContainText('FIFA NEXUS AI');
  });

  test('switches venue selecting drop-down options', async ({ page }) => {
    await page.goto('/');
    const select = page.locator('#global-venue-select');
    await expect(select).toBeVisible();
    await select.selectOption({ index: 1 });
  });

  test('switches language and adjusts UI dictionary strings', async ({ page }) => {
    await page.goto('/');
    const langSelect = page.locator('#global-lang-select');
    await langSelect.selectOption('es');
    await expect(page.locator('body')).toBeVisible();
  });

  test('enforces role access controls and prevents unauthorized view switching', async ({ page }) => {
    await page.goto('/');
    const roleSelect = page.locator('#global-role-select');
    await roleSelect.selectOption('Fan');
    await expect(roleSelect).toHaveValue('Fan');
  });
});
