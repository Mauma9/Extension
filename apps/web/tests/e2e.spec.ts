import { test, expect } from '@playwright/test';

// O Playwright usa a 'baseURL' definida no playwright.config.ts
test('PWA carrega e tem o título correto', async ({ page }) => {
  // page.goto('/') navega para a baseURL (http://localhost:8080)
  await page.goto('/');
  
  // Verifica se o título da página é o que definimos no index.html
  await expect(page).toHaveTitle(/PWA de Clima/);
});

test('Busca por cidade deve funcionar', async ({ page }) => {
  await page.goto('/');
  
  // Encontra os elementos na página
  const input = page.locator('#city-input');
  const button = page.locator('#search-button');
  
  // Digita o nome de uma cidade e clica
  // (Usamos uma cidade conhecida para o teste)
  await input.fill('São Paulo');
  await button.click();

  // Verifica se o resultado (h2) apareceu na div '#weather-result'
  // Damos um timeout maior (10s) para esperar a API responder
  const resultHeader = page.locator('#weather-result h2');
  
  await expect(resultHeader).toContainText('São Paulo', { timeout: 10000 });
});