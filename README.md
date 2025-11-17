# Bootcamp II - PWA de Clima (Entrega Final)

[![CI/CD - PWA Bootcamp](https://github.com/Mauma9/bootcamp2-chrome-ext-Mauma9/actions/workflows/ci.yml/badge.svg)](https://github.com/Mauma9/bootcamp2-chrome-ext-Mauma9/actions)

Este repositório contém a entrega final do Bootcamp II: um **Progressive Web App (PWA)** de Clima, derivado da ideia original de uma extensão do Chrome.

O PWA permite ao usuário buscar o clima atual de qualquer cidade. Ele utiliza uma arquitetura "monorepo" (`apps/web` e `apps/api`), é totalmente containerizado com Docker e orquestrado com Docker Compose. O processo de build, teste e deploy é 100% automatizado via GitHub Actions.

O PWA está publicado e disponível para acesso e instalação através do GitHub Pages:

**[➡️ Acessar o PWA de Clima aqui](https://mauma9.github.io/bootcamp2-chrome-ext-Mauma9/)**

---

## ✨ Funcionalidades Principais

* **PWA (Progressive Web App):** Pode ser "instalado" no desktop ou celular, funcionando como um aplicativo nativo.
* **API de Clima:** Busca dados de temperatura, velocidade do vento e condição do tempo (ex: "Nublado", "Céu limpo") usando a API pública [Open-Meteo](https://open-meteo.com/).
* **Geocodificação:** Converte nomes de cidades (ex: "São Paulo") em coordenadas (latitude/longitude) para a busca do clima.
* **Cache Offline:** Utiliza um Service Worker (`sw.js`) com a estratégia "Cache-First" para que o aplicativo carregue instantaneamente e funcione offline (para os arquivos principais do app).

## 🛠️ Tecnologias Utilizadas

* **Frontend (PWA):** Vite (JavaScript puro, ES Modules), HTML5, CSS3.
* **Backend (API Proxy):** Node.js, Express, Cors.
* **API Externa:** Open-Meteo (Geocodificação e Previsão do Tempo).
* **Testes E2E:** Playwright (com "mocking" de APIs).
* **Containerização:** Docker, Docker Compose.
* **CI/CD (DevOps):** GitHub Actions.

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura monorepo com dois serviços principais (`apps/api` e `apps/web`), orquestrados pelo `docker-compose.yml`.

### Fluxo de Dados (Local vs. Produção)

O PWA opera de duas formas, dependendo do ambiente:

**1. Ambiente Local (com `docker compose up`)**
O PWA (`web`) adota uma estratégia **híbrida** para contornar problemas de rede do Docker (`ETIMEDOUT`):
* **Chamada 1 (Geocodificação):** O navegador chama nosso backend local (`api`), que por sua vez chama a API externa de geocodificação.
* **Chamada 2 (Clima):** O navegador (que tem acesso direto à internet) chama a API externa de clima diretamente.

* **Chamada 1 Geocodificação (via Backend):** Navegador (em localhost:8080) ──(fetch)──> Contêiner 'api' (em localhost:3000) ──(fetch)──> API Externa (Geocoding)

* **Chamada 2 Clima (Direto):** Navegador (em localhost:8080) ──(fetch)──> API Externa (Weather)


**2. Ambiente de Produção (GitHub Pages)**
Como o GitHub Pages não pode hospedar nosso backend (`api`), o PWA (compilado em modo `PROD`) é inteligente e chama **diretamente** as duas APIs públicas do Open-Meteo, sem usar nosso proxy.

### Endpoints da API (Serviço `apps/api`)

Quando rodando localmente, o backend expõe um endpoint:

* `GET /api/search?city=<nome_da_cidade>`
    * **O que faz:** Converte o nome de uma cidade (ex: "São Paulo") em dados de geocodificação (latitude, longitude, nome do estado, etc.).
    * **Exemplo de uso:** `http://localhost:3000/api/search?city=Brasilia`

---

## 🐳 Executando Localmente (Docker Compose)

Este é o método principal para rodar o ambiente de desenvolvimento completo.

**Pré-requisitos:**
* Docker Desktop (ou Docker Engine + Compose) instalado e rodando.
* Node.js v20+ (para o VS Code entender o projeto, as dependências são instaladas no Docker).

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Mauma9/bootcamp2-chrome-ext-Mauma9.git](https://github.com/Mauma9/bootcamp2-chrome-ext-Mauma9.git)
    cd bootcamp2-chrome-ext-Mauma9
    ```

2.  **Instale as dependências (Primeira vez):**
    * (Opcional, mas recomendado para o VS Code reconhecer os pacotes)
    ```bash
    # Instala o backend
    cd apps/api
    npm install
    
    # Instala o frontend
    cd ../web
    npm install
    
    # Volta para a raiz
    cd ../.. 
    ```

3.  **Construa as imagens Docker:**
    * (Na raiz do projeto `C:\BootcampII`)
    ```bash
    docker compose build
    ```

4.  **Inicie os serviços (API + Web):**
    ```bash
    docker compose up
    ```
    * (Para rodar em segundo plano, use `docker compose up -d`)

5.  **Acesse o PWA:**
    * Abra seu navegador em: **`http://localhost:8080`**

6.  **Para parar os serviços:**
    * Pressione `Ctrl + C` no terminal ou rode `docker compose down`.

---

## 🧪 Testes E2E (Playwright)

Os testes automatizados verificam se o PWA carrega e se a busca de clima está funcionando contra os contêineres em execução.

1.  Inicie os serviços (conforme passo 4 acima):
    ```bash
    docker compose up -d
    ```
2.  Navegue até a pasta `web` e execute os testes:
    ```bash
    cd apps/web
    npm run test:e2e
    ```
3.  Para ver o relatório HTML dos testes:
    ```bash
    npx playwright show-report playwright-report
    ```
4.  Pare os serviços quando terminar:
    ```bash
    docker compose down
    ```

---

## ⚙️ CI/CD (GitHub Actions)

O workflow em `.github/workflows/ci.yml` automatiza todo o processo.

### Job 1: `build-and-test`
* **Gatilho:** Executa em `push` ou `pull_request` para a branch `main`.
* **O que faz:**
    1.  Faz checkout do código.
    2.  Instala dependências (`npm ci`) para `api` e `web`.
    3.  Instala os navegadores do Playwright.
    4.  Constrói as imagens Docker (`docker compose build`).
    5.  Sobe os contêineres (`docker compose up -d`).
    6.  Aguarda a API ficar pronta (usando um "Health Check" `curl`).
    7.  Executa os testes E2E (`npm run test:e2e`). (Os testes usam "mocks" para não depender da rede externa).
    8.  Para os contêineres (`docker compose down`).
    9.  Publica os artefatos (`web-dist` e `playwright-report`).

### Job 2: `deploy-pages`
* **Gatilho:** Executa **apenas** se o job `build-and-test` for bem-sucedido **E** se o evento for um `push` na branch `main`.
* **O que faz:**
    1.  Baixa o artefato `web-dist`.
    2.  Configura o GitHub Pages.
    3.  Faz o deploy automático do PWA.