# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copia apenas os manifests primeiro para melhor cache das dependências
COPY package*.json ./

# Instala dependências
RUN npm ci --omit=dev || npm install --omit=dev

# Copia o restante do código
COPY . .

EXPOSE 3000

# Comando de execução
CMD ["npm", "start"]

