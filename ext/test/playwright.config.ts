import { defineConfig, devices } from '@playwright/test';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';


// Esta é a maneira moderna de obter o caminho do diretório (como o __dirname) 
// em projetos que usam ES Modules (sintaxe de 'import').
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Agora, a variável __dirname aponta corretamente para a pasta 'ext'


// Caminho para a pasta 'dist' (que está DENTRO de 'ext')
const distPath = path.join(__dirname, 'dist');

// Caminho para a pasta 'test' (que está DENTRO de 'ext')
const testDir = path.join(__dirname, 'test');


export default defineConfig({
  // Aponta para a pasta de testes correta
  testDir: testDir,
  
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  
  use: {
    headless: true, // Mude para false para ver o navegador abrir
  },
  
  projects: [
    {
      name: 'chromium-with-extension',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            // Caminhos da extensão corrigidos para apontar para 'ext/dist'
            `--disable-extensions-except=${distPath}`,
            `--load-extension=${distPath}`
          ]
        }
      }
    }
  ]
});