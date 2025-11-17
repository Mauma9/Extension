import { test, expect } from '@playwright/test';

test('PWA carrega e tem o título correto', async ({ page }) => {
  // page.goto('/') navega para a baseURL (http://localhost:8080)
  await page.goto('/');
  
  // Verifica se o título da página é o que definimos no index.html
  await expect(page).toHaveTitle(/PWA de Clima/);
});

// --- TESTE ATUALIZADO COM O MOCK CORRETO ---
test('Busca por cidade deve funcionar (com mock)', async ({ page }) => {
  
  // --- Início do Mock ---
  // Intercepta a chamada para a NOSSA API /api/search
  // Usamos 'http://localhost:3000' porque é isso que o main.js usa no CI
  await page.route(
    'http://localhost:3000/api/search?city=São%20Paulo', // A URL exata
    async (route) => {
      // Cria uma resposta JSON falsa (mock)
      const mockResponse = {
        name: 'São Paulo',
        admin1: 'SP (Mock)', // Adicionado (Mock) para termos certeza
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

  await page.goto('/');
  
  await page.locator('#city-input').fill('São Paulo');
  await page.locator('#search-button').click();

  // O PWA receberá os dados do MOCK
  const resultHeader = page.locator('#weather-result h2');
  const temperature = page.locator('.temperature');
  const condition = page.locator('.condition');

  // Verifica se o PWA renderizou os dados do MOCK
  await expect(resultHeader).toContainText('São Paulo, SP (Mock)', { timeout: 5000 });
  await expect(temperature).toContainText('25.0°C'); // Dado do mock
  await expect(condition).toContainText('Nublado'); // Dado do mock (código 3)
});