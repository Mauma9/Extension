# Usa uma imagem Node.js leve
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm ci --omit=dev

# Copia o restante do código (index.js)
COPY . .

# Expõe a porta que o servidor usa
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "index.js"]