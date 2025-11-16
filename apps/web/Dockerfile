# --- Estágio 1: Build (Construção) ---
# Usa a imagem Node 20 Alpine para construir o app
FROM node:20-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências (npm ci é melhor para CI/build)
RUN npm ci

# Copia todo o código-fonte do app
COPY . .

# Executa o script de build do Vite (gera a pasta 'dist')
RUN npm run build

# --- Estágio 2: Serve (Servidor) ---
# Usa a imagem leve do Nginx para servir os arquivos
FROM nginx:alpine

# Copia os arquivos estáticos construídos do estágio 'build' para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia os arquivos PWA da pasta 'public' (que o build do Vite pode não incluir no 'dist')
# NOTA: O Vite geralmente copia o conteúdo de 'public' para 'dist' automaticamente.
# Vamos manter estas linhas por segurança, caso a configuração do Vite mude.
COPY ./public/manifest.webmanifest /usr/share/nginx/html/
COPY ./public/sw.js /usr/share/nginx/html/
COPY ./public/icons /usr/share/nginx/html/icons

# Expõe a porta 80 (padrão do Nginx)
EXPOSE 80