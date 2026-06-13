FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor portas
EXPOSE 5173

# Comando padrão (será sobrescrito pelo docker-compose)
CMD ["npm", "run", "dev"]
