import { test, expect } from '@playwright/test';

test('PWA carrega e tem o título correto', async ({ page }) => {
  // page.goto('/') navega para a baseURL (http://localhost:8080)
  await page.goto('/');
  
  // Verifica se o título da página é o que definimos no index.html
  await expect(page).toHaveTitle(/PWA de Clima/);
});

// --- TESTE ATUALIZADO MOCKANDO AS APIS PÚBLICAS CORRETAS ---
test('Busca por cidade deve funcionar (com mock)', async ({ page }) => {
  
  // --- Início do Mock (Chamada 1: Geocodificação) ---
  // Intercepta a chamada para a API PÚBLICA de geocodificação
  await page.route(
    'https://geocoding-api.open-meteo.com/v1/search**', // URLs que começam com isso
    async (route) => {
      console.log(`[Mock] Interceptando chamada de Geocodificação: ${route.request().url()}`);
      
      const mockResponse = {
        results: [
          {
            name: 'São Paulo',
            admin1: 'SP (Mock)',
            latitude: -23.5475,
            longitude: -46.63611,
          }
        ]
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    }
  );
  // --- Fim do Mock 1 ---

  // --- Início do Mock (Chamada 2: Clima) ---
  // Intercepta a chamada para a API PÚBLICA de clima
  await page.route(
    'https://api.open-meteo.com/v1/forecast**', // URLs que começam com isso
    async (route) => {
      console.log(`[Mock] Interceptando chamada de Clima: ${route.request().url()}`);
      
      const mockResponse = {
        current_weather: {
          temperature: 25.0, // Temperatura Fictícia
          weathercode: 3,    // 3 = Nublado
          windspeed: 10.0,
        },
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    }
  );
  // --- Fim do Mock 2 ---

  // O teste continua normal
  await page.goto('/');
  
  await page.locator('#city-input').fill('São Paulo');
  await page.locator('#search-button').click();

  // O PWA receberá os dados dos Mocks
  const resultHeader = page.locator('#weather-result h2');
  const temperature = page.locator('.temperature');
  const condition = page.locator('.condition');

  // Verifica se o PWA renderizou os dados do MOCK
  await expect(resultHeader).toContainText('São Paulo, SP (Mock)', { timeout: 10000 });
  await expect(temperature).toContainText('25.0°C');
  await expect(condition).toContainText('Nublado');
});