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

# Copia TUDO da pasta 'dist' (do estágio 'build')
# para a pasta raiz do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80 (padrão do Nginx)
EXPOSE 80