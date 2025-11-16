import { defineConfig, devices } from '@playwright/test';

// Define a URL base. O Docker Compose vai sobrepor 'localhost:8080'
// com a variável de ambiente E2E_BASE_URL (http://web)
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:8080';

export default defineConfig({
  // Diretório onde os arquivos de teste estão
  testDir: './tests',
  
  // Onde salvar os relatórios
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  
  use: {
    // URL base para todas as ações (ex: page.goto('/'))
    baseURL: baseURL,
    
    // Rodar sem abrir o navegador (modo headless)
    headless: true,
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});