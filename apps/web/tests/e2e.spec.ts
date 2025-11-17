import { test, expect } from '@playwright/test';

// O Playwright usa a 'baseURL' definida no playwright.config.ts
test('PWA carrega e tem o título correto', async ({ page }) => {
  // page.goto('/') navega para a baseURL (http://localhost:8080)
  await page.goto('/');
  
  // Verifica se o título da página é o que definimos no index.html
  await expect(page).toHaveTitle(/PWA de Clima/);
});

// --- TESTE ATUALIZADO COM MOCK ---
test('Busca por cidade deve funcionar (com mock)', async ({ page }) => {
  
  // --- Início do Mock ---
  // Intercepta a chamada de rede para a API PÚBLICA de clima
  await page.route(
    'https://api.open-meteo.com/v1/forecast**', // Intercepta qualquer URL que comece com isso
    async (route) => {
      // Cria uma resposta JSON falsa (mock)
      const mockResponse = {
        current_weather: {
          temperature: 25.0, // Temperatura Fictícia
          weathercode: 3,    // 3 = Nublado
          windspeed: 10.0,
        },
      };
      // Responde à chamada com o nosso JSON falso
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    }
  );
  // --- Fim do Mock ---

  // O teste continua normal, mas agora usará a resposta falsa
  await page.goto('/');
  
  const input = page.locator('#city-input');
  const button = page.locator('#search-button');
  
  // A chamada para a NOSSA api (/api/search) ainda funciona (ela bate no contêiner api)
  await input.fill('São Paulo');
  await button.click();

  // A segunda chamada (para api.open-meteo.com) será interceptada pelo mock
  const resultHeader = page.locator('#weather-result h2');
  const temperature = page.locator('.temperature');
  const condition = page.locator('.condition');

  // Verifica se o PWA renderizou os dados do MOCK
  await expect(resultHeader).toContainText('São Paulo', { timeout: 5000 }); // Pode ser rápido agora
  await expect(temperature).toContainText('25.0°C'); // Dado do mock
  await expect(condition).toContainText('Nublado'); // Dado do mock (código 3)
});