import { test, expect } from '@playwright/test';
const BASE = process.env.E2E_BASE_URL || 'http://localhost:8080';

test('PWA carrega e consome API', async ({ page }) => {
  await page.goto(BASE);
  await expect(page).toHaveTitle(/Bootcamp/);
  await page.waitForSelector('[data-testid="api-ok"]');
});
