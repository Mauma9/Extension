# Usa a imagem oficial do Microsoft Playwright que inclui Node, navegadores e dependências
FROM mcr.microsoft.com/playwright:v1.45.1-jammy
# Usando v1.45.1 para corresponder à sua versão atual do @playwright/test. Ajuste se necessário.

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia apenas os arquivos de pacote do diretório 'ext' primeiro para aproveitar o cache do Docker
COPY ext/package.json ext/package-lock.json ./ext/

# Define o diretório de trabalho para onde os comandos npm devem ser executados
WORKDIR /app/ext

# Instala as dependências do projeto usando npm ci (instalação limpa)
RUN npm ci --silent

# Copia o restante do código-fonte da extensão para o diretório /app/ext do contêiner
COPY ext/ .

# Executa o script de build para gerar a pasta dist/ dentro de /app/ext
RUN node scripts/build-extensions.mjs

# Comando padrão a ser executado quando o contêiner iniciar (executará os testes)
CMD ["npm", "test"]