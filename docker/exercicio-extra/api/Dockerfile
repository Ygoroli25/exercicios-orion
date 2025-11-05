FROM node:18-alpine

WORKDIR /app

# Instala apenas o necessário para rodar
COPY package*.json ./
RUN npm install --omit=dev

# Copia o código
COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
