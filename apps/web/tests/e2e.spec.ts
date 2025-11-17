import { test, expect } from '@playwright/test';

test('PWA carrega e tem o título correto', async ({ page }) => {
  // page.goto('/') navega para a baseURL (http://localhost:8080)
  await page.goto('/');
  
  // Verifica se o título da página é o que definimos no index.html
  await expect(page).toHaveTitle(/PWA de Clima/);
});

// --- TESTE ATUALIZADO COM O MOCK CORRETO E ROBUSTO ---
test('Busca por cidade deve funcionar (com mock)', async ({ page }) => {
  
  // --- Início do Mock ---
  // Intercepta a chamada para a NOSSA API /api/search
  // Usamos um "Glob Pattern" (**) para garantir que a chamada seja interceptada
  // independentemente do domínio (localhost, api, etc.) ou da codificação da URL (S%C3%A3o Paulo)
  await page.route(
    '**/api/search?city=*', // <-- MUDANÇA CRUCIAL AQUI
    async (route) => {
      // Pega a URL da requisição (só para debug no log do CI)
      const url = route.request().url();
      console.log(`[Mock] Interceptando chamada: ${url}`);
      
      // Cria uma resposta JSON falsa (mock)
      const mockResponse = {
        name: 'São Paulo', // O PWA usa isso
        admin1: 'SP (Mock)', // O PWA usa isso
        current_weather: { // O PWA usa isso
          temperature: 25.0,
          weathercode: 3, // 3 = Nublado
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
  // Aumentei o timeout de volta para 10s por segurança
  await expect(resultHeader).toContainText('São Paulo, SP (Mock)', { timeout: 10000 });
  await expect(temperature).toContainText('25.0°C');
  await expect(condition).toContainText('Nublado');
});